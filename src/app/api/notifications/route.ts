import { auth } from '@/auth';
import { client } from '@/lib/db';
import { env } from '@/schema/env';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const unreadOnly = request.nextUrl.searchParams.get('unreadOnly') === 'true';
    const db = client.db(env.DATABASE_NAME);

    const filter: Record<string, unknown> = { userId: session.user.id };
    if (unreadOnly) filter.read = false;

    const [notifications, unreadCount] = await Promise.all([
      db
        .collection('notifications')
        .find(filter)
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray(),
      db
        .collection('notifications')
        .countDocuments({ userId: session.user.id, read: false }),
    ]);

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
