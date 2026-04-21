import { ProjectInput, UpdateProjectInput } from '@/schema/project';
import { IProject } from '@/types/projects';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(body.error || 'Request failed');
  }
  return response.json();
}

export const projectsApi = {
  async getProjects(): Promise<{ projects: IProject[]; warning?: string }> {
    return handleResponse(await fetch('/api/projects', { cache: 'no-store' }));
  },

  async getProject(id: string): Promise<{ project: IProject; warning?: string }> {
    return handleResponse(await fetch(`/api/projects/${id}`, { cache: 'no-store' }));
  },

  async createProject(data: ProjectInput): Promise<{ project: IProject; message: string }> {
    return handleResponse(
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    );
  },

  async updateProject(
    id: string,
    data: Partial<UpdateProjectInput>
  ): Promise<{ project: IProject; message: string; warning?: string }> {
    return handleResponse(
      await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    );
  },

  async deleteProject(id: string): Promise<{ message: string }> {
    return handleResponse(
      await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    );
  },
};
