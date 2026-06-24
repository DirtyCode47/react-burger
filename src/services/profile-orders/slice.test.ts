import { describe, expect, it } from 'vitest';

import { orderMock } from '../test-data';
import reducer, {
  profileOrdersClose,
  profileOrdersConnecting,
  profileOrdersError,
  profileOrdersMessage,
  profileOrdersOpen,
} from './slice';
import { fetchProfileOrderByNumberThunk } from './thunks';

const initialState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnected: false,
  loading: false,
  loaded: false,
  error: null,
};

const response = {
  success: true,
  orders: [orderMock],
  total: 100,
  totalToday: 10,
};

describe('profile-orders slice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('handles profileOrdersConnecting', () => {
    expect(reducer(undefined, profileOrdersConnecting())).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('handles profileOrdersOpen', () => {
    expect(reducer({ ...initialState, loading: true }, profileOrdersOpen())).toEqual({
      ...initialState,
      isConnected: true,
    });
  });

  it('handles profileOrdersClose', () => {
    expect(
      reducer(
        { ...initialState, isConnected: true, loading: true },
        profileOrdersClose()
      )
    ).toEqual(initialState);
  });

  it('handles profileOrdersError', () => {
    expect(
      reducer({ ...initialState, loading: true }, profileOrdersError('socket error'))
    ).toEqual({
      ...initialState,
      error: 'socket error',
    });
  });

  it('handles valid profileOrdersMessage', () => {
    expect(
      reducer({ ...initialState, loading: true }, profileOrdersMessage(response))
    ).toEqual({
      ...initialState,
      orders: [orderMock],
      total: 100,
      totalToday: 10,
      loaded: true,
    });
  });

  it('ignores unsuccessful profileOrdersMessage', () => {
    const state = { ...initialState, orders: [orderMock] };

    expect(
      reducer(
        state,
        profileOrdersMessage({ success: false, orders: [], total: 0, totalToday: 0 })
      )
    ).toEqual(state);
  });

  it('filters invalid orders from profileOrdersMessage', () => {
    expect(
      reducer(
        undefined,
        profileOrdersMessage({
          success: true,
          orders: [{ ...orderMock, number: '123' } as never],
          total: 100,
          totalToday: 10,
        })
      ).orders
    ).toEqual([]);
  });

  it('updates existing order after fetchProfileOrderByNumberThunk.fulfilled', () => {
    const updatedOrder = { ...orderMock, name: 'Обновленный заказ' };

    expect(
      reducer(
        { ...initialState, orders: [orderMock] },
        fetchProfileOrderByNumberThunk.fulfilled(updatedOrder, '', orderMock.number)
      ).orders
    ).toEqual([updatedOrder]);
  });

  it('does not add missing order after fetchProfileOrderByNumberThunk.fulfilled', () => {
    expect(
      reducer(
        initialState,
        fetchProfileOrderByNumberThunk.fulfilled(orderMock, '', orderMock.number)
      )
    ).toEqual(initialState);
  });

  it('ignores invalid order after fetchProfileOrderByNumberThunk.fulfilled', () => {
    expect(
      reducer(
        { ...initialState, orders: [orderMock] },
        fetchProfileOrderByNumberThunk.fulfilled(
          { ...orderMock, ingredients: [1] } as never,
          '',
          orderMock.number
        )
      ).orders
    ).toEqual([orderMock]);
  });
});
