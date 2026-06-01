import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import expenseService, { CreateExpensePayload, UpdateExpensePayload } from '../services/expenseService';
import type { Expense } from '../../../types/api';

type ExpensesState = {
  expenses: Expense[];
  loading:  boolean;
  error:    string | null;
};

const initialState: ExpensesState = { expenses: [], loading: false, error: null };

export const fetchExpensesThunk       = createAsyncThunk('expenses/fetchAll',   async (_, { rejectWithValue }) => { try { return await expenseService.getAll(); } catch (e: any) { return rejectWithValue(e.response?.data?.message ?? 'Failed'); } });
export const fetchGroupExpensesThunk  = createAsyncThunk('expenses/fetchByGroup', async (groupId: string, { rejectWithValue }) => { try { return await expenseService.getByGroup(groupId); } catch (e: any) { return rejectWithValue(e.response?.data?.message ?? 'Failed'); } });
export const createExpenseThunk       = createAsyncThunk('expenses/create',      async (payload: CreateExpensePayload, { rejectWithValue }) => { try { return await expenseService.create(payload); } catch (e: any) { return rejectWithValue(e.response?.data?.message ?? 'Failed'); } });
export const updateExpenseThunk       = createAsyncThunk('expenses/update',      async ({ id, payload }: { id: string; payload: UpdateExpensePayload }, { rejectWithValue }) => { try { return await expenseService.update(id, payload); } catch (e: any) { return rejectWithValue(e.response?.data?.message ?? 'Failed'); } });
export const deleteExpenseThunk       = createAsyncThunk('expenses/delete',      async (id: string, { rejectWithValue }) => { try { await expenseService.delete(id); return id; } catch (e: any) { return rejectWithValue(e.response?.data?.message ?? 'Failed'); } });
export const settleExpenseThunk       = createAsyncThunk('expenses/settle',      async (id: string, { rejectWithValue }) => { try { return await expenseService.settle(id); } catch (e: any) { return rejectWithValue(e.response?.data?.message ?? 'Failed'); } });

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense:    (s, a: PayloadAction<Expense>) => { s.expenses.push(a.payload); },
    updateExpense: (s, a: PayloadAction<Expense>) => { const i = s.expenses.findIndex(e => e.id === a.payload.id); if (i !== -1) s.expenses[i] = a.payload; },
    deleteExpense: (s, a: PayloadAction<string>) => { s.expenses = s.expenses.filter(e => e.id !== a.payload); },
    settleExpense: (s, a: PayloadAction<string>) => { const e = s.expenses.find(e => e.id === a.payload); if (e) e.settled = true; },
    setExpenses:   (s, a: PayloadAction<Expense[]>) => { s.expenses = a.payload; },
    clearError:    s => { s.error = null; },
  },
  extraReducers: b => {
    b.addCase(fetchExpensesThunk.pending,  s => { s.loading = true; s.error = null; })
     .addCase(fetchExpensesThunk.fulfilled, (s, a) => { s.loading = false; s.expenses = a.payload; })
     .addCase(fetchExpensesThunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload as string; });
    b.addCase(fetchGroupExpensesThunk.fulfilled, (s, a) => { s.expenses = a.payload; });
    b.addCase(createExpenseThunk.fulfilled, (s, a) => { s.expenses.push(a.payload); })
     .addCase(createExpenseThunk.rejected,  (s, a) => { s.error = a.payload as string; });
    b.addCase(updateExpenseThunk.fulfilled, (s, a) => { const i = s.expenses.findIndex(e => e.id === a.payload.id); if (i !== -1) s.expenses[i] = a.payload; });
    b.addCase(deleteExpenseThunk.fulfilled, (s, a) => { s.expenses = s.expenses.filter(e => e.id !== a.payload); });
    b.addCase(settleExpenseThunk.fulfilled, (s, a) => { const i = s.expenses.findIndex(e => e.id === a.payload.id); if (i !== -1) s.expenses[i] = a.payload; });
  },
});

export const { addExpense, updateExpense, deleteExpense, settleExpense, setExpenses, clearError } = expensesSlice.actions;
export default expensesSlice.reducer;
