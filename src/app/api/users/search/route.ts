import { auth } from '@/auth';
import { client } from '@/lib/db';
import { fetchGitHubUser } from '@/lib/github';
import { env } from '@/schema/env';
import { IUserSearchResult } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const q = request.nextUrl.searchParams.get('q')?.trim().toLowerCase();
    if (!q || q.length < 2)
      return NextResponse.json({ user: null });

    const db = client.db(env.DATABASE_NAME);
    const isEmail = q.includes('@');

    // --- Search by email ---
    if (isEmail) {
      const user = await db
        .collection('users')
        .findOne({ email: q }, { projection: { name: 1, email: 1, image: 1 } });

      if (!user || user._id.toString() === session.user.id)
        return NextResponse.json({ user: null });

      const result: IUserSearchResult = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        source: 'local',
      };
      return NextResponse.json({ user: result });
    }

    // --- Search by GitHub username ---
    const ghUser = await fetchGitHubUser(q);
    if (!ghUser) return NextResponse.json({ user: null });

    // Check if this GitHub user exists in our DB
    const account = await db
      .collection('accounts')
      .findOne({ provider: 'github', providerAccountId: String(ghUser.id) });

    if (account && account.userId.toString() !== session.user.id) {
      const user = await db
        .collection('users')
        .findOne({ _id: account.userId }, { projection: { name: 1, email: 1, image: 1 } });

      if (user) {
        const result: IUserSearchResult = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image ?? ghUser.avatar_url,
          source: 'local',
        };
        return NextResponse.json({ user: result });
      }
    }

    // Not in our DB — return GitHub profile
    const result: IUserSearchResult = {
      id: ghUser.login,
      name: ghUser.name || ghUser.login,
      email: ghUser.email,
      image: ghUser.avatar_url,
      source: 'github',
    };
    return NextResponse.json({ user: result });
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
