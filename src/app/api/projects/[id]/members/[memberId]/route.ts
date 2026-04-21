import { auth } from '@/auth';
import { checkProjectAccess } from '@/lib/access-control';
import { client } from '@/lib/db';
import { env } from '@/schema/env';
import { UpdateMemberRoleSchema } from '@/schema';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string; memberId: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: projectId, memberId } = await params;
    const access = await checkProjectAccess(projectId, session.user.id, 'owner');
    if (!access.allowed)
      return NextResponse.json({ error: access.error }, { status: access.status });

    const body = await request.json();
    const { role } = UpdateMemberRoleSchema.parse(body);

    const db = client.db(env.DATABASE_NAME);
    const result = await db.collection('members').findOneAndUpdate(
      { _id: new ObjectId(memberId), projectId },
      { $set: { role, updatedAt: new Date() } },
      { returnDocument: 'after' },
    );

    if (!result)
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });

    // Notify the member
    if (result.userId) {
      await db.collection('notifications').insertOne({
        userId: result.userId,
        type: 'role_changed',
        title: 'Role Updated',
        message: `Your role in "${access.project.name}" was changed to ${role}`,
        metadata: { projectId, projectName: access.project.name, role },
        read: false,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ member: result, message: 'Role updated' });
  } catch (error) {
    console.error('Error updating member role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: projectId, memberId } = await params;
    const db = client.db(env.DATABASE_NAME);

    const member = await db
      .collection('members')
      .findOne({ _id: new ObjectId(memberId), projectId });

    if (!member)
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });

    // Allow owner to remove anyone, or member to remove themselves
    const isSelfRemoval = member.userId === session.user.id;
    if (!isSelfRemoval) {
      const access = await checkProjectAccess(projectId, session.user.id, 'owner');
      if (!access.allowed)
        return NextResponse.json({ error: access.error }, { status: access.status });
    }

    await db.collection('members').deleteOne({ _id: new ObjectId(memberId) });

    // Notify the removed member (if removed by owner)
    if (!isSelfRemoval && member.userId) {
      const project = await db
        .collection('projects')
        .findOne({ _id: new ObjectId(projectId) });

      await db.collection('notifications').insertOne({
        userId: member.userId,
        type: 'removed',
        title: 'Removed from Project',
        message: `You were removed from "${project?.name || 'a project'}"`,
        metadata: { projectId, projectName: project?.name },
        read: false,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ message: 'Member removed' });
  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
