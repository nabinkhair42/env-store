import { z } from 'zod';

export const EnvVariableSchema = z.object({
  key: z
    .string()
    .min(1, 'Key is required')
    .regex(
      /^[A-Z_][A-Z0-9_]*$/,
      'Key must be uppercase letters, numbers, and underscores only'
    ),
  value: z.string(),
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
});

export const UpdateProjectSchema = ProjectSchema.partial().extend({
  id: z.string().min(1, 'Project ID is required'),
});

export type EnvVariable = z.infer<typeof EnvVariableSchema>;
export type ProjectInput = z.infer<typeof ProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
