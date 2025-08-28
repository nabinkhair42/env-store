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

const parsed = EnvSchema.safeParse({
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
  AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV,
});

if (!parsed.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsed.error.flatten().fieldErrors
  );
  throw new Error('Invalid environment configuration');
}

export const env = parsed.data;
