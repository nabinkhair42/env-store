import { auth } from '@/auth';
import { client } from '@/lib/db';
import { env } from '@/schema/env';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const db = client.db(env.DATABASE_NAME);

    const result = await db.collection('notifications').updateOne(
      { _id: new ObjectId(id), userId: session.user.id },
      { $set: { read: true } },
    );

    if (result.matchedCount === 0)
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });

    return NextResponse.json({ message: 'Marked as read' });
  } catch (error) {
    console.error('Error marking notification read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
