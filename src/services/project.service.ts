import api from '@/config/axios';
import { API_ENDPOINTS } from '@/config/api-endpoints';
import { IProjectResponse, IProjectListResponse } from '@/types';
import { ProjectInput, UpdateProjectInput } from '@/schema';

export const projectService = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get<never, IProjectListResponse>(API_ENDPOINTS.PROJECTS.LIST, { params }),

  getById: (id: string) =>
    api.get<never, IProjectResponse>(API_ENDPOINTS.PROJECTS.GET(id)),

  create: (data: ProjectInput) =>
    api.post<never, IProjectResponse>(API_ENDPOINTS.PROJECTS.CREATE, data),

  update: (id: string, data: Partial<UpdateProjectInput>) =>
    api.put<never, IProjectResponse>(API_ENDPOINTS.PROJECTS.UPDATE(id), data),

  delete: (id: string) =>
    api.delete<never, { message: string }>(API_ENDPOINTS.PROJECTS.DELETE(id)),
};
