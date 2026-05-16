import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  fetchUser,
  getRefreshToken,
  loginUser,
  logoutUser,
  registerUser,
  removeTokens,
  setTokens,
  updateUser,
} from '@services/api';

export const registerUserThunk = createAsyncThunk(
  'auth/register',
  async (data: { email: string; password: string; name: string }) => {
    const res = await registerUser(data);
    setTokens(res.accessToken, res.refreshToken);
    return res.user;
  }
);

export const loginUserThunk = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }) => {
    const res = await loginUser(data);
    setTokens(res.accessToken, res.refreshToken);
    return res.user;
  }
);

export const logoutUserThunk = createAsyncThunk('auth/logout', async () => {
  await logoutUser();
  removeTokens();
});

export const checkUserAuthThunk = createAsyncThunk('auth/check', async () => {
  if (!getRefreshToken()) {
    return null;
  }

  const res = await fetchUser();
  return res.user;
});

export const updateUserThunk = createAsyncThunk(
  'auth/update',
  async (data: { name: string; email: string; password: string }) => {
    const res = await updateUser(data);
    return res.user;
  }
);
