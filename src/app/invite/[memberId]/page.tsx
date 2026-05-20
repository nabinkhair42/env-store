import { auth } from '@/auth';
import { client } from '@/lib/db';
import { env } from '@/schema/env';
import { ObjectId } from 'mongodb';
import { InviteAcceptCard } from './invite-accept-card';
import { InviteStateCard } from './invite-state-card';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ memberId: string }>;
}

export default async function InvitePage({ params }: PageProps) {
  const { memberId } = await params;
  const session = await auth();

  if (!ObjectId.isValid(memberId)) {
    return (
      <InviteStateCard
        title="Invitation not found"
        description="This invitation link is invalid. Ask the project owner to share it again."
      />
    );
  }

  // Not signed in — prompt sign-in. The auth signIn event will link this invite
  // by email or GitHub username on first sign-in.
  if (!session?.user?.id) {
    return (
      <InviteStateCard
        title="Sign in to view your invitation"
        description="You've been invited to collaborate on a project. Sign in with GitHub to accept."
        showSignIn
        callbackPath={`/invite/${memberId}`}
      />
    );
  }

  const db = client.db(env.DATABASE_NAME);
  const member = await db
    .collection('members')
    .findOne({ _id: new ObjectId(memberId) });

  if (!member) {
    return (
      <InviteStateCard
        title="Invitation not found"
        description="This invitation may have been revoked or already accepted."
      />
    );
  }

  // Invite is unlinked — try to attach it to the current user if they match
  // by email or GitHub username. This is the fallback when the signIn event
  // didn't fire (e.g. they were already signed in before being invited).
  if (!member.userId) {
    const userEmail = session.user.email?.toLowerCase();
    const ghAccount = await db.collection('accounts').findOne({
      userId: session.user.id,
      provider: 'github',
    });

    let ghUsername: string | null = null;
    if (ghAccount?.providerAccountId) {
      try {
        const res = await fetch(
          `https://api.github.com/user/${ghAccount.providerAccountId}`,
          {
            headers: { Accept: 'application/vnd.github.v3+json' },
            next: { revalidate: 3600 },
          },
        );
        if (res.ok) {
          const ghProfile = await res.json();
          ghUsername = (ghProfile.login as string)?.toLowerCase() ?? null;
        }
      } catch {
        // ignore
      }
    }

    const matches =
      (userEmail && member.invitedEmail === userEmail) ||
      (ghUsername && member.invitedGithubUsername === ghUsername);

    if (matches) {
      await db
        .collection('members')
        .updateOne(
          { _id: new ObjectId(memberId) },
          { $set: { userId: session.user.id, updatedAt: new Date() } },
        );
      member.userId = session.user.id;
    }
  }

  if (member.userId !== session.user.id) {
    return (
      <InviteStateCard
        title="This invitation isn't for you"
        description="The invitation was sent to a different user. Sign in with the account it was sent to, or ask the project owner to invite you directly."
      />
    );
  }

  if (member.status === 'accepted') {
    return (
      <InviteStateCard
        title="Already accepted"
        description="You've already accepted this invitation."
        ctaHref={`/dashboard/${member.projectId}`}
        ctaLabel="Open project"
      />
    );
  }

  if (member.status === 'declined') {
    return (
      <InviteStateCard
        title="Invitation declined"
        description="You previously declined this invitation. Ask the project owner to invite you again if this was a mistake."
        ctaHref="/dashboard"
        ctaLabel="Go to dashboard"
      />
    );
  }

  const [project, inviter] = await Promise.all([
    db
      .collection('projects')
      .findOne({ _id: new ObjectId(member.projectId) }, { projection: { name: 1 } }),
    db
      .collection('users')
      .findOne({ _id: new ObjectId(member.invitedBy) }, { projection: { name: 1, image: 1 } }),
  ]);

  return (
    <InviteAcceptCard
      memberId={memberId}
      projectId={member.projectId as string}
      projectName={project?.name ?? 'Unknown project'}
      inviterName={inviter?.name ?? 'Someone'}
      inviterImage={inviter?.image ?? null}
      role={member.role as 'editor' | 'viewer'}
    />
  );
}
