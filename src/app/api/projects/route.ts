import { auth } from '@/auth';
import client from '@/lib/db';
import { IProject } from '@/lib/types';
import { ProjectSchema } from '@/lib/zod';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const collection = client.db('env-sync').collection<IProject>('projects');
    const projects = await collection
      .find({ userId: session.user.id })
      .project({
        name: 1,
        description: 1,
        variables: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = ProjectSchema.parse(body);

    const collection = client.db('env-sync').collection<IProject>('projects');

    // Check if project with same name already exists for this user
    const existingProject = await collection.findOne({
      userId: session.user.id,
      name: validatedData.name,
    });

    if (existingProject) {
      return NextResponse.json(
        { error: 'Project with this name already exists' },
        { status: 409 }
      );
    }

    const now = new Date();
    const project = {
      ...validatedData,
      userId: session.user.id,
      createdAt: now,
      updatedAt: now,
      variables: validatedData.variables || [],
    };

    const result = await collection.insertOne(project);
    const createdProject = { ...project, _id: result.insertedId };

    return NextResponse.json(
      { project: createdProject, message: 'Project created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project:', error);

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
