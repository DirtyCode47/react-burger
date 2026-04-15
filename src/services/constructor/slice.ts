import { createSlice, nanoid, createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils/types';

type TConstructorItem = TIngredient & { uuid: string };

type State = {
  bun: TIngredient | null;
  ingredients: TConstructorItem[];
};

const initialState: State = {
  bun: null,
  ingredients: [],
};

const slice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient(state, action: PayloadAction<TIngredient>) {
      const ingredient = action.payload;

      if (ingredient.type === 'bun') {
        state.bun = ingredient;
        return;
      }

      state.ingredients.push({
        ...ingredient,
        uuid: nanoid(),
      });
    },

    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (item) => item.uuid !== action.payload
      );
    },

    moveIngredient(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      const item = state.ingredients.splice(from, 1)[0];
      state.ingredients.splice(to, 0, item);
    },

    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    },
  },
});

export const { addIngredient, removeIngredient, moveIngredient, clearConstructor } =
  slice.actions;

export default slice.reducer;

export const selectConstructor = (state: RootState): State => state.constructorBurger;

export const selectTotalPrice = createSelector(
  [selectConstructor],
  ({ bun, ingredients }) => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce((sum, i) => sum + i.price, 0);
    return bunPrice + ingredientsPrice;
  }
);

export const selectIngredientCounts = createSelector(
  [selectConstructor],
  ({ bun, ingredients }) => {
    const counts: Record<string, number> = {};

    ingredients.forEach((i) => {
      counts[i._id] = (counts[i._id] || 0) + 1;
    });

    if (bun) {
      counts[bun._id] = 2;
    }

    return counts;
  }
);
