import {
  MAX_DESCRIPTION_LENGTH,
  MAX_ENVIRONMENT_NAME_LENGTH,
  MAX_ENVIRONMENTS,
  MAX_PROJECT_NAME_LENGTH,
} from '@/config/app-data';
import { EnvVariableSchema } from '@/schema';
import z from 'zod';

export const EnvironmentSchema = z.object({
  name: z.string().min(1).max(MAX_ENVIRONMENT_NAME_LENGTH),
  variables: z.array(EnvVariableSchema),
});

export const ProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(MAX_PROJECT_NAME_LENGTH, `Project name must be less than ${MAX_PROJECT_NAME_LENGTH} characters`),
  description: z
    .string()
    .max(MAX_DESCRIPTION_LENGTH, `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`)
    .optional(),
  environments: z.array(EnvironmentSchema).min(1).max(MAX_ENVIRONMENTS),
});

export const UpdateProjectSchema = ProjectSchema.partial().extend({
  id: z.string().min(1, 'Project ID is required'),
});

export type ProjectInput = z.infer<typeof ProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
export type EnvironmentInput = z.infer<typeof EnvironmentSchema>;
