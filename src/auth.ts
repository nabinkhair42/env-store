import clientPromise from '@/lib/db';
import { env } from '@/schema/env';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
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
    async signIn({ user }) {
      if (!user?.id || !user?.email) return;

      try {
        const client = await clientPromise;
        const db = client.db(env.DATABASE_NAME);

        // Link invites sent to this email
        await db.collection('members').updateMany(
          {
            userId: null,
            invitedEmail: user.email.toLowerCase(),
          },
          {
            $set: { userId: user.id, updatedAt: new Date() },
          },
        );

        // Link invites sent to this GitHub username
        // Fetch the user's GitHub profile to get their login (username)
        const account = await db.collection('accounts').findOne({
          userId: user.id,
          provider: 'github',
        });

        if (account?.providerAccountId) {
          try {
            const res = await fetch(
              `https://api.github.com/user/${account.providerAccountId}`,
              { headers: { Accept: 'application/vnd.github.v3+json' } },
            );
            if (res.ok) {
              const ghProfile = await res.json();
              const ghUsername = (ghProfile.login as string)?.toLowerCase();
              if (ghUsername) {
                await db.collection('members').updateMany(
                  {
                    userId: null,
                    invitedGithubUsername: ghUsername,
                  },
                  {
                    $set: { userId: user.id, updatedAt: new Date() },
                  },
                );
              }
            }
          } catch {
            // Non-critical — invites will link on next sign-in
          }
        }
      } catch (error) {
        console.error('Error linking pending invites:', error);
      }
    },
  },
});
