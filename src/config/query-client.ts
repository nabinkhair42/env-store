import { QueryClient } from '@tanstack/react-query';
import { GC_TIME_MS, QUERY_RETRY_COUNT, STALE_TIME_MS } from './app-data';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Long staleTime means navigation between pages reuses the cache.
      // Mutations explicitly setQueryData / invalidate, so fresh data only
      // refetches when the cache is actually stale (not on every nav).
      staleTime: STALE_TIME_MS,
      gcTime: GC_TIME_MS,
      retry: QUERY_RETRY_COUNT,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
