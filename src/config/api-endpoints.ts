export const API_ENDPOINTS = {
  PROJECTS: {
    LIST: '/projects',
    CREATE: '/projects',
    GET: (id: string) => `/projects/${id}`,
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
  },
  MEMBERS: {
    LIST: (projectId: string) => `/projects/${projectId}/members`,
    INVITE: (projectId: string) => `/projects/${projectId}/members`,
    UPDATE: (projectId: string, memberId: string) =>
      `/projects/${projectId}/members/${memberId}`,
    REMOVE: (projectId: string, memberId: string) =>
      `/projects/${projectId}/members/${memberId}`,
    RESPOND: (memberId: string) => `/members/${memberId}/respond`,
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },
  USERS: {
    SEARCH: '/users/search',
  },
} as const;
