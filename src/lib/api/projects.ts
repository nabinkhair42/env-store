import { IProject } from '@/lib/types';
import { ProjectInput, UpdateProjectInput } from '@/lib/zod';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(response.status, error.error || 'Request failed');
  }
  return response.json();
}

export const projectsApi = {
  // Get all projects for the current user
  async getProjects(): Promise<{ projects: IProject[]; warning?: string }> {
    const response = await fetch('/api/projects', {
      cache: 'no-store', // Disable cache for fresh data
    });
    return handleResponse(response);
  },

  // Get a single project by ID
  async getProject(id: string): Promise<{ project: IProject; warning?: string }> {
    const response = await fetch(`/api/projects/${id}`, {
      cache: 'no-store', // Disable cache for fresh data
    });
    return handleResponse(response);
  },

  // Create a new project
  async createProject(
    data: ProjectInput
  ): Promise<{ project: IProject; message: string }> {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    });
    return handleResponse(response);
  },

  // Update an existing project
  async updateProject(
    id: string,
    data: Partial<UpdateProjectInput>
  ): Promise<{ project: IProject; message: string; warning?: string }> {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    });
    return handleResponse(response);
  },

  // Delete a project
  async deleteProject(id: string): Promise<{ message: string }> {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      cache: 'no-store',
    });
    return handleResponse(response);
  },
};
