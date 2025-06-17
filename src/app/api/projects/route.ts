import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Project } from '@/lib/models/Project';
import { ProjectSchema } from '@/lib/validations/project';
import { connectToDatabase } from '@/lib/mongoose';

export async function GET() {
  try {
    const session = await auth();
    
    
    if (!session?.user?.id) {
      
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const projects = await Project.find({ userId: session.user.id })
      .select('name description variables createdAt updatedAt')
      .sort({ updatedAt: -1 });

     // Debug log


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

    await connectToDatabase();

    // Check if project with same name already exists for this user
    const existingProject = await Project.findOne({
      userId: session.user.id,
      name: validatedData.name
    });

    if (existingProject) {
      return NextResponse.json(
        { error: 'Project with this name already exists' },
        { status: 409 }
      );
    }

    const project = new Project({
      ...validatedData,
      userId: session.user.id
    });

    await project.save();

    return NextResponse.json(
      { project, message: 'Project created successfully' },
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
