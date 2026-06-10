// Central domain types — imported by both slices and services to avoid circular deps

export type User = {
  id: string;
  userName: string;
  emailId: string;
  address: string;
  avatar?: string;
};

export type SocialProvider = 'google' | 'facebook' | 'twitter' | 'outlook';

export type Expense = {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  splitAmong: string[];
  groupId?: string;
  date: string;
  category: string;
  settled: boolean;
};

export type Group = {
  id: string;
  name: string;
  members: string[];
  createdAt: string;
};

export type UpdateMyGroupPayload = {
  groupID:     string;
  groupName:   string;
  description: string;
};

export type MyGroupsPayload = {
  pageNumber: number;
  itemNumber: number;
};

export type MyGroup = {
  groupID:     string;
  groupName:   string;
  createdBy:   string;
  description: string;
  createDate:  string;
  updateDate:  string;
};

export type MyGroupsResponse = {
  total:       number;
  pageNumber:  number;
  itemNumber:  number;
  totalPages:  number;
  groups:      MyGroup[];
};

export type Contact = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
};

export type ApiError = {
  message: string;
  code?: string;
  statusCode?: number;
};
