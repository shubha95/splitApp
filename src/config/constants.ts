export const STORAGE_KEYS = {
  AUTH_TOKEN: 'com.expensesplitapp.authToken',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN:           '/auth/login',
    REGISTER:        '/auth/register',
    LOGOUT:          '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD:  '/auth/reset-password',
    ME:              '/auth/me',
  },
  EXPENSES: {
    BASE:     '/expenses',
    BY_ID:    (id: string) => `/expenses/${id}`,
    BY_GROUP: (groupId: string) => `/groups/${groupId}/expenses`,
    SETTLE:   (id: string) => `/expenses/${id}/settle`,
  },
  GROUPS: {
    BASE:          '/groups',
    BY_ID:         (id: string) => `/groups/${id}`,
    MEMBERS:       (groupId: string) => `/groups/${groupId}/members`,
    MEMBER_BY_ID:  (groupId: string, memberId: string) => `/groups/${groupId}/members/${memberId}`,
  },
  CONTACTS: {
    BASE:   '/contacts',
    BY_ID:  (id: string) => `/contacts/${id}`,
    SEARCH: '/contacts/search',
  },
} as const;

export const APP_NAME = 'ExpenseSplit';
