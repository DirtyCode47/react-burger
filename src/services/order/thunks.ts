import { createAsyncThunk } from '@reduxjs/toolkit';

import { createOrder } from '@services/api';

export const createOrderThunk = createAsyncThunk(
  'order/create',
  async (ingredients: string[]): Promise<number> => {
    const data = await createOrder(ingredients);

    return data.order.number;
  }
);
