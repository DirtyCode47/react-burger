import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils/types';

type State = {
  ingredient: TIngredient | null;
};

const initialState: State = {
  ingredient: null,
};

const slice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setIngredient(state, action: PayloadAction<TIngredient>) {
      state.ingredient = action.payload;
    },
    clearIngredient(state) {
      state.ingredient = null;
    },
  },
});

export const { setIngredient, clearIngredient } = slice.actions;
export default slice.reducer;
