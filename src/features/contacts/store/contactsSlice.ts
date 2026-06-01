import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import contactService, { CreateContactPayload } from '../services/contactService';
import type { Contact } from '../../../types/api';

type ContactsState = { contacts: Contact[]; loading: boolean; error: string | null };
const initialState: ContactsState = { contacts: [], loading: false, error: null };

export const fetchContactsThunk  = createAsyncThunk('contacts/fetchAll', async (_, { rejectWithValue }) => { try { return await contactService.getAll(); } catch (e: any) { return rejectWithValue(e.response?.data?.message ?? 'Failed'); } });
export const createContactThunk  = createAsyncThunk('contacts/create',   async (p: CreateContactPayload, { rejectWithValue }) => { try { return await contactService.create(p); } catch (e: any) { return rejectWithValue(e.response?.data?.message ?? 'Failed'); } });
export const updateContactThunk  = createAsyncThunk('contacts/update',   async ({ id, payload }: { id: string; payload: Partial<CreateContactPayload> }, { rejectWithValue }) => { try { return await contactService.update(id, payload); } catch (e: any) { return rejectWithValue(e.response?.data?.message ?? 'Failed'); } });
export const deleteContactThunk  = createAsyncThunk('contacts/delete',   async (id: string, { rejectWithValue }) => { try { await contactService.remove(id); return id; } catch (e: any) { return rejectWithValue(e.response?.data?.message ?? 'Failed'); } });
export const searchContactsThunk = createAsyncThunk('contacts/search',   async (query: string, { rejectWithValue }) => { try { return await contactService.search(query); } catch (e: any) { return rejectWithValue(e.response?.data?.message ?? 'Failed'); } });

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    addContact:    (s, a: PayloadAction<Contact>) => { s.contacts.push(a.payload); },
    updateContact: (s, a: PayloadAction<Contact>) => { const i = s.contacts.findIndex(c => c.id === a.payload.id); if (i !== -1) s.contacts[i] = a.payload; },
    removeContact: (s, a: PayloadAction<string>) => { s.contacts = s.contacts.filter(c => c.id !== a.payload); },
    setContacts:   (s, a: PayloadAction<Contact[]>) => { s.contacts = a.payload; },
    clearError:    s => { s.error = null; },
  },
  extraReducers: b => {
    b.addCase(fetchContactsThunk.pending,   s => { s.loading = true; s.error = null; })
     .addCase(fetchContactsThunk.fulfilled, (s, a) => { s.loading = false; s.contacts = a.payload; })
     .addCase(fetchContactsThunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload as string; });
    b.addCase(createContactThunk.fulfilled, (s, a) => { s.contacts.push(a.payload); })
     .addCase(createContactThunk.rejected,  (s, a) => { s.error = a.payload as string; });
    b.addCase(updateContactThunk.fulfilled, (s, a) => { const i = s.contacts.findIndex(c => c.id === a.payload.id); if (i !== -1) s.contacts[i] = a.payload; });
    b.addCase(deleteContactThunk.fulfilled, (s, a) => { s.contacts = s.contacts.filter(c => c.id !== a.payload); });
    b.addCase(searchContactsThunk.fulfilled, (s, a) => { s.contacts = a.payload; });
  },
});

export const { addContact, updateContact, removeContact, setContacts, clearError } = contactsSlice.actions;
export default contactsSlice.reducer;
