import { ApiError, projectsApi } from '@/lib/api/projects';
import { ProjectInput } from '@/schema/project';
import { IProject } from '@/types/projects';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface UseProjectsState {
  projects: IProject[];
  loading: boolean;
  error: string | null;
}

interface UseProjectsActions {
  fetchProjects: () => Promise<void>;
  createProject: (data: ProjectInput) => Promise<IProject | null>;
  updateProject: (
    id: string,
    data: Partial<IProject>
  ) => Promise<IProject | null>;
  deleteProject: (id: string) => Promise<boolean>;
  refreshProjects: () => Promise<void>;
}

export function useProjects(): UseProjectsState & UseProjectsActions {
  const [state, setState] = useState<UseProjectsState>({
    projects: [],
    loading: false,
    error: null,
  });

  const fetchProjects = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { projects, warning } = await projectsApi.getProjects();
      setState((prev) => ({ ...prev, projects, loading: false }));
      if (warning) toast.error(warning, { duration: 8000 });
    } catch (error) {
      const errorMessage =
        error instanceof ApiError ? error.message : 'Failed to fetch projects';
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      toast.error(errorMessage);
    }
  }, []);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // 5.9 Use functional setState updates - ensures stable callbacks
  const createProject = useCallback(
    async (data: ProjectInput): Promise<IProject | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const { project, message } = await projectsApi.createProject(data);
        // 5.9 Functional update for correct state
        setState((prev) => ({
          ...prev,
          projects: [project, ...prev.projects],
          loading: false,
        }));
        toast.success(message);
        return project;
      } catch (error) {
        const errorMessage =
          error instanceof ApiError
            ? error.message
            : 'Failed to create project';
        setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
        toast.error(errorMessage);
        return null;
      }
    },
    [] // 5.9 No dependencies needed with functional updates
  );

  const updateProject = useCallback(
    async (id: string, data: Partial<IProject>): Promise<IProject | null> => {
      // Optimistic update
      setState((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p._id === id ? { ...p, ...data } : p
        ),
      }));

      try {
        const { project, warning } = await projectsApi.updateProject(id, data);

        // Update with server response
        setState((prev) => ({
          ...prev,
          projects: prev.projects.map((p) => (p._id === id ? project : p)),
        }));

        toast.success('Project updated successfully');
        if (warning) toast.error(warning, { duration: 8000 });
        return project;
      } catch (error) {
        // Revert optimistic update on error
        await fetchProjects();

        const errorMessage =
          error instanceof ApiError
            ? error.message
            : 'Failed to update project';
        toast.error(errorMessage);
        return null;
      }
    },
    [fetchProjects]
  );

  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { message } = await projectsApi.deleteProject(id);
      setState((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p._id !== id),
      }));
      toast.success(message);
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof ApiError ? error.message : 'Failed to delete project';
      toast.error(errorMessage);
      return false;
    }
  }, []);

  const refreshProjects = useCallback(() => fetchProjects(), [fetchProjects]);

  return {
    ...state,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects,
  };
}
