'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DEFAULT_ENVIRONMENTS } from '@/config/app-data';
import { useCreateProject, useUpdateProject } from '@/hooks/use-projects';
import { ProjectInput, ProjectSchema } from '@/schema';
import { IProject } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface ProjectFormProps {
  project?: IProject;
  onSuccess: () => void;
  onCancel: () => void;
}

// Hoisted: default environments shape is stable, build it once at module scope
const DEFAULT_ENV_SHAPE = DEFAULT_ENVIRONMENTS.map((name) => ({ name, variables: [] }));

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const isEditing = !!project;
  const { mutateAsync: createProject, isPending: isCreating } = useCreateProject();
  const { mutateAsync: updateProject, isPending: isUpdating } = useUpdateProject();
  const isPending = isCreating || isUpdating;

  const form = useForm<ProjectInput>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: project?.name ?? '',
      description: project?.description ?? '',
      environments: project?.environments ?? DEFAULT_ENV_SHAPE,
    },
  });

  const onSubmit = async (data: ProjectInput) => {
    try {
      if (isEditing) {
        await updateProject({
          id: project._id as string,
          data: { name: data.name, description: data.description },
        });
      } else {
        await createProject(data);
      }
      onSuccess();
      form.reset();
    } catch {
      // Error toast handled in hooks
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Project' : 'Create New Project'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="my-awesome-project"
              disabled={isPending}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Brief description of your project..."
              rows={3}
              disabled={isPending}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEditing ? 'Saving...' : 'Creating...'
                : isEditing ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
