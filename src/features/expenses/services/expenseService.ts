import apiClient from '../../../services/api/client';
import type { Expense } from '../../../types/api';
import { API_ENDPOINTS } from '../../../config/constants';

export type CreateExpensePayload = Omit<Expense, 'id' | 'settled'>;
export type UpdateExpensePayload = Partial<Omit<Expense, 'id'>>;

const expenseService = {
  getAll:     async (): Promise<Expense[]> => (await apiClient.get<Expense[]>(API_ENDPOINTS.EXPENSES.BASE)).data,
  getById:    async (id: string): Promise<Expense> => (await apiClient.get<Expense>(API_ENDPOINTS.EXPENSES.BY_ID(id))).data,
  getByGroup: async (groupId: string): Promise<Expense[]> => (await apiClient.get<Expense[]>(API_ENDPOINTS.EXPENSES.BY_GROUP(groupId))).data,
  create:     async (payload: CreateExpensePayload): Promise<Expense> => (await apiClient.post<Expense>(API_ENDPOINTS.EXPENSES.BASE, payload)).data,
  update:     async (id: string, payload: UpdateExpensePayload): Promise<Expense> => (await apiClient.put<Expense>(API_ENDPOINTS.EXPENSES.BY_ID(id), payload)).data,
  delete:     async (id: string): Promise<void> => { await apiClient.delete(API_ENDPOINTS.EXPENSES.BY_ID(id)); },
  settle:     async (id: string): Promise<Expense> => (await apiClient.patch<Expense>(API_ENDPOINTS.EXPENSES.SETTLE(id))).data,
};

export default expenseService;
