import { ROLE_HIERARCHY } from '@/config/app-data';
import { client } from '@/lib/db';
import { env } from '@/schema/env';
import { IProject, MemberRole } from '@/types';
import { ObjectId } from 'mongodb';

export type ProjectAccessGranted = {
  allowed: true;
  role: MemberRole;
  project: IProject;
};

export type ProjectAccessDenied = {
  allowed: false;
  status: 401 | 403 | 404;
  error: string;
};

export type ProjectAccess = ProjectAccessGranted | ProjectAccessDenied;

export async function checkProjectAccess(
  projectId: string,
  userId: string,
  requiredRole?: MemberRole,
): Promise<ProjectAccess> {
  const db = client.db(env.DATABASE_NAME);

  const project = await db
    .collection<IProject>('projects')
    .findOne({ _id: new ObjectId(projectId) });

  if (!project) {
    return { allowed: false, status: 404, error: 'Project not found' };
  }

  // Check if user is the owner
  if (project.userId === userId) {
    return { allowed: true, role: 'owner', project };
  }

  // Check membership
  const member = await db.collection('members').findOne({
    projectId,
    userId,
    status: 'accepted',
  });

  if (!member) {
    return { allowed: false, status: 404, error: 'Project not found' };
  }

  const userRole = member.role as MemberRole;

  // Check role hierarchy if a required role is specified
  if (requiredRole && ROLE_HIERARCHY[userRole] < ROLE_HIERARCHY[requiredRole]) {
    return {
      allowed: false,
      status: 403,
      error: 'Insufficient permissions',
    };
  }

  return { allowed: true, role: userRole, project };
}
