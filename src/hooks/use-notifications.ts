import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notification.service';
import { INotification, INotificationListResponse } from '@/types';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
};

const POLL_INTERVAL_MS = 30_000;

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: () => notificationService.list(),
    // refetchIntervalInBackground: false means the interval pauses while the
    // tab is backgrounded — refetchOnWindowFocus picks it back up on return.
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    // Considered fresh for slightly less than the poll interval so a focus
    // event mid-cycle doesn't immediately trigger a duplicate fetch.
    staleTime: POLL_INTERVAL_MS - 5_000,
  });
}

export function useUnreadCount() {
  const { data } = useNotifications();
  return data?.unreadCount ?? 0;
}

type CachedList = INotificationListResponse | undefined;

function patchCache(
  qc: ReturnType<typeof useQueryClient>,
  updater: (data: INotificationListResponse) => INotificationListResponse,
) {
  qc.setQueryData<CachedList>(notificationKeys.list(), (old) => {
    if (!old) return old;
    return updater(old);
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: notificationKeys.list() });
      const prev = qc.getQueryData<CachedList>(notificationKeys.list());
      patchCache(qc, (data) => {
        const target = data.notifications.find((n) => String(n._id) === id);
        const wasUnread = target ? !target.read : false;
        return {
          ...data,
          notifications: data.notifications.map((n) =>
            String(n._id) === id ? { ...n, read: true } : n,
          ),
          unreadCount: wasUnread
            ? Math.max(0, data.unreadCount - 1)
            : data.unreadCount,
        };
      });
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(notificationKeys.list(), ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkUnread() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markUnread(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: notificationKeys.list() });
      const prev = qc.getQueryData<CachedList>(notificationKeys.list());
      patchCache(qc, (data) => {
        const target = data.notifications.find((n) => String(n._id) === id);
        const wasRead = target ? target.read : false;
        return {
          ...data,
          notifications: data.notifications.map((n) =>
            String(n._id) === id ? { ...n, read: false } : n,
          ),
          unreadCount: wasRead ? data.unreadCount + 1 : data.unreadCount,
        };
      });
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(notificationKeys.list(), ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useDismissNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.dismiss(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: notificationKeys.list() });
      const prev = qc.getQueryData<CachedList>(notificationKeys.list());
      patchCache(qc, (data) => {
        const target = data.notifications.find((n) => String(n._id) === id);
        const wasUnread = target ? !target.read : false;
        return {
          ...data,
          notifications: data.notifications.filter(
            (n) => String(n._id) !== id,
          ),
          unreadCount: wasUnread
            ? Math.max(0, data.unreadCount - 1)
            : data.unreadCount,
        };
      });
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(notificationKeys.list(), ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: notificationKeys.list() });
      const prev = qc.getQueryData<CachedList>(notificationKeys.list());
      patchCache(qc, (data) => ({
        ...data,
        notifications: data.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(notificationKeys.list(), ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export type { INotification };
