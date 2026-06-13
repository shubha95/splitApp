import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroupMembersThunk } from '../store/groupsSlice';
import type { AppDispatch, RootState } from '../../../store';

export const useGroupMember = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { groupMembers, groupMembersLoading, groupMembersError } = useSelector(
    (s: RootState) => s.groups,
  );

  const fetchMembers = (id: string) => {
    dispatch(fetchGroupMembersThunk({ groupID: id }));
  };

 
  return { groupMembers, groupMembersLoading, groupMembersError, fetchMembers };
};
