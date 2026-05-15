import { createSlice } from '@reduxjs/toolkit';

import { forgotPasswordThunk, resetPasswordThunk } from './thunks';

type State = {
  loading: boolean;
  error: string | null;
};

const initialState: State = {
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'passwordReset',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPasswordThunk.rejected, (state) => {
        state.loading = false;
        state.error = 'Не удалось отправить письмо';
      })
      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPasswordThunk.rejected, (state) => {
        state.loading = false;
        state.error = 'Не удалось сохранить новый пароль';
      });
  },
});

export default slice.reducer;
