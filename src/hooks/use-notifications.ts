import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notification.service';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
};

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: () => notificationService.list(),
    refetchInterval: 60_000, // 1 minute — balance freshness vs server load
    staleTime: 30_000, // Treat data as fresh for 30s
    refetchOnWindowFocus: true, // Catch up immediately when user returns
  });
}

export function useUnreadCount() {
  const { data } = useNotifications();
  return data?.unreadCount ?? 0;
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    // Optimistic update — flip read state immediately
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: notificationKeys.list() });
      const prev = qc.getQueryData(notificationKeys.list());
      qc.setQueryData(notificationKeys.list(), (old: unknown) => {
        if (!old || typeof old !== 'object' || !('notifications' in old)) return old;
        const data = old as { notifications: { _id: string; read: boolean }[]; unreadCount: number };
        return {
          ...data,
          notifications: data.notifications.map((n) =>
            String(n._id) === id ? { ...n, read: true } : n,
          ),
          unreadCount: Math.max(0, data.unreadCount - 1),
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
      const prev = qc.getQueryData(notificationKeys.list());
      qc.setQueryData(notificationKeys.list(), (old: unknown) => {
        if (!old || typeof old !== 'object' || !('notifications' in old)) return old;
        const data = old as { notifications: { read: boolean }[]; unreadCount: number };
        return {
          ...data,
          notifications: data.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        };
      });
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
