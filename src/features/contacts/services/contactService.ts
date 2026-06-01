import apiClient from '../../../services/api/client';
import type { Contact } from '../../../types/api';
import { API_ENDPOINTS } from '../../../config/constants';

export type CreateContactPayload = Omit<Contact, 'id'>;

const contactService = {
  getAll:  async (): Promise<Contact[]> => (await apiClient.get<Contact[]>(API_ENDPOINTS.CONTACTS.BASE)).data,
  getById: async (id: string): Promise<Contact> => (await apiClient.get<Contact>(API_ENDPOINTS.CONTACTS.BY_ID(id))).data,
  create:  async (p: CreateContactPayload): Promise<Contact> => (await apiClient.post<Contact>(API_ENDPOINTS.CONTACTS.BASE, p)).data,
  update:  async (id: string, p: Partial<CreateContactPayload>): Promise<Contact> => (await apiClient.put<Contact>(API_ENDPOINTS.CONTACTS.BY_ID(id), p)).data,
  remove:  async (id: string): Promise<void> => { await apiClient.delete(API_ENDPOINTS.CONTACTS.BY_ID(id)); },
  search:  async (query: string): Promise<Contact[]> => (await apiClient.get<Contact[]>(API_ENDPOINTS.CONTACTS.SEARCH, { params: { q: query } })).data,
};

export default contactService;
