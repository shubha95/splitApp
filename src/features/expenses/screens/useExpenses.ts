import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpensesThunk, createExpenseThunk } from '../store/expensesSlice';
import type { AppDispatch, RootState } from '../../../store';
import type { CreateExpensePayload } from '../services/expenseService';

export const useExpenses = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { expenses, loading, error } = useSelector((s: RootState) => s.expenses);
  const currentUser = useSelector((s: RootState) => s.auth.user);

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle]       = useState('');
  const [amount, setAmount]     = useState('');
  const [category, setCategory] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchExpenses = () => {
    dispatch(fetchExpensesThunk());
  };

  const openModal = () => {
    setTitle(''); setAmount(''); setCategory('');
    setCreateError(null);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const submitExpense = async () => {
    if (!title.trim() || !amount.trim()) {
      setCreateError('Title and amount are required.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setCreateError('Enter a valid amount.');
      return;
    }

    setCreating(true);
    setCreateError(null);
    try {
      const payload: CreateExpensePayload = {
        title:       title.trim(),
        amount:      parsedAmount,
        category:    category.trim() || 'General',
        paidBy:      currentUser?.id ?? '',
        splitAmong:  [],
        date:        new Date().toISOString(),
      };
      await dispatch(createExpenseThunk(payload)).unwrap();
      closeModal();
    } catch (e: any) {
      setCreateError(typeof e === 'string' ? e : 'Failed to add expense.');
    } finally {
      setCreating(false);
    }
  };

  return {
    expenses, loading, error,
    modalVisible, openModal, closeModal,
    title, setTitle,
    amount, setAmount,
    category, setCategory,
    creating, createError,
    submitExpense, fetchExpenses,
  };
};
