import { client } from '@/lib/db';
import { env } from '@/schema/env';
import type { Db } from 'mongodb';

/**
 * Ensures all required MongoDB indexes exist. Idempotent — calling
 * createIndex with the same spec is a no-op.
 *
 * Memoized at module level so it runs only once per process. On serverless,
 * this means once per cold start.
 */
let ensurePromise: Promise<void> | null = null;

export function ensureIndexes(): Promise<void> {
  if (!ensurePromise) {
    ensurePromise = doEnsure().catch((err) => {
      // Reset so a future call retries
      ensurePromise = null;
      console.error('Failed to ensure MongoDB indexes:', err);
      throw err;
    });
  }
  return ensurePromise;
}

async function doEnsure(): Promise<void> {
  const db: Db = client.db(env.DATABASE_NAME);

  await Promise.all([
    // projects: list by owner, sorted by recency
    db.collection('projects').createIndex(
      { userId: 1, updatedAt: -1 },
      { name: 'projects_userId_updatedAt' },
    ),

    // members: list by project, scoped to active members
    db.collection('members').createIndex(
      { projectId: 1, status: 1 },
      { name: 'members_projectId_status' },
    ),
    // members: list "shared with me" projects
    db.collection('members').createIndex(
      { userId: 1, status: 1 },
      { name: 'members_userId_status' },
    ),
    // members: invite linking on signup (sparse — most rows have null email)
    db.collection('members').createIndex(
      { invitedEmail: 1 },
      { name: 'members_invitedEmail', sparse: true },
    ),
    db.collection('members').createIndex(
      { invitedGithubUsername: 1 },
      { name: 'members_invitedGithubUsername', sparse: true },
    ),
    // members: prevent duplicate invites for the same project+user
    db.collection('members').createIndex(
      { projectId: 1, userId: 1 },
      {
        name: 'members_projectId_userId_unique',
        unique: true,
        partialFilterExpression: { userId: { $type: 'string' } },
      },
    ),

    // notifications: list by user, sorted by recency
    db.collection('notifications').createIndex(
      { userId: 1, createdAt: -1 },
      { name: 'notifications_userId_createdAt' },
    ),
    // notifications: unread count
    db.collection('notifications').createIndex(
      { userId: 1, read: 1 },
      { name: 'notifications_userId_read' },
    ),
    // notifications: cleanup on project delete
    db.collection('notifications').createIndex(
      { 'metadata.projectId': 1 },
      { name: 'notifications_metadata_projectId', sparse: true },
    ),
  ]);
}
