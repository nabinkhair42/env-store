import { auth } from '@/auth';
import {
  safeDecryptEnvironments,
  safeEncryptEnvironments,
} from '@/lib/crypto-helpers';
import { client } from '@/lib/db';
import { migrateProjectToEnvironments } from '@/lib/migration';
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
      { $addFields: { user: { $arrayElemAt: ['$userInfo', 0] } } },
      { $project: { projectId: 1, user: 1 } },
    ])
    .toArray();

  const result = new Map<string, IProjectMember[]>();
  for (const doc of memberDocs) {
    const pid = doc.projectId as string;
    if (!result.has(pid)) result.set(pid, []);
    if (doc.user) result.get(pid)!.push({ name: doc.user.name, image: doc.user.image });
  }
  return result;
}

function decryptProject(raw: Record<string, unknown>): { project: IProject; failedKeys: string[] } {
  const environments = migrateProjectToEnvironments(raw as unknown as IProject);
  const { environments: decrypted, failedKeys } = safeDecryptEnvironments(environments);
  return {
    project: { ...raw, environments: decrypted, variables: undefined } as unknown as IProject,
    failedKeys,
  };
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = client.db(env.DATABASE_NAME);
    const collection = db.collection<IProject>('projects');

    const projects = await collection
      .find({ userId: session.user.id })
      .project({ name: 1, description: 1, environments: 1, variables: 1, createdAt: 1, updatedAt: 1 })
      .sort({ updatedAt: -1 })
      .toArray();

    const allFailedKeys: string[] = [];
    const ownedProjectIds: string[] = [];

    const decryptedProjects: IProject[] = projects.map((raw) => {
      const id = raw._id.toString();
      ownedProjectIds.push(id);
      const { project, failedKeys } = decryptProject(raw);
      allFailedKeys.push(...failedKeys);
      return { ...project, memberRole: 'owner' as const };
    });

    // Fetch shared projects
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
        .project({ name: 1, description: 1, environments: 1, variables: 1, createdAt: 1, updatedAt: 1 })
        .sort({ updatedAt: -1 })
        .toArray();

      sharedProjects = rawShared.map((raw) => {
        const id = raw._id.toString();
        sharedProjectIds.push(id);
        const { project, failedKeys } = decryptProject(raw);
        allFailedKeys.push(...failedKeys);
        return { ...project, memberRole: roleMap.get(id) as IProject['memberRole'] };
      });
    }

    // Populate members
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
        warning: `Failed to decrypt variables: ${allFailedKeys.join(', ')}.`,
      }),
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const validatedData = ProjectSchema.parse(body);

    const collection = client.db(env.DATABASE_NAME).collection<IProject>('projects');

    const existingProject = await collection.findOne({
      userId: session.user.id,
      name: validatedData.name,
    });

    if (existingProject)
      return NextResponse.json({ error: 'Project with this name already exists' }, { status: 409 });

    const now = new Date();
    const encryptedEnvironments = safeEncryptEnvironments(validatedData.environments);

    const project = {
      ...validatedData,
      userId: session.user.id,
      createdAt: now,
      updatedAt: now,
      environments: encryptedEnvironments,
    };

    const result = await collection.insertOne(project);

    const createdProject = {
      ...project,
      _id: result.insertedId,
      environments: validatedData.environments,
    };

    return NextResponse.json(
      { project: createdProject, message: 'Project created successfully' },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating project:', error);
    if (error instanceof Error && error.name === 'ZodError')
      return NextResponse.json({ error: 'Invalid data', details: error }, { status: 400 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
