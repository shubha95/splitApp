import apiClient from '../../../services/api/client';
import type { AddGroupMemberPayload, AddGroupMemberResponse, Group, GroupMember, GroupMemberId, MyGroup, MyGroupsPayload, MyGroupsResponse, RemoveGroupMemberPayload, UpdateMyGroupPayload } from '../../../types/api';
import { API_ENDPOINTS } from '../../../config/constants';

export type CreateGroupPayload = Omit<Group, 'id' | 'createdAt'>;
export type UpdateGroupPayload = Partial<Omit<Group, 'id' | 'createdAt'>>;

const groupService = {
  myGroups:     async (p: MyGroupsPayload): Promise<MyGroupsResponse> => (await apiClient.post<{ data: MyGroupsResponse }>(API_ENDPOINTS.GROUPS.MY_GROUPS, p)).data.data,
  createMyGroup:  async (p: { groupName: string; description: string }): Promise<MyGroup> => (await apiClient.post<{ data: MyGroup }>(API_ENDPOINTS.GROUPS.GROUP_CREATE, p)).data.data,
  updateMyGroup:  async (p: UpdateMyGroupPayload): Promise<MyGroup> => (await apiClient.put<{ data: MyGroup }>(API_ENDPOINTS.GROUPS.GROUP_UPDATE, p)).data.data,
  deleteMyGroup:  async (groupID: string): Promise<{ groupID: string; message: string }> => { const res = await apiClient.delete<{ message: string; data: { groupID: string } }>(API_ENDPOINTS.GROUPS.GROUP_DELETE, { data: { groupID } }); return { groupID: res.data.data.groupID, message: res.data.message }; },
  getAll:       async (): Promise<Group[]> => (await apiClient.get<Group[]>(API_ENDPOINTS.GROUPS.BASE)).data,
  getById:      async (id: string): Promise<Group> => (await apiClient.get<Group>(API_ENDPOINTS.GROUPS.BY_ID(id))).data,
  create:       async (p: CreateGroupPayload): Promise<Group> => (await apiClient.post<Group>(API_ENDPOINTS.GROUPS.BASE, p)).data,
  update:       async (id: string, p: UpdateGroupPayload): Promise<Group> => (await apiClient.put<Group>(API_ENDPOINTS.GROUPS.BY_ID(id), p)).data,
  delete:       async (id: string): Promise<void> => { await apiClient.delete(API_ENDPOINTS.GROUPS.BY_ID(id)); },
  addMember:       async (groupId: string, memberId: string): Promise<Group> => (await apiClient.post<Group>(API_ENDPOINTS.GROUPS.MEMBERS(groupId), { memberId })).data,
  removeMember:    async (groupId: string, memberId: string): Promise<Group> => (await apiClient.delete<Group>(API_ENDPOINTS.GROUPS.MEMBER_BY_ID(groupId, memberId))).data,
  getGroupMembers:  async (payload: GroupMemberId): Promise<GroupMember[]> => (await apiClient.post<{ data: GroupMember[] }>(API_ENDPOINTS.GROUP_MEMBER.MEMBERS, payload)).data.data,
  addGroupMembers:    async (payload: AddGroupMemberPayload): Promise<AddGroupMemberResponse> => (await apiClient.post<{ data: AddGroupMemberResponse }>(API_ENDPOINTS.GROUP_MEMBER.ADD, payload)).data.data,
  removeGroupMember:  async (payload: RemoveGroupMemberPayload): Promise<void> => { await apiClient.delete(API_ENDPOINTS.GROUP_MEMBER.REMOVE, { data: payload }); },
};

export default groupService;
