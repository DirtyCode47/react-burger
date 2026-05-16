import { createAsyncThunk } from '@reduxjs/toolkit';

import { forgotPassword, resetPassword } from '@services/api';

export const forgotPasswordThunk = createAsyncThunk(
  'password/forgot',
  async (email: string) => {
    await forgotPassword(email);
  }
);

export const resetPasswordThunk = createAsyncThunk(
  'password/reset',
  async (data: { password: string; token: string }) => {
    await resetPassword(data);
  }
);
