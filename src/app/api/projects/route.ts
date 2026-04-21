import { auth } from '@/auth';
import {
    safeDecryptVariables,
    safeEncryptVariables,
} from '@/lib/crypto-helpers';
import { client } from '@/lib/db';
import { env } from '@/schema/env';
import { ProjectSchema } from '@/schema';
import { IProject, IProjectMember } from '@/types';
import { Db, ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

async function populateMembers(db: Db, projectIds: string[]): Promise<Map<string, IProjectMember[]>> {
  if (projectIds.length === 0) return new Map();

  const memberDocs = await db
    .collection('members')
    .aggregate([
      { $match: { projectId: { $in: projectIds }, status: 'accepted' } },
      {
        $lookup: {
          from: 'users',
          let: { uid: { $cond: { if: { $ne: ['$userId', null] }, then: { $toObjectId: '$userId' }, else: null } } },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$uid'] } } },
            { $project: { name: 1, image: 1 } },
          ],
          as: 'userInfo',
        },
      },
      {
        $addFields: {
          user: { $arrayElemAt: ['$userInfo', 0] },
        },
      },
      { $project: { projectId: 1, user: 1 } },
    ])
    .toArray();

  const result = new Map<string, IProjectMember[]>();
  for (const doc of memberDocs) {
    const pid = doc.projectId as string;
    if (!result.has(pid)) result.set(pid, []);
    if (doc.user) {
      result.get(pid)!.push({ name: doc.user.name, image: doc.user.image });
    }
  }
  return result;
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const collection = client
      .db(env.DATABASE_NAME)
      .collection<IProject>('projects');
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

    const db = client.db(env.DATABASE_NAME);
    const allFailedKeys: string[] = [];

    // Decrypt owned projects
    const ownedProjectIds = projects.map((p) => p._id.toString());
    const decryptedProjects: IProject[] = projects.map((project) => {
      const { variables, failedKeys } = safeDecryptVariables(project.variables);
      allFailedKeys.push(...failedKeys);
      return { ...project, memberRole: 'owner' as const, variables } as IProject;
    });

    // Fetch shared projects (where user is an accepted member)
    const memberships = await db
      .collection('members')
      .find({ userId: session.user.id, status: 'accepted' })
      .toArray();

    let sharedProjects: IProject[] = [];
    const sharedProjectIds: string[] = [];
    if (memberships.length > 0) {
      const sharedObjIds = memberships.map((m) => new ObjectId(m.projectId));
      const roleMap = new Map(memberships.map((m) => [m.projectId, m.role]));

      const rawShared = await collection
        .find({ _id: { $in: sharedObjIds } })
        .project({ name: 1, description: 1, variables: 1, createdAt: 1, updatedAt: 1 })
        .sort({ updatedAt: -1 })
        .toArray();

      sharedProjects = rawShared.map((p) => {
        sharedProjectIds.push(p._id.toString());
        const { variables, failedKeys } = safeDecryptVariables(p.variables as IProject['variables']);
        allFailedKeys.push(...failedKeys);
        return { ...p, variables, memberRole: roleMap.get(p._id.toString()) as IProject['memberRole'] } as IProject;
      });
    }

    // Populate members for all projects
    const allProjectIds = [...ownedProjectIds, ...sharedProjectIds];
    const membersMap = await populateMembers(db, allProjectIds);

    for (let i = 0; i < decryptedProjects.length; i++) {
      decryptedProjects[i].members = membersMap.get(ownedProjectIds[i]) ?? [];
    }
    for (const p of sharedProjects) {
      p.members = membersMap.get((p._id as ObjectId).toString()) ?? [];
    }

    return NextResponse.json({
      projects: decryptedProjects,
      sharedProjects,
      ...(allFailedKeys.length > 0 && {
        warning: `Failed to decrypt variables: ${allFailedKeys.join(', ')}. Check that ENCRYPTION_SECRET matches the key used to encrypt this data.`,
      }),
    });
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

    const collection = client
      .db(env.DATABASE_NAME)
      .collection<IProject>('projects');

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

    // Encrypt variables before storing
    const encryptedVariables = safeEncryptVariables(
      validatedData.variables || []
    );

    const project = {
      ...validatedData,
      userId: session.user.id,
      createdAt: now,
      updatedAt: now,
      variables: encryptedVariables,
    };

    const result = await collection.insertOne(project);

    // Return plaintext variables in response (no need to decrypt what we just encrypted)
    const createdProject = {
      ...project,
      _id: result.insertedId,
      variables: validatedData.variables || [],
    };

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
