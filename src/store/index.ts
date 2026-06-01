import { configureStore } from '@reduxjs/toolkit';
import authReducer     from '../features/auth/store/authSlice';
import expensesReducer from '../features/expenses/store/expensesSlice';
import groupsReducer   from '../features/groups/store/groupsSlice';
import contactsReducer from '../features/contacts/store/contactsSlice';

export const store = configureStore({
  reducer: {
    auth:     authReducer,
    expenses: expensesReducer,
    groups:   groupsReducer,
    contacts: contactsReducer,
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
