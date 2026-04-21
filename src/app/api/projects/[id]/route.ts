import { auth } from '@/auth';
import { checkProjectAccess } from '@/lib/access-control';
import {
  safeDecryptEnvironments,
  safeEncryptEnvironments,
} from '@/lib/crypto-helpers';
import { client } from '@/lib/db';
import { migrateProjectToEnvironments } from '@/lib/migration';
import { env } from '@/schema/env';
import { UpdateProjectSchema } from '@/schema';
import { IProject } from '@/types';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const access = await checkProjectAccess(id, session.user.id, 'viewer');
    if (!access.allowed)
      return NextResponse.json({ error: access.error }, { status: access.status });

    const environments = migrateProjectToEnvironments(access.project);
    const { environments: decrypted, failedKeys } = safeDecryptEnvironments(environments);

    const decryptedProject = {
      ...access.project,
      environments: decrypted,
      variables: undefined,
      memberRole: access.role,
    };

    return NextResponse.json({
      project: decryptedProject,
      ...(failedKeys.length > 0 && {
        warning: `Failed to decrypt variables: ${failedKeys.join(', ')}.`,
      }),
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [body, { id }] = await Promise.all([request.json(), params]);

    const access = await checkProjectAccess(id, session.user.id, 'editor');
    if (!access.allowed)
      return NextResponse.json({ error: access.error }, { status: access.status });

    const validatedData = UpdateProjectSchema.parse({ ...body, id });

    const collection = client.db(env.DATABASE_NAME).collection('projects');

    if (validatedData.name && validatedData.name !== access.project.name) {
      const nameConflict = await collection.findOne({
        userId: access.project.userId,
        name: validatedData.name,
        _id: { $ne: new ObjectId(id) },
      });
      if (nameConflict)
        return NextResponse.json(
          { error: 'Project with this name already exists' },
          { status: 409 },
        );
    }

    const { id: _id, ...fieldsToUpdate } = validatedData;
    const updateData: Record<string, unknown> = {
      ...fieldsToUpdate,
      updatedAt: new Date(),
    };

    if (fieldsToUpdate.environments) {
      updateData.environments = safeEncryptEnvironments(fieldsToUpdate.environments);
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: updateData,
        $unset: { variables: '' },
      },
      { returnDocument: 'after' },
    );

    if (!result)
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const envs = migrateProjectToEnvironments(result as unknown as IProject);
    const { environments: decryptedEnvs, failedKeys } = safeDecryptEnvironments(envs);

    return NextResponse.json({
      project: { ...result, environments: decryptedEnvs, variables: undefined, memberRole: access.role },
      message: 'Project updated successfully',
      ...(failedKeys.length > 0 && {
        warning: `Failed to decrypt variables: ${failedKeys.join(', ')}.`,
      }),
    });
  } catch (error) {
    console.error('Error updating project:', error);
    if (error instanceof Error && error.name === 'ZodError')
      return NextResponse.json({ error: 'Invalid data', details: error }, { status: 400 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const access = await checkProjectAccess(id, session.user.id, 'owner');
    if (!access.allowed)
      return NextResponse.json({ error: access.error }, { status: access.status });

    const db = client.db(env.DATABASE_NAME);

    await Promise.all([
      db.collection('projects').deleteOne({ _id: new ObjectId(id) }),
      db.collection('members').deleteMany({ projectId: id }),
      db.collection('notifications').deleteMany({ 'metadata.projectId': id }),
    ]);

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
