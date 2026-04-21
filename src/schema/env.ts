import { DEFAULT_DATABASE_NAME, MIN_ENCRYPTION_SECRET_LENGTH } from '@/config/app-data';
import { z } from 'zod';

const EnvSchema = z.object({
  AUTH_SECRET: z.string().min(1),
  AUTH_GITHUB_ID: z.string().min(1),
  AUTH_GITHUB_SECRET: z.string().min(1),
  MONGODB_URI: z.string().url().or(z.string().startsWith('mongodb')),
  DATABASE_NAME: z.string().min(1).default(DEFAULT_DATABASE_NAME),
  ENCRYPTION_SECRET: z
    .string()
    .min(MIN_ENCRYPTION_SECRET_LENGTH, `Encryption secret must be at least ${MIN_ENCRYPTION_SECRET_LENGTH} characters`),
  RESEND_API_KEY: z.string().min(1).optional(),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
});

// Strict validation only for real production deploys; allow CI to build without secrets
const IS_CI = process.env.CI === 'true';
const STRICT_VALIDATION =
  process.env.NODE_ENV === 'production' &&
  process.env.SKIP_ENV_VALIDATION !== 'true' &&
  !IS_CI;

const raw = STRICT_VALIDATION
  ? {
      AUTH_SECRET: process.env.AUTH_SECRET,
      AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
      AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
      MONGODB_URI: process.env.MONGODB_URI,
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_NAME: process.env.DATABASE_NAME,
      ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
    }
  : {
      AUTH_SECRET: process.env.AUTH_SECRET ?? 'dev-secret',
      AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID ?? 'dev-github-id',
      AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET ?? 'dev-github-secret',
      MONGODB_URI:
        process.env.MONGODB_URI ?? 'mongodb://localhost:27017/env-store',
      NODE_ENV: process.env.NODE_ENV ?? 'development',
      ENCRYPTION_SECRET:
        process.env.ENCRYPTION_SECRET ??
        'dev-encryption-secret-min-32-chars-long',
      RESEND_API_KEY: process.env.RESEND_API_KEY,
    };

const parsed = EnvSchema.safeParse(raw);

if (!parsed.success) {
  if (STRICT_VALIDATION) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors
    );
    throw new Error('Invalid environment configuration');
  }
}

export const env = parsed.success
  ? parsed.data
  : (raw as z.infer<typeof EnvSchema>);
