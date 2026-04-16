import { createAsyncThunk } from '@reduxjs/toolkit';

import { fetchIngredients } from '@services/api';

export const fetchIngredientsThunk = createAsyncThunk('ingredients/fetch', async () => {
  const res = await fetchIngredients();
  return res.data;
});
