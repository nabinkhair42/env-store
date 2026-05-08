import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { useRef, useState } from 'react';

// Debounce without useEffect: schedule a deferred state update during render
// when the input changes. `lastQueryRef` keeps strict-mode double-renders from
// stacking timers — the second render sees no diff and skips.
export function useUserSearch(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastQueryRef = useRef<string>('');

  if (query !== lastQueryRef.current) {
    lastQueryRef.current = query;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQuery(query.trim()), 400);
  }

  return useQuery({
    queryKey: ['user-search', debouncedQuery],
    queryFn: () => userService.search(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });
}
