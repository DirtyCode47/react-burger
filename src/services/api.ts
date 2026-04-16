import { API_URL } from '@utils/constants';

import type { TIngredientsResponse, TOrderResponse } from '@utils/types';

const checkResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    throw new Error('Ошибка сервера');
  }

  const data = (await res.json()) as T;
  return data;
};

export const fetchIngredients = async (): Promise<TIngredientsResponse> => {
  const res = await fetch(`${API_URL}/ingredients`);
  return await checkResponse<TIngredientsResponse>(res);
};

export const createOrder = async (ingredients: string[]): Promise<TOrderResponse> => {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients }),
  });

  return await checkResponse<TOrderResponse>(res);
};
