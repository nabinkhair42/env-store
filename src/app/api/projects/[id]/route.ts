import { auth } from '@/auth';
import { env } from '@/env';
import {
  safeDecryptVariables,
  safeEncryptVariables,
} from '@/lib/crypto-helpers';
import { client } from '@/lib/db';
import { UpdateProjectSchema } from '@/lib/zod';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const collection = client.db(env.DATABASE_NAME).collection('projects');
    const project = await collection.findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Decrypt variables before sending to client
    const { variables, failedKeys } = safeDecryptVariables(project.variables);
    const decryptedProject = { ...project, variables };

    return NextResponse.json({
      project: decryptedProject,
      ...(failedKeys.length > 0 && {
        warning: `Failed to decrypt variables: ${failedKeys.join(', ')}. Check that ENCRYPTION_SECRET matches the key used to encrypt this data.`,
      }),
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1.4 Promise.all() for independent operations - parallelize body and params
    const [body, { id }] = await Promise.all([request.json(), params]);

    const validatedData = UpdateProjectSchema.parse({
      ...body,
      id,
    });

    const collection = client.db(env.DATABASE_NAME).collection('projects');

    // Check if project exists and belongs to user
    const existingProject = await collection.findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    // 1.1 Defer await until needed - early return if project doesn't exist
    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // 1.1 Defer await until needed - only check name conflict if name is being updated
    if (validatedData.name && validatedData.name !== existingProject.name) {
      const nameConflict = await collection.findOne({
        userId: session.user.id,
        name: validatedData.name,
        _id: { $ne: new ObjectId(id) },
      });

      if (nameConflict) {
        return NextResponse.json(
          { error: 'Project with this name already exists' },
          { status: 409 }
        );
      }
    }

    // Encrypt variables if they are being updated
    // Destructure to exclude `id` — it's from the URL param, not a document field
    const { id: _id, ...fieldsToUpdate } = validatedData;
    const updateData: Record<string, unknown> = {
      ...fieldsToUpdate,
      updatedAt: new Date(),
    };

    if (fieldsToUpdate.variables) {
      updateData.variables = safeEncryptVariables(fieldsToUpdate.variables);
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id), userId: session.user.id },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Decrypt variables before sending to client
    const { variables: decryptedVars, failedKeys: updateFailedKeys } =
      safeDecryptVariables(result.variables);
    const decryptedResult = { ...result, variables: decryptedVars };

    return NextResponse.json({
      project: decryptedResult,
      message: 'Project updated successfully',
      ...(updateFailedKeys.length > 0 && {
        warning: `Failed to decrypt variables: ${updateFailedKeys.join(', ')}. Check that ENCRYPTION_SECRET matches the key used to encrypt this data.`,
      }),
    });
  } catch (error) {
    console.error('Error updating project:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const collection = client.db(env.DATABASE_NAME).collection('projects');
    const result = await collection.deleteOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
