import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import groupService, { CreateGroupPayload, UpdateGroupPayload } from '../services/groupService';
import type { Group } from '../../../types/api';

type GroupsState = {
  groups:          Group[];
  selectedGroupId: string | null;
  loading:         boolean;
  error:           string | null;
};

const initialState: GroupsState = { groups: [], selectedGroupId: null, loading: false, error: null };

export const fetchGroupsThunk   = createAsyncThunk('groups/fetchAll', async (_, { rejectWithValue }) => { try { return await groupService.getAll(); } catch (e: any) { return rejectWithValue(e.response?.data?.message ?? 'Failed'); } });
export const createGroupThunk   = createAsyncThunk('groups/create',   async (p: CreateGroupPayload, { rejectWithValue }) => { try { return await groupService.create(p); } catch (e: any) { return rejectWithValue(e.response?.data?.message ?? 'Failed'); } });
export const updateGroupThunk   = createAsyncThunk('groups/update',   async ({ id, payload }: { id: string; payload: UpdateGroupPayload }, { rejectWithValue }) => { try { return await groupService.update(id, payload); } catch (e: any) { return rejectWithValue(e.response?.data?.message ?? 'Failed'); } });
export const deleteGroupThunk   = createAsyncThunk('groups/delete',   async (id: string, { rejectWithValue }) => { try { await groupService.delete(id); return id; } catch (e: any) { return rejectWithValue(e.response?.data?.message ?? 'Failed'); } });
export const addMemberThunk     = createAsyncThunk('groups/addMember',    async ({ groupId, memberId }: { groupId: string; memberId: string }, { rejectWithValue }) => { try { return await groupService.addMember(groupId, memberId); } catch (e: any) { return rejectWithValue(e.response?.data?.message ?? 'Failed'); } });
export const removeMemberThunk  = createAsyncThunk('groups/removeMember', async ({ groupId, memberId }: { groupId: string; memberId: string }, { rejectWithValue }) => { try { return await groupService.removeMember(groupId, memberId); } catch (e: any) { return rejectWithValue(e.response?.data?.message ?? 'Failed'); } });

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    selectGroup:          (s, a: PayloadAction<string | null>) => { s.selectedGroupId = a.payload; },
    addGroup:             (s, a: PayloadAction<Group>) => { s.groups.push(a.payload); },
    updateGroup:          (s, a: PayloadAction<Group>) => { const i = s.groups.findIndex(g => g.id === a.payload.id); if (i !== -1) s.groups[i] = a.payload; },
    deleteGroup:          (s, a: PayloadAction<string>) => { s.groups = s.groups.filter(g => g.id !== a.payload); if (s.selectedGroupId === a.payload) s.selectedGroupId = null; },
    addMemberToGroup:     (s, a: PayloadAction<{ groupId: string; memberId: string }>) => { const g = s.groups.find(g => g.id === a.payload.groupId); if (g && !g.members.includes(a.payload.memberId)) g.members.push(a.payload.memberId); },
    removeMemberFromGroup:(s, a: PayloadAction<{ groupId: string; memberId: string }>) => { const g = s.groups.find(g => g.id === a.payload.groupId); if (g) g.members = g.members.filter(m => m !== a.payload.memberId); },
    setGroups:            (s, a: PayloadAction<Group[]>) => { s.groups = a.payload; },
    clearError:           s => { s.error = null; },
  },
  extraReducers: b => {
    b.addCase(fetchGroupsThunk.pending,   s => { s.loading = true; s.error = null; })
     .addCase(fetchGroupsThunk.fulfilled, (s, a) => { s.loading = false; s.groups = a.payload; })
     .addCase(fetchGroupsThunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload as string; });
    b.addCase(createGroupThunk.fulfilled, (s, a) => { s.groups.push(a.payload); })
     .addCase(createGroupThunk.rejected,  (s, a) => { s.error = a.payload as string; });
    b.addCase(updateGroupThunk.fulfilled, (s, a) => { const i = s.groups.findIndex(g => g.id === a.payload.id); if (i !== -1) s.groups[i] = a.payload; });
    b.addCase(deleteGroupThunk.fulfilled, (s, a) => { s.groups = s.groups.filter(g => g.id !== a.payload); if (s.selectedGroupId === a.payload) s.selectedGroupId = null; });
    b.addCase(addMemberThunk.fulfilled,    (s, a) => { const i = s.groups.findIndex(g => g.id === a.payload.id); if (i !== -1) s.groups[i] = a.payload; });
    b.addCase(removeMemberThunk.fulfilled, (s, a) => { const i = s.groups.findIndex(g => g.id === a.payload.id); if (i !== -1) s.groups[i] = a.payload; });
  },
});

export const { selectGroup, addGroup, updateGroup, deleteGroup, addMemberToGroup, removeMemberFromGroup, setGroups, clearError } = groupsSlice.actions;
export default groupsSlice.reducer;
