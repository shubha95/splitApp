import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import {
  fetchMyGroupsThunk,
  createMyGroupThunk,
  updateMyGroupThunk,
  deleteMyGroupThunk,
} from '../../groups/store/groupsSlice';
import type { AppDispatch, RootState } from '../../../store';
import type { MyGroup } from '../../../types/api';

export const useHomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { myGroups, myGroupsLoading, myGroupsTotal, error } = useSelector(
    (s: RootState) => s.groups,
  );

  const [modalVisible,  setModalVisible]  = useState(false);
  const [groupName,     setGroupName]     = useState('');
  const [description,   setDescription]  = useState('');
  const [creating,      setCreating]     = useState(false);
  const [createError,   setCreateError]  = useState<string | null>(null);
  const [editingGroup,  setEditingGroup] = useState<MyGroup | null>(null);

  useEffect(() => {
    dispatch(fetchMyGroupsThunk({ pageNumber: 1, itemNumber: 10 }));
  }, [dispatch]);

  const openModal = () => {
    setEditingGroup(null);
    setGroupName('');
    setDescription('');
    setCreateError(null);
    setModalVisible(true);
  };

  const openEditModal = (group: MyGroup) => {
    setEditingGroup(group);
    setGroupName(group.groupName);
    setDescription(group.description);
    setCreateError(null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingGroup(null);
  };

  const submitGroup = async () => {
    if (!groupName.trim()) {
      setCreateError('Group name is required');
      return;
    }
    setCreating(true);
    setCreateError(null);

    const result = editingGroup
      ? await dispatch(updateMyGroupThunk({
          groupID:     editingGroup.groupID,
          groupName:   groupName.trim(),
          description: description.trim(),
        }))
      : await dispatch(createMyGroupThunk({
          groupName:   groupName.trim(),
          description: description.trim(),
        }));

    setCreating(false);

    const matched = editingGroup
      ? updateMyGroupThunk.fulfilled.match(result)
      : createMyGroupThunk.fulfilled.match(result);

    if (matched) {
      closeModal();
    } else {
      setCreateError((result.payload as string) ?? 'Operation failed');
    }
  };

  const deleteGroup = async (group: MyGroup) => {
    const result = await dispatch(deleteMyGroupThunk(group.groupID));
    if (deleteMyGroupThunk.fulfilled.match(result)) {
      Toast.show({ type: 'success', text1: result.payload.message, visibilityTime: 2000 });
    } else {
      Toast.show({ type: 'error', text1: (result.payload as string) ?? 'Delete failed', visibilityTime: 2500 });
    }
  };
  
  const Details = (group: MyGroup) => {
    console.log('Group Details:', group);
  }
  return {
    myGroups,
    myGroupsLoading,
    myGroupsTotal,
    error,
    modalVisible,
    groupName,
    setGroupName,
    description,
    setDescription,
    creating,
    createError,
    editingGroup,
    openModal,
    openEditModal,
    closeModal,
    submitGroup,
    deleteGroup,
    Details
  };
};
