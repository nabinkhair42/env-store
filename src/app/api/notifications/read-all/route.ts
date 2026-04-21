import { auth } from '@/auth';
import { client } from '@/lib/db';
import { env } from '@/schema/env';
import { NextResponse } from 'next/server';

export async function PUT() {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = client.db(env.DATABASE_NAME);
    await db
      .collection('notifications')
      .updateMany({ userId: session.user.id, read: false }, { $set: { read: true } });

    return NextResponse.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
