import { MAX_DESCRIPTION_LENGTH, MAX_PROJECT_NAME_LENGTH } from '@/config/app-data';
import { EnvVariableSchema } from '@/schema';
import z from 'zod';

export const ProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(MAX_PROJECT_NAME_LENGTH, `Project name must be less than ${MAX_PROJECT_NAME_LENGTH} characters`),
  description: z
    .string()
    .max(MAX_DESCRIPTION_LENGTH, `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`)
    .optional(),
  variables: z.array(EnvVariableSchema),
});

export const UpdateProjectSchema = ProjectSchema.partial().extend({
  id: z.string().min(1, 'Project ID is required'),
});

export type ProjectInput = z.infer<typeof ProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
