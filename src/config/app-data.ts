// --- Project constraints ---
export const MAX_PROJECT_NAME_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 200;

// --- Encryption ---
export const MIN_ENCRYPTION_SECRET_LENGTH = 32;
export const PBKDF2_ITERATIONS = 100_000;
export const SALT_LENGTH = 64;

// --- HTTP ---
export const API_TIMEOUT_MS = 15_000;

// --- Query cache ---
export const STALE_TIME_MS = 5 * 60 * 1000; // 5 minutes
export const GC_TIME_MS = 30 * 60 * 1000; // 30 minutes
export const QUERY_RETRY_COUNT = 2;

// --- Pagination ---
export const PROJECTS_PER_PAGE = 10;

// --- Environments ---
export const DEFAULT_ENVIRONMENTS = ['development', 'staging', 'production'] as const;
export const MAX_ENVIRONMENT_NAME_LENGTH = 30;
export const MAX_ENVIRONMENTS = 10;

// --- Members ---
export const MEMBER_ROLES = ['editor', 'viewer'] as const;
export const INVITE_STATUSES = ['pending', 'accepted', 'declined'] as const;
export const ROLE_HIERARCHY: Record<string, number> = {
  owner: 3,
  editor: 2,
  viewer: 1,
};

// --- Database ---
export const DEFAULT_DATABASE_NAME = 'env-store';
