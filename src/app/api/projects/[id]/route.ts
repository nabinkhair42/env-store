import { auth } from '@/auth';
import client from '@/lib/db';
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
    const collection = client.db('env-sync').collection('projects');
    const project = await collection.findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project });
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

    const body = await request.json();
    const { id } = await params;
    const validatedData = UpdateProjectSchema.parse({
      ...body,
      id,
    });

    const collection = client.db('env-sync').collection('projects');

    // Check if project exists and belongs to user
    const existingProject = await collection.findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check for name conflicts if name is being updated
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

    const updateData = {
      ...validatedData,
      updatedAt: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id), userId: session.user.id },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({
      project: result,
      message: 'Project updated successfully',
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
    const collection = client.db('env-sync').collection('projects');
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
