import { auth } from '@/auth';
import { client } from '@/lib/db';
import { sendNotificationEmail } from '@/lib/email';
import { env } from '@/schema/env';
import { RespondToInviteSchema } from '@/schema';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { memberId } = await params;
    const body = await request.json();
    const { action } = RespondToInviteSchema.parse(body);

    const db = client.db(env.DATABASE_NAME);
    const member = await db
      .collection('members')
      .findOne({ _id: new ObjectId(memberId) });

    if (!member || member.status !== 'pending')
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });

    // Verify this invite belongs to the current user
    if (member.userId !== session.user.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const newStatus = action === 'accept' ? 'accepted' : 'declined';

    // Run status update + project lookup in parallel — they don't depend on each other
    const [, project] = await Promise.all([
      db.collection('members').updateOne(
        { _id: new ObjectId(memberId) },
        { $set: { status: newStatus, updatedAt: new Date() } },
      ),
      db.collection('projects').findOne({ _id: new ObjectId(member.projectId) }),
    ]);

    if (project) {
      const notifType = action === 'accept' ? 'invite_accepted' : 'invite_declined';
      const actionText = action === 'accept' ? 'accepted' : 'declined';

      // Notification insert + owner lookup in parallel
      const [, owner] = await Promise.all([
        db.collection('notifications').insertOne({
          userId: project.userId,
          type: notifType,
          title: `Invitation ${actionText}`,
          message: `${session.user.name || 'A user'} ${actionText} your invitation to "${project.name}"`,
          metadata: {
            projectId: member.projectId,
            projectName: project.name,
            memberId,
          },
          read: false,
          createdAt: new Date(),
        }),
        db.collection('users').findOne({ _id: new ObjectId(project.userId) }),
      ]);

      if (owner?.email) {
        // Fire-and-forget — don't block response on email
        sendNotificationEmail({
          to: owner.email,
          subject: `Invitation ${actionText} — ${project.name}`,
          message: `${session.user.name || 'A user'} ${actionText} your invitation to collaborate on "${project.name}".`,
        }).catch(() => {});
      }
    }

    return NextResponse.json({
      message: `Invitation ${action === 'accept' ? 'accepted' : 'declined'}`,
    });
  } catch (error) {
    console.error('Error responding to invite:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
