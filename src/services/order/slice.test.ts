import { describe, expect, it } from 'vitest';

import reducer, { clearOrder } from './slice';
import { createOrderThunk } from './thunks';

const initialState = {
  number: null,
  loading: false,
};

describe('order slice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('clears order', () => {
    expect(reducer({ number: 123, loading: false }, clearOrder())).toEqual(initialState);
  });

  it('handles createOrderThunk.pending', () => {
    expect(reducer(undefined, createOrderThunk.pending('', []))).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('handles createOrderThunk.fulfilled', () => {
    expect(
      reducer(
        { ...initialState, loading: true },
        createOrderThunk.fulfilled(123, '', [])
      )
    ).toEqual({
      number: 123,
      loading: false,
    });
  });

  it('handles createOrderThunk.rejected', () => {
    expect(
      reducer(
        { ...initialState, loading: true },
        createOrderThunk.rejected(null, '', [])
      )
    ).toEqual(initialState);
  });
});
