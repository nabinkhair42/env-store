import api from '@/config/axios';
import { API_ENDPOINTS } from '@/config/api-endpoints';
import { IUserSearchResponse } from '@/types';

export const userService = {
  search: (q: string) =>
    api.get<never, IUserSearchResponse>(API_ENDPOINTS.USERS.SEARCH, {
      params: { q },
    }),
};
