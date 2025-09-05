import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import client from '@/lib/db';

export const { handlers, signIn, auth } = NextAuth({
  adapter: MongoDBAdapter(client),

  providers: [GitHub],
  pages: {
    signIn: '/login',
  },

  callbacks: {
    session: ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
