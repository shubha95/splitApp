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
    SOCIAL:          '/auth/social',
    USERS:           '/auth/users',
  },
  EXPENSES: {
    BASE:     '/expenses',
    BY_ID:    (id: string) => `/expenses/${id}`,
    BY_GROUP: (groupId: string) => `/groups/${groupId}/expenses`,
    SETTLE:   (id: string) => `/expenses/${id}/settle`,
  },
  GROUPS: {
    BASE:          '/groups',
    MY_GROUPS:     '/group/my-groups',
    GROUP_CREATE:  '/group',
    GROUP_UPDATE:  '/group',
    GROUP_DELETE:  '/group',
    BY_ID:         (id: string) => `/groups/${id}`,
    MEMBERS:       (groupId: string) => `/groups/${groupId}/members`,
    MEMBER_BY_ID:  (groupId: string, memberId: string) => `/groups/${groupId}/members/${memberId}`,
  },
  GROUP_MEMBER: {
    MEMBERS: '/group-member/members',
    ADD:     '/group-member',
    REMOVE:  '/group-member',
  },
  CONTACTS: {
    BASE:   '/contacts',
    BY_ID:  (id: string) => `/contacts/${id}`,
    SEARCH: '/contacts/search',
  },
} as const;

export const APP_NAME = 'ExpenseSplit';
