import { createAction, createSlice } from '@reduxjs/toolkit';

import { isValidOrder } from '@utils/orders';

import { fetchProfileOrderByNumberThunk } from './thunks';

import type { TFeedOrder, TOrdersResponse } from '@utils/types';

type TProfileOrdersState = {
  orders: TFeedOrder[];
  total: number;
  totalToday: number;
  isConnected: boolean;
  loading: boolean;
  loaded: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnected: false,
  loading: false,
  loaded: false,
  error: null,
};

export const profileOrdersConnect = createAction<string>('profileOrders/connect');
export const profileOrdersDisconnect = createAction('profileOrders/disconnect');
export const profileOrdersConnecting = createAction('profileOrders/connecting');
export const profileOrdersOpen = createAction('profileOrders/open');
export const profileOrdersClose = createAction('profileOrders/close');
export const profileOrdersError = createAction<string>('profileOrders/error');
export const profileOrdersMessage = createAction<TOrdersResponse>(
  'profileOrders/message'
);

const slice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(profileOrdersConnecting, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(profileOrdersOpen, (state) => {
        state.isConnected = true;
        state.loading = false;
      })
      .addCase(profileOrdersClose, (state) => {
        state.isConnected = false;
        state.loading = false;
      })
      .addCase(profileOrdersError, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(profileOrdersMessage, (state, action) => {
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
      .addCase(fetchProfileOrderByNumberThunk.fulfilled, (state, action) => {
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

export const profileOrdersActions = {
  connect: profileOrdersConnect,
  disconnect: profileOrdersDisconnect,
  connecting: profileOrdersConnecting,
  open: profileOrdersOpen,
  close: profileOrdersClose,
  error: profileOrdersError,
  message: profileOrdersMessage,
};

export default slice.reducer;
