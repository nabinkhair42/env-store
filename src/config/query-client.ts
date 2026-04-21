import { QueryClient } from '@tanstack/react-query';
import { GC_TIME_MS, QUERY_RETRY_COUNT, STALE_TIME_MS } from './app-data';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_MS,
      gcTime: GC_TIME_MS,
      retry: QUERY_RETRY_COUNT,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
