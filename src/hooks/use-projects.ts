import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { projectService } from '@/services/project.service';
import { ProjectInput, UpdateProjectInput } from '@/schema';
import { PROJECTS_PER_PAGE } from '@/config/app-data';
import { toast } from 'react-hot-toast';

export const projectKeys = {
  all: ['projects'] as const,
  list: (page = 1, limit = PROJECTS_PER_PAGE) =>
    [...projectKeys.all, 'list', { page, limit }] as const,
  detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
};

// --- Queries ---

export function useProjects(page = 1, limit = PROJECTS_PER_PAGE) {
  return useQuery({
    queryKey: projectKeys.list(page, limit),
    queryFn: async () => {
      const res = await projectService.getAll({ page, limit });
      if (res.warning) toast.error(res.warning, { duration: 8000 });
      return {
        projects: res.projects,
        sharedProjects: res.sharedProjects,
        pagination: res.pagination,
      };
    },
    placeholderData: keepPreviousData,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: async () => {
      const res = await projectService.getById(id);
      if (res.warning) toast.error(res.warning, { duration: 8000 });
      return res.project;
    },
    enabled: !!id,
  });
}

// --- Mutations ---

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProjectInput) => projectService.create(data),
    onSuccess: ({ message }) => {
      qc.invalidateQueries({ queryKey: projectKeys.list() });
      toast.success(message ?? 'Project created');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdateProjectInput> }) =>
      projectService.update(id, data),
    onSuccess: ({ project, warning }) => {
      qc.setQueryData(projectKeys.detail(String(project._id)), project);
      qc.invalidateQueries({ queryKey: projectKeys.list() });
      toast.success('Project updated');
      if (warning) toast.error(warning, { duration: 8000 });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectService.delete(id),
    onSuccess: ({ message }) => {
      qc.invalidateQueries({ queryKey: projectKeys.all });
      toast.success(message ?? 'Project deleted');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
