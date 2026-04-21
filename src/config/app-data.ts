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

// --- Database ---
export const DEFAULT_DATABASE_NAME = 'env-store';
