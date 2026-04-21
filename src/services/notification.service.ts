import api from '@/config/axios';
import { API_ENDPOINTS } from '@/config/api-endpoints';
import { INotificationListResponse } from '@/types';

export const notificationService = {
  list: (unreadOnly?: boolean) =>
    api.get<never, INotificationListResponse>(API_ENDPOINTS.NOTIFICATIONS.LIST, {
      params: unreadOnly ? { unreadOnly: 'true' } : undefined,
    }),

  markRead: (id: string) =>
    api.put<never, { message: string }>(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)),

  markAllRead: () =>
    api.put<never, { message: string }>(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ),
};
