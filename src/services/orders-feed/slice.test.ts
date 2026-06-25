import { describe, expect, it } from 'vitest';

import { orderMock } from '../test-data';
import reducer, {
  feedClose,
  feedConnecting,
  feedError,
  feedMessage,
  feedOpen,
} from './slice';
import { fetchFeedOrderByNumberThunk } from './thunks';

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

describe('orders-feed slice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('handles feedConnecting', () => {
    expect(reducer(undefined, feedConnecting())).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('handles feedOpen', () => {
    expect(reducer({ ...initialState, loading: true }, feedOpen())).toEqual({
      ...initialState,
      isConnected: true,
    });
  });

  it('handles feedClose', () => {
    expect(
      reducer({ ...initialState, isConnected: true, loading: true }, feedClose())
    ).toEqual(initialState);
  });

  it('handles feedError', () => {
    expect(
      reducer({ ...initialState, loading: true }, feedError('socket error'))
    ).toEqual({
      ...initialState,
      error: 'socket error',
    });
  });

  it('handles valid feedMessage', () => {
    expect(reducer({ ...initialState, loading: true }, feedMessage(response))).toEqual({
      ...initialState,
      orders: [orderMock],
      total: 100,
      totalToday: 10,
      loaded: true,
    });
  });

  it('ignores unsuccessful feedMessage', () => {
    const state = { ...initialState, orders: [orderMock] };

    expect(
      reducer(
        state,
        feedMessage({ success: false, orders: [], total: 0, totalToday: 0 })
      )
    ).toEqual(state);
  });

  it('filters invalid orders from feedMessage', () => {
    expect(
      reducer(
        undefined,
        feedMessage({
          success: true,
          orders: [{ ...orderMock, number: '123' } as never],
          total: 100,
          totalToday: 10,
        })
      ).orders
    ).toEqual([]);
  });

  it('updates existing order after fetchFeedOrderByNumberThunk.fulfilled', () => {
    const updatedOrder = { ...orderMock, name: 'Обновленный заказ' };

    expect(
      reducer(
        { ...initialState, orders: [orderMock] },
        fetchFeedOrderByNumberThunk.fulfilled(updatedOrder, '', orderMock.number)
      ).orders
    ).toEqual([updatedOrder]);
  });

  it('does not add missing order after fetchFeedOrderByNumberThunk.fulfilled', () => {
    expect(
      reducer(
        initialState,
        fetchFeedOrderByNumberThunk.fulfilled(orderMock, '', orderMock.number)
      )
    ).toEqual(initialState);
  });

  it('ignores invalid order after fetchFeedOrderByNumberThunk.fulfilled', () => {
    expect(
      reducer(
        { ...initialState, orders: [orderMock] },
        fetchFeedOrderByNumberThunk.fulfilled(
          { ...orderMock, ingredients: [1] } as never,
          '',
          orderMock.number
        )
      ).orders
    ).toEqual([orderMock]);
  });
});
