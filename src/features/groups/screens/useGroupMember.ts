import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroupMembersThunk } from '../store/groupsSlice';
import groupService from '../services/groupService';
import type { AppDispatch, RootState } from '../../../store';

export const useGroupMember = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { groupMembers, groupMembersLoading, groupMembersError } = useSelector(
    (s: RootState) => s.groups,
  );

  const [removeLoading, setRemoveLoading] = useState(false);

  const fetchMembers = (id: string) => {
    dispatch(fetchGroupMembersThunk({ groupID: id }));
  };

  const removeMember = async (
    memberRecordID: string,
    groupID: string,
  ): Promise<{ success: boolean; message: string }> => {
    setRemoveLoading(true);
    try {
      await groupService.removeGroupMember({ memberRecordID });
      dispatch(fetchGroupMembersThunk({ groupID }));
      return { success: true, message: 'Member removed successfully' };
    } catch (e: any) {
      const message = e.response?.data?.message ?? 'Failed to remove member';
      return { success: false, message };
    } finally {
      setRemoveLoading(false);
    }
  };

  return { groupMembers, groupMembersLoading, groupMembersError, fetchMembers, removeMember, removeLoading };
};
