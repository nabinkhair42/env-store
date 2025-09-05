import { z } from 'zod';

// Schema for encrypted data structure
const EncryptedDataSchema = z.object({
  ciphertext: z.string().min(1),
  iv: z.string().min(1),
  authTag: z.string().min(1),
});

// Schema for environment variable value (can be string or encrypted)
const EnvVariableValueSchema = z.union([z.string(), EncryptedDataSchema]);

const EnvVariableSchema = z.object({
  key: z
    .string()
    .min(1, 'Key is required')
    .regex(
      /^[A-Z_][A-Z0-9_]*$/,
      'Key must be uppercase letters, numbers, and underscores only'
    ),
  value: EnvVariableValueSchema,
  description: z.string().optional(),
});

export const ProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(50, 'Project name must be less than 50 characters'),
  description: z
    .string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
  variables: z.array(EnvVariableSchema),
  userSalt: z.string().optional(),
});

export const UpdateProjectSchema = ProjectSchema.partial().extend({
  id: z.string().min(1, 'Project ID is required'),
});

// Legacy schema for backward compatibility
export const LegacyEnvVariableSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  description: z.string().optional(),
});

export const LegacyProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  variables: z.array(LegacyEnvVariableSchema),
});

export type EnvVariable = z.infer<typeof EnvVariableSchema>;
export type ProjectInput = z.infer<typeof ProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
export type LegacyEnvVariable = z.infer<typeof LegacyEnvVariableSchema>;
export type LegacyProject = z.infer<typeof LegacyProjectSchema>;
export type EncryptedDataType = z.infer<typeof EncryptedDataSchema>;
