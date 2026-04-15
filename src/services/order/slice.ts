import { createSlice } from '@reduxjs/toolkit';

import { createOrderThunk } from './thunks';

type State = {
  number: number | null;
  loading: boolean;
};

const initialState: State = {
  number: null,
  loading: false,
};

const slice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder(state) {
      state.number = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.number = action.payload;
      })
      .addCase(createOrderThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearOrder } = slice.actions;
export default slice.reducer;
