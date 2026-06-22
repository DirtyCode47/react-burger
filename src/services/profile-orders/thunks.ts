import { createAsyncThunk } from '@reduxjs/toolkit';

import { getOrderByNumber } from '@services/api';

import type { TFeedOrder } from '@utils/types';

export const fetchProfileOrderByNumberThunk = createAsyncThunk(
  'profileOrders/fetchByNumber',
  async (number: number): Promise<TFeedOrder> => {
    const data = await getOrderByNumber(String(number));
    const order = data.orders[0];

    if (!order) {
      throw new Error('Заказ не найден');
    }

    return order;
  }
);
