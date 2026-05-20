import { auth } from '@/auth';
import { checkProjectAccess } from '@/lib/access-control';
import { client } from '@/lib/db';
import { sendInviteEmail } from '@/lib/email';
import { fetchGitHubUser } from '@/lib/github';
import { siteConfig } from '@/lib/sitemap';
import { env } from '@/schema/env';
import { InviteMemberSchema } from '@/schema';
import { IMember, InviteEmailStatus } from '@/types';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const access = await checkProjectAccess(id, session.user.id, 'viewer');
    if (!access.allowed)
      return NextResponse.json({ error: access.error }, { status: access.status });

    const db = client.db(env.DATABASE_NAME);

    // Self-heal: resolve members with null userId by matching email or GitHub username
    // Run all orphan resolutions in parallel since they're independent
    const orphanedMembers = await db
      .collection('members')
      .find({ projectId: id, userId: null })
      .toArray();

    if (orphanedMembers.length > 0) {
      await Promise.all(
        orphanedMembers.map(async (m) => {
          let resolvedUserId: string | null = null;

          if (m.invitedEmail) {
            const user = await db.collection('users').findOne({ email: m.invitedEmail });
            if (user) resolvedUserId = user._id.toString();
          }

          if (!resolvedUserId && m.invitedGithubUsername) {
            const ghUser = await fetchGitHubUser(m.invitedGithubUsername);
            if (ghUser) {
              const account = await db.collection('accounts').findOne({
                provider: 'github',
                providerAccountId: String(ghUser.id),
              });
              if (account) resolvedUserId = account.userId.toString();
            }
          }

          if (resolvedUserId) {
            await db.collection('members').updateOne(
              { _id: m._id },
              { $set: { userId: resolvedUserId, updatedAt: new Date() } },
            );
          }
        }),
      );
    }

    const members = await db
      .collection<IMember>('members')
      .aggregate([
        { $match: { projectId: id } },
        {
          $lookup: {
            from: 'users',
            let: { uid: { $cond: { if: { $ne: ['$userId', null] }, then: { $toObjectId: '$userId' }, else: null } } },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$uid'] } } },
              { $project: { name: 1, email: 1, image: 1 } },
            ],
            as: 'userInfo',
          },
        },
        {
          $addFields: {
            user: { $arrayElemAt: ['$userInfo', 0] },
          },
        },
        { $project: { userInfo: 0 } },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();

    return NextResponse.json({ members });
  } catch (error) {
    console.error('Error listing members:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: projectId } = await params;
    const access = await checkProjectAccess(projectId, session.user.id, 'owner');
    if (!access.allowed)
      return NextResponse.json({ error: access.error }, { status: access.status });

    const body = await request.json();
    const { identifier, role } = InviteMemberSchema.parse(body);

    const db = client.db(env.DATABASE_NAME);
    const isEmail = identifier.includes('@');

    // Look up the user
    let targetUserId: string | null = null;
    let targetEmail: string | null = null;
    let targetGithubUsername: string | null = null;

    if (isEmail) {
      targetEmail = identifier.toLowerCase();
      const user = await db.collection('users').findOne({ email: targetEmail });
      if (user) targetUserId = user._id.toString();
    } else {
      targetGithubUsername = identifier.toLowerCase();

      // Fetch GitHub profile to verify the user exists and get their numeric ID
      const ghUser = await fetchGitHubUser(targetGithubUsername);

      if (!ghUser) {
        return NextResponse.json(
          {
            error: `GitHub user "${targetGithubUsername}" not found. Check the username or invite by email instead.`,
          },
          { status: 404 },
        );
      }

      // Search our DB using the GitHub numeric ID
      const account = await db.collection('accounts').findOne({
        provider: 'github',
        providerAccountId: String(ghUser.id),
      });

      if (account) {
        // User exists in our DB
        targetUserId = account.userId.toString();
        const user = await db.collection('users').findOne({
          _id: new ObjectId(account.userId),
        });
        if (user?.email) targetEmail = user.email.toLowerCase();
      } else if (ghUser.email) {
        // Not in our DB but GitHub has their public email
        targetEmail = ghUser.email.toLowerCase();
      }
    }

    // Can't invite yourself
    if (targetUserId === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot invite yourself' },
        { status: 400 },
      );
    }

    // Check for existing membership
    const existingQuery = targetUserId
      ? { projectId, userId: targetUserId }
      : targetEmail
        ? { projectId, invitedEmail: targetEmail }
        : { projectId, invitedGithubUsername: targetGithubUsername };

    const existing = await db.collection('members').findOne(existingQuery);
    if (existing) {
      return NextResponse.json(
        { error: 'This user has already been invited' },
        { status: 409 },
      );
    }

    const now = new Date();
    const member: Omit<IMember, '_id'> = {
      projectId,
      userId: targetUserId,
      invitedEmail: targetEmail,
      invitedGithubUsername: targetGithubUsername,
      role,
      status: 'pending',
      invitedBy: session.user.id,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('members').insertOne(member);
    const memberId = result.insertedId.toString();
    const inviteUrl = `${siteConfig.url}/invite/${memberId}`;

    // In-app notification for known users (sync — we want it visible immediately)
    if (targetUserId) {
      try {
        await db.collection('notifications').insertOne({
          userId: targetUserId,
          type: 'invite',
          title: 'Project Invitation',
          message: `${session.user.name || 'Someone'} invited you to "${access.project.name}" as ${role}`,
          metadata: {
            projectId,
            projectName: access.project.name,
            memberId,
            role,
          },
          read: false,
          createdAt: now,
        });
      } catch (err) {
        console.error('[invite] Failed to insert notification:', err);
      }
    }

    // Await email so we can report real delivery status back to the inviter.
    // Resend errors are logged but do not fail the invite (the DB invite is the
    // source of truth — the link can be shared manually if email failed).
    let emailStatus: InviteEmailStatus = 'no_email';
    if (targetEmail) {
      const emailResult = await sendInviteEmail({
        to: targetEmail,
        inviterName: session.user.name || 'A team member',
        projectName: access.project.name,
        role,
        inviteUrl,
      });
      emailStatus = emailResult.status;
    }

    return NextResponse.json(
      {
        member: { ...member, _id: result.insertedId },
        message: 'Invitation sent',
        emailStatus,
        inviteUrl,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error inviting member:', error);
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid data', details: error }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
