import { createAction, createSlice } from '@reduxjs/toolkit';

import { isValidOrder } from '@utils/orders';

import { fetchFeedOrderByNumberThunk } from './thunks';

import type { TFeedOrder, TOrdersResponse } from '@utils/types';

type TOrdersFeedState = {
  orders: TFeedOrder[];
  total: number;
  totalToday: number;
  isConnected: boolean;
  loading: boolean;
  loaded: boolean;
  error: string | null;
};

const initialState: TOrdersFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnected: false,
  loading: false,
  loaded: false,
  error: null,
};

export const feedConnect = createAction<string>('ordersFeed/connect');
export const feedDisconnect = createAction('ordersFeed/disconnect');
export const feedConnecting = createAction('ordersFeed/connecting');
export const feedOpen = createAction('ordersFeed/open');
export const feedClose = createAction('ordersFeed/close');
export const feedError = createAction<string>('ordersFeed/error');
export const feedMessage = createAction<TOrdersResponse>('ordersFeed/message');

const slice = createSlice({
  name: 'ordersFeed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(feedConnecting, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(feedOpen, (state) => {
        state.isConnected = true;
        state.loading = false;
      })
      .addCase(feedClose, (state) => {
        state.isConnected = false;
        state.loading = false;
      })
      .addCase(feedError, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(feedMessage, (state, action) => {
        if (!action.payload.success || !Array.isArray(action.payload.orders)) {
          return;
        }

        state.orders = action.payload.orders.filter(isValidOrder);
        state.loaded = true;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchFeedOrderByNumberThunk.fulfilled, (state, action) => {
        if (!isValidOrder(action.payload)) {
          return;
        }

        const orderIndex = state.orders.findIndex(
          (order) => order.number === action.payload.number
        );

        if (orderIndex !== -1) {
          state.orders[orderIndex] = action.payload;
        }
      });
  },
});

export const feedActions = {
  connect: feedConnect,
  disconnect: feedDisconnect,
  connecting: feedConnecting,
  open: feedOpen,
  close: feedClose,
  error: feedError,
  message: feedMessage,
};

export default slice.reducer;
