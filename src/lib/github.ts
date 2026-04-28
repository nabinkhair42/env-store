import { cache } from 'react';

export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  email: string | null;
}

/**
 * Fetches a GitHub user's public profile by username.
 * - React.cache(): per-request memoization across multiple lookups in same request
 * - next.revalidate: cross-request cache for 5 minutes
 *
 * Uses the unauthenticated public API (60 requests/hour per IP).
 */
export const fetchGitHubUser = cache(async (
  username: string,
): Promise<GitHubUser | null> => {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      id: data.id,
      login: data.login,
      name: data.name,
      avatar_url: data.avatar_url,
      email: data.email,
    };
  } catch {
    return null;
  }
});
