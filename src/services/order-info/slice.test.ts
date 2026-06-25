import { describe, expect, it } from 'vitest';

import { orderMock } from '../test-data';
import reducer, { clearOrderInfo } from './slice';
import { fetchOrderByNumberThunk } from './thunks';

const initialState = {
  order: null,
  loading: false,
  error: null,
};

describe('order-info slice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('clears order info', () => {
    expect(
      reducer({ order: orderMock, loading: true, error: 'error' }, clearOrderInfo())
    ).toEqual(initialState);
  });

  it('handles fetchOrderByNumberThunk.pending', () => {
    expect(reducer(undefined, fetchOrderByNumberThunk.pending('', '123'))).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('handles fetchOrderByNumberThunk.fulfilled', () => {
    expect(
      reducer(
        { ...initialState, loading: true },
        fetchOrderByNumberThunk.fulfilled(orderMock, '', '123')
      )
    ).toEqual({
      ...initialState,
      order: orderMock,
    });
  });

  it('handles fetchOrderByNumberThunk.rejected', () => {
    expect(
      reducer(
        { ...initialState, loading: true },
        fetchOrderByNumberThunk.rejected(null, '', '123')
      )
    ).toEqual({
      ...initialState,
      error: 'Ошибка загрузки заказа',
    });
  });
});
