import { ROLE_HIERARCHY } from '@/config/app-data';
import { client } from '@/lib/db';
import { env } from '@/schema/env';
import { IProject, MemberRole } from '@/types';
import { ObjectId } from 'mongodb';
import { cache } from 'react';

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

/**
 * Cached per-request to dedupe repeated access checks for the same project
 * within a single request (e.g. multiple route handler steps).
 */
export const checkProjectAccess = cache(async (
  projectId: string,
  userId: string,
  requiredRole?: MemberRole,
): Promise<ProjectAccess> => {
  const db = client.db(env.DATABASE_NAME);

  // Run owner check + member lookup in parallel — only one will be relevant
  // but doing both saves a roundtrip for non-owner cases.
  const [project, member] = await Promise.all([
    db.collection<IProject>('projects').findOne({ _id: new ObjectId(projectId) }),
    db.collection('members').findOne({ projectId, userId, status: 'accepted' }),
  ]);

  if (!project) {
    return { allowed: false, status: 404, error: 'Project not found' };
  }

  // Owner check
  if (project.userId === userId) {
    return { allowed: true, role: 'owner', project };
  }

  if (!member) {
    return { allowed: false, status: 404, error: 'Project not found' };
  }

  const userRole = member.role as MemberRole;

  if (requiredRole && ROLE_HIERARCHY[userRole] < ROLE_HIERARCHY[requiredRole]) {
    return { allowed: false, status: 403, error: 'Insufficient permissions' };
  }

  return { allowed: true, role: userRole, project };
});
