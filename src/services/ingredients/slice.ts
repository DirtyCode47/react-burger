import { createSlice } from '@reduxjs/toolkit';

import { fetchIngredientsThunk } from './thunks';

import type { TIngredient } from '@utils/types';

type State = {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: State = {
  items: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredientsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredientsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredientsThunk.rejected, (state) => {
        state.loading = false;
        state.error = 'Ошибка загрузки данных';
      });
  },
});

export default slice.reducer;
