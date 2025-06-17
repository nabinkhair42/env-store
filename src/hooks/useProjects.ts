import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { IProject } from '@/lib/models/Project';
import { ProjectInput } from '@/lib/validations/project';
import { projectsApi, ApiError } from '@/lib/api/projects';

interface UseProjectsState {
  projects: IProject[];
  loading: boolean;
  error: string | null;
}

interface UseProjectsActions {
  fetchProjects: () => Promise<void>;
  createProject: (data: ProjectInput) => Promise<IProject | null>;
  updateProject: (id: string, data: Partial<IProject>) => Promise<IProject | null>;
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
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { projects } = await projectsApi.getProjects();
      setState(prev => ({ ...prev, projects, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch projects';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      toast.error(errorMessage);
    }
  }, []);

  const createProject = useCallback(async (data: ProjectInput): Promise<IProject | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { project, message } = await projectsApi.createProject(data);
      setState(prev => ({
        ...prev,
        projects: [project, ...prev.projects],
        loading: false,
      }));
      toast.success(message);
      return project;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Failed to create project';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      toast.error(errorMessage);
      return null;
    }
  }, []);

  const updateProject = useCallback(async (id: string, data: Partial<IProject>): Promise<IProject | null> => {
    try {
      const { project, message } = await projectsApi.updateProject(id, data);
      setState(prev => ({
        ...prev,
        projects: prev.projects.map(p => p._id === id ? project : p),
      }));
      toast.success(message);
      return project;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Failed to update project';
      toast.error(errorMessage);
      return null;
    }
  }, []);

  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { message } = await projectsApi.deleteProject(id);
      setState(prev => ({
        ...prev,
        projects: prev.projects.filter(p => p._id !== id),
      }));
      toast.success(message);
      return true;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Failed to delete project';
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
