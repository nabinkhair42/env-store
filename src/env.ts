import { z } from 'zod';

const EnvSchema = z.object({
  AUTH_SECRET: z.string().min(1),
  AUTH_GITHUB_ID: z.string().min(1),
  AUTH_GITHUB_SECRET: z.string().min(1),
  MONGODB_URI: z.string().url().or(z.string().startsWith('mongodb')),
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
    }
  : {
      AUTH_SECRET: process.env.AUTH_SECRET ?? 'dev-secret',
      AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID ?? 'dev-github-id',
      AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET ?? 'dev-github-secret',
      MONGODB_URI:
        process.env.MONGODB_URI ?? 'mongodb://localhost:27017/env-store',
      NODE_ENV: process.env.NODE_ENV ?? 'development',
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
