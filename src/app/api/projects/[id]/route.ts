import { auth } from '@/auth';
import { checkProjectAccess } from '@/lib/access-control';
import {
  safeDecryptVariables,
  safeEncryptVariables,
} from '@/lib/crypto-helpers';
import { client } from '@/lib/db';
import { env } from '@/schema/env';
import { UpdateProjectSchema } from '@/schema';
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

    const { variables, failedKeys } = safeDecryptVariables(access.project.variables);
    const decryptedProject = { ...access.project, variables, memberRole: access.role };

    return NextResponse.json({
      project: decryptedProject,
      ...(failedKeys.length > 0 && {
        warning: `Failed to decrypt variables: ${failedKeys.join(', ')}. Check that ENCRYPTION_SECRET matches the key used to encrypt this data.`,
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

    // Editors and owners can update
    const access = await checkProjectAccess(id, session.user.id, 'editor');
    if (!access.allowed)
      return NextResponse.json({ error: access.error }, { status: access.status });

    const validatedData = UpdateProjectSchema.parse({ ...body, id });

    const collection = client.db(env.DATABASE_NAME).collection('projects');

    // Name conflict check (only if name is changing)
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

    if (fieldsToUpdate.variables) {
      updateData.variables = safeEncryptVariables(fieldsToUpdate.variables);
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' },
    );

    if (!result)
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const { variables: decryptedVars, failedKeys } = safeDecryptVariables(result.variables);

    return NextResponse.json({
      project: { ...result, variables: decryptedVars, memberRole: access.role },
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

    // Only owner can delete
    const access = await checkProjectAccess(id, session.user.id, 'owner');
    if (!access.allowed)
      return NextResponse.json({ error: access.error }, { status: access.status });

    const db = client.db(env.DATABASE_NAME);

    // Delete project and clean up members + notifications
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
