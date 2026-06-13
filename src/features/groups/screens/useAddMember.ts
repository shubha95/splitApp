import { useState, useEffect } from 'react';
import authService from '../../auth/services/authService';
import groupService from '../services/groupService';
import type { ListUser } from '../../../types/api';

export const useAddMember = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ListUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [addLoading, setAddLoading] = useState(false);

  const fetchUsers = async (search: string, groupID: string) => {
    setSearchLoading(true);
    setSearchError(null);
    try {
      const res = await authService.getUsers({ pageNumber: 1, itemNumber: 10, search, groupID });
      setSearchResults(res.users);
    } catch (e: any) {
      setSearchError(e.response?.data?.message ?? 'Failed to fetch users');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const getAllMember = (groupID: string) => {
    console.log('Fetching all users for group:', groupID);
    fetchUsers('', groupID);
  };

  // Debounced search when query changes
  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timer = setTimeout(() => fetchUsers(searchQuery.trim(),''), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleSelect = (userId: string) => {
    setSelectedIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId],
    );
  };

  const addMembers = async (groupId: string) => {
    if (!selectedIds.length) return;
    setAddLoading(true);
    setSearchError(null);
    try {
      await groupService.addGroupMembers({ memberID: selectedIds, groupID: groupId });
      setSelectedIds([]);
    } catch (e: any) {
      setSearchError(e.response?.data?.message ?? 'Failed to add members');
    } finally {
      setAddLoading(false);
    }
  };

  return {
    searchQuery, setSearchQuery,
    searchResults, searchLoading, searchError,
    selectedIds, toggleSelect,
    addMembers, addLoading,
    getAllMember,
  };
};
