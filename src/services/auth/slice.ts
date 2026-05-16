import { createSlice } from '@reduxjs/toolkit';

import {
  checkUserAuthThunk,
  loginUserThunk,
  logoutUserThunk,
  registerUserThunk,
  updateUserThunk,
} from './thunks';

import type { TUser } from '@utils/types';

type State = {
  user: TUser | null;
  loading: boolean;
  isAuthChecked: boolean;
  error: string | null;
};

const initialState: State = {
  user: null,
  loading: false,
  isAuthChecked: false,
  error: null,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUserThunk.rejected, (state) => {
        state.loading = false;
        state.error = 'Не удалось зарегистрироваться';
      })
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUserThunk.rejected, (state) => {
        state.loading = false;
        state.error = 'Не удалось войти';
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUserThunk.rejected, (state) => {
        state.loading = false;
        state.error = 'Не удалось выйти';
      })
      .addCase(checkUserAuthThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkUserAuthThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(checkUserAuthThunk.rejected, (state) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.user = null;
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserThunk.rejected, (state) => {
        state.loading = false;
        state.error = 'Не удалось обновить данные';
      });
  },
});

export default slice.reducer;
