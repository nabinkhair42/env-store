import { z } from 'zod';

export const EnvVariableSchema = z.object({
  key: z.string(),
  value: z.string(),
  description: z.string().optional(),
});

export type EnvVariable = z.infer<typeof EnvVariableSchema>;
