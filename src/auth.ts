import { env } from '@/env';
import clientPromise from '@/lib/db';
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
});
