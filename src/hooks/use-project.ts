import { projectsApi } from '@/lib/api/projects';
import { ProjectInput } from '@/schema/project';
import { IProject } from '@/types/projects';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export function useProjects() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { projects, warning } = await projectsApi.getProjects();
      setProjects(projects);
      if (warning) toast.error(warning, { duration: 8000 });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = useCallback(async (data: ProjectInput) => {
    setLoading(true);
    try {
      const { project, message } = await projectsApi.createProject(data);
      setProjects((prev) => [project, ...prev]);
      toast.success(message);
      return project;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create project');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProject = useCallback(
    async (id: string, data: Partial<IProject>) => {
      try {
        const { project, warning } = await projectsApi.updateProject(id, data);
        setProjects((prev) => prev.map((p) => (p._id === id ? project : p)));
        toast.success('Project updated');
        if (warning) toast.error(warning, { duration: 8000 });
        return project;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to update project');
        return null;
      }
    },
    []
  );

  const deleteProject = useCallback(async (id: string) => {
    try {
      const { message } = await projectsApi.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success(message);
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete project');
      return false;
    }
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
