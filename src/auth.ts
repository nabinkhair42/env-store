import clientPromise from '@/lib/db';
import { env } from '@/schema/env';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { ObjectId, type Document } from 'mongodb';
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

export const { handlers, signIn, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GitHub({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: '/',
  },
  events: {
    // When a user signs in, link any pending invites to their account
    // AND create in-app notifications so they actually see the invitation.
    async signIn({ user }) {
      if (!user?.id) return;

      try {
        const client = await clientPromise;
        const db = client.db(env.DATABASE_NAME);

        // Look up the user's GitHub username via the linked account
        const account = await db.collection('accounts').findOne({
          userId: user.id,
          provider: 'github',
        });

        let ghUsername: string | null = null;
        if (account?.providerAccountId) {
          try {
            const res = await fetch(
              `https://api.github.com/user/${account.providerAccountId}`,
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
            // Non-critical — invites will link on next sign-in
          }
        }

        // Find unlinked invites matching this user's email OR GitHub username
        const orFilters: Document[] = [];
        if (user.email) {
          orFilters.push({ invitedEmail: user.email.toLowerCase() });
        }
        if (ghUsername) {
          orFilters.push({ invitedGithubUsername: ghUsername });
        }

        if (orFilters.length === 0) return;

        const pendingInvites = await db
          .collection('members')
          .find({ userId: null, $or: orFilters })
          .toArray();

        if (pendingInvites.length === 0) return;

        const memberIds = pendingInvites.map((m) => m._id);

        // Link them to the user
        await db.collection('members').updateMany(
          { _id: { $in: memberIds } },
          { $set: { userId: user.id, updatedAt: new Date() } },
        );

        // Look up project + inviter names for the notification copy
        const projectObjectIds = [
          ...new Set(pendingInvites.map((m) => String(m.projectId))),
        ].map((id) => new ObjectId(id));
        const inviterObjectIds = [
          ...new Set(pendingInvites.map((m) => String(m.invitedBy))),
        ].map((id) => new ObjectId(id));

        const [projects, inviters] = await Promise.all([
          db
            .collection('projects')
            .find({ _id: { $in: projectObjectIds } })
            .project({ name: 1 })
            .toArray(),
          db
            .collection('users')
            .find({ _id: { $in: inviterObjectIds } })
            .project({ name: 1 })
            .toArray(),
        ]);

        const projectName = new Map(
          projects.map((p) => [String(p._id), p.name as string]),
        );
        const inviterName = new Map(
          inviters.map((u) => [String(u._id), u.name as string]),
        );

        // Skip notifications for invites we already notified about (defensive —
        // shouldn't happen since `userId: null` filter prevents re-runs, but
        // guards against a race where two sign-ins happen simultaneously).
        const existingNotifs = await db
          .collection('notifications')
          .find({
            userId: user.id,
            type: 'invite',
            'metadata.memberId': { $in: memberIds.map((id) => id.toString()) },
          })
          .project({ 'metadata.memberId': 1 })
          .toArray();
        const alreadyNotified = new Set(
          existingNotifs.map((n) => n.metadata?.memberId as string),
        );

        const now = new Date();
        const notifications = pendingInvites
          .filter((m) => !alreadyNotified.has(m._id.toString()))
          .map((m) => ({
            userId: user.id,
            type: 'invite' as const,
            title: 'Project Invitation',
            message: `${inviterName.get(String(m.invitedBy)) || 'Someone'} invited you to "${projectName.get(String(m.projectId)) || 'a project'}" as ${m.role}`,
            metadata: {
              projectId: String(m.projectId),
              projectName: projectName.get(String(m.projectId)),
              memberId: m._id.toString(),
              role: m.role as string,
            },
            read: false,
            createdAt: now,
          }));

        if (notifications.length > 0) {
          await db.collection('notifications').insertMany(notifications);
        }
      } catch (error) {
        console.error('Error linking pending invites:', error);
      }
    },
  },
});
