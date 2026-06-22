import { createAsyncThunk } from '@reduxjs/toolkit';

import { getOrderByNumber } from '@services/api';

import type { TFeedOrder } from '@utils/types';

export const fetchOrderByNumberThunk = createAsyncThunk(
  'orderInfo/fetchByNumber',
  async (number: string): Promise<TFeedOrder> => {
    const data = await getOrderByNumber(number);
    const order = data.orders[0];

    if (!order) {
      throw new Error('Заказ не найден');
    }

    return order;
  }
);
