import { createSlice } from '@reduxjs/toolkit';

import { fetchOrderByNumberThunk } from './thunks';

import type { TFeedOrder } from '@utils/types';

type TOrderInfoState = {
  order: TFeedOrder | null;
  loading: boolean;
  error: string | null;
};

const initialState: TOrderInfoState = {
  order: null,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'orderInfo',
  initialState,
  reducers: {
    clearOrderInfo(state) {
      state.order = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumberThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumberThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByNumberThunk.rejected, (state) => {
        state.loading = false;
        state.error = 'Ошибка загрузки заказа';
      });
  },
});

export const { clearOrderInfo } = slice.actions;
export default slice.reducer;
