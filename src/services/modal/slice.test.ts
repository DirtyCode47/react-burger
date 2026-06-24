import { describe, expect, it } from 'vitest';

import { bunMock } from '../test-data';
import reducer, { clearIngredient, setIngredient } from './slice';

const initialState = {
  ingredient: null,
};

describe('modal slice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('sets ingredient', () => {
    expect(reducer(undefined, setIngredient(bunMock))).toEqual({
      ingredient: bunMock,
    });
  });

  it('clears ingredient', () => {
    expect(reducer({ ingredient: bunMock }, clearIngredient())).toEqual(initialState);
  });
});
