import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService, { LoginPayload, RegisterPayload } from '../services/authService';
import tokenService from '../../../services/security/tokenService';
import type { User } from '../../../types/api';

type AuthState = {
  user:         User | null;
  token:        string | null;
  tokenExpiry:  string | null;
  isSignedIn:   boolean;
  loading:      boolean;
  error:        string | null;
};

const initialState: AuthState = {
  user:         null,
  token:        null,
  tokenExpiry:  null,
  isSignedIn:   false,
  loading:      false,
  error:        null,
};

// ── Async thunks ──────────────────────────────────────────────────────────────

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await authService.login(payload);
      console.log('Login successful, received token:', response);
      await tokenService.save(response.token);
      return response;
    } catch (error: any) {
      console.log('Login failed:', error);
      return rejectWithValue(error.response?.data?.message ?? 'Login failed');
    }
  },
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await authService.register(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Registration failed');
    }
  },
);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  try {
    await authService.logout();
  } finally {
    await tokenService.remove();
  }
});

export const restoreAuthThunk = createAsyncThunk('auth/restore', async () => {
  try {
    const token = await tokenService.get();
    console.log('[restoreAuth] token from keychain:', token ? 'found' : 'not found');
    if (!token) return null;
    const user = await authService.getProfile(token);
    console.log('[restoreAuth] profile fetched, user:', user);
    return { user, token };
  } catch (error) {
    console.log('[restoreAuth] failed, removing token. Error:', error);
    await tokenService.remove();
    return null;
  }
});

export const getProfileThunk = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getProfile();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to fetch profile');
    }
  },
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isSignedIn = true;
      state.error = null;
    },
    signOut: state => {
      state.user       = null;
      state.token      = null;
      state.isSignedIn = false;
      state.error      = null;
    },
    signUp: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isSignedIn = true;
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError: state => { state.error = null; },
  },
  extraReducers: builder => {
    builder
      .addCase(loginThunk.pending, state => { state.loading = true; state.error = null; })
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.token = payload.token;
        state.tokenExpiry = payload.tokenExpiry;
        state.isSignedIn = true;
      })
      .addCase(loginThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      });

    builder
      .addCase(registerThunk.pending, state => { state.loading = true; state.error = null; })
      .addCase(registerThunk.fulfilled, state => {
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      });

    builder
      .addCase(logoutThunk.fulfilled, state => {
        state.user = null; state.token = null; state.tokenExpiry = null; state.isSignedIn = false;
      });

    builder
      .addCase(restoreAuthThunk.pending, state => { state.loading = true; })
      .addCase(restoreAuthThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          state.user = payload.user;
          state.token = payload.token;
          state.isSignedIn = true;
        }
      })
      .addCase(restoreAuthThunk.rejected, state => { state.loading = false; });

    builder.addCase(getProfileThunk.fulfilled, (state, { payload }) => {
      state.user = payload;
    });
  },
});

export const { signIn, signOut, signUp, updateUser, clearError } = authSlice.actions;
export default authSlice.reducer;
