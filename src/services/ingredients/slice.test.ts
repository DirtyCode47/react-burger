import { describe, expect, it } from 'vitest';

import { bunMock, mainMock } from '../test-data';
import reducer from './slice';
import { fetchIngredientsThunk } from './thunks';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

describe('ingredients slice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('handles fetchIngredientsThunk.pending', () => {
    expect(reducer(undefined, fetchIngredientsThunk.pending(''))).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('handles fetchIngredientsThunk.fulfilled', () => {
    const items = [bunMock, mainMock];

    expect(
      reducer(
        { ...initialState, loading: true },
        fetchIngredientsThunk.fulfilled(items, '')
      )
    ).toEqual({
      ...initialState,
      items,
    });
  });

  it('handles fetchIngredientsThunk.rejected', () => {
    expect(
      reducer(
        { ...initialState, loading: true },
        fetchIngredientsThunk.rejected(null, '')
      )
    ).toEqual({
      ...initialState,
      error: 'Ошибка загрузки данных',
    });
  });
});
