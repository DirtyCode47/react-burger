import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '@utils/constants';

import type { TOrderResponse } from '../../utils/types';

export const createOrderThunk = createAsyncThunk(
  'order/create',
  async (ingredients: string[]): Promise<number> => {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients }),
    });

    if (!res.ok) {
      throw new Error('Ошибка создания заказа');
    }

    const data = (await res.json()) as TOrderResponse;

    return data.order.number;
  }
);
