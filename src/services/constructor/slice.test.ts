import { describe, expect, it } from 'vitest';

import { bunMock, mainMock, sauceMock } from '../test-data';
import reducer, {
  addIngredient,
  clearConstructor,
  moveIngredient,
  removeIngredient,
  selectIngredientCounts,
  selectTotalPrice,
} from './slice';

const initialState = {
  bun: null,
  ingredients: [],
};

const mainWithUuid = {
  ...mainMock,
  uuid: 'main-uuid',
};

const sauceWithUuid = {
  ...sauceMock,
  uuid: 'sauce-uuid',
};

describe('constructor slice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('adds bun', () => {
    const state = reducer(undefined, addIngredient(bunMock));

    expect(state.bun).toMatchObject(bunMock);
    expect(state.ingredients).toEqual([]);
  });

  it('replaces bun', () => {
    const firstState = reducer(undefined, addIngredient(bunMock));
    const nextBun = { ...bunMock, _id: 'next-bun-id' };
    const state = reducer(firstState, addIngredient(nextBun));

    expect(state.bun).toMatchObject(nextBun);
  });

  it('adds ingredient with uuid', () => {
    const state = reducer(undefined, addIngredient(mainMock));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(mainMock);
    expect(state.ingredients[0].uuid).toEqual(expect.any(String));
  });

  it('removes ingredient by uuid', () => {
    const state = reducer(
      { bun: bunMock, ingredients: [mainWithUuid, sauceWithUuid] },
      removeIngredient('main-uuid')
    );

    expect(state.ingredients).toEqual([sauceWithUuid]);
  });

  it('moves ingredient', () => {
    const state = reducer(
      { bun: bunMock, ingredients: [mainWithUuid, sauceWithUuid] },
      moveIngredient({ from: 0, to: 1 })
    );

    expect(state.ingredients).toEqual([sauceWithUuid, mainWithUuid]);
  });

  it('clears constructor', () => {
    const state = reducer(
      { bun: bunMock, ingredients: [mainWithUuid] },
      clearConstructor()
    );

    expect(state).toEqual(initialState);
  });

  it('selects total price', () => {
    expect(
      selectTotalPrice({
        constructorBurger: { bun: bunMock, ingredients: [mainWithUuid, sauceWithUuid] },
      } as never)
    ).toBe(bunMock.price * 2 + mainMock.price + sauceMock.price);
  });

  it('selects ingredient counts', () => {
    expect(
      selectIngredientCounts({
        constructorBurger: { bun: bunMock, ingredients: [mainWithUuid, sauceWithUuid] },
      } as never)
    ).toEqual({
      [bunMock._id]: 2,
      [mainMock._id]: 1,
      [sauceMock._id]: 1,
    });
  });
});
