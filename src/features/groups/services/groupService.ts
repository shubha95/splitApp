import apiClient from '../../../services/api/client';
import type { Group } from '../../../types/api';
import { API_ENDPOINTS } from '../../../config/constants';

export type CreateGroupPayload = Omit<Group, 'id' | 'createdAt'>;
export type UpdateGroupPayload = Partial<Omit<Group, 'id' | 'createdAt'>>;

const groupService = {
  getAll:       async (): Promise<Group[]> => (await apiClient.get<Group[]>(API_ENDPOINTS.GROUPS.BASE)).data,
  getById:      async (id: string): Promise<Group> => (await apiClient.get<Group>(API_ENDPOINTS.GROUPS.BY_ID(id))).data,
  create:       async (p: CreateGroupPayload): Promise<Group> => (await apiClient.post<Group>(API_ENDPOINTS.GROUPS.BASE, p)).data,
  update:       async (id: string, p: UpdateGroupPayload): Promise<Group> => (await apiClient.put<Group>(API_ENDPOINTS.GROUPS.BY_ID(id), p)).data,
  delete:       async (id: string): Promise<void> => { await apiClient.delete(API_ENDPOINTS.GROUPS.BY_ID(id)); },
  addMember:    async (groupId: string, memberId: string): Promise<Group> => (await apiClient.post<Group>(API_ENDPOINTS.GROUPS.MEMBERS(groupId), { memberId })).data,
  removeMember: async (groupId: string, memberId: string): Promise<Group> => (await apiClient.delete<Group>(API_ENDPOINTS.GROUPS.MEMBER_BY_ID(groupId, memberId))).data,
};

export default groupService;
