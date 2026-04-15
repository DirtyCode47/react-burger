import { API_URL } from '@utils/constants';

import type { TIngredientsResponse, TOrderResponse } from '@utils/types';

export const fetchIngredients = async (): Promise<TIngredientsResponse> => {
  const res = await fetch(`${API_URL}/ingredients`);

  if (!res.ok) {
    throw new Error('Ошибка загрузки ингредиентов');
  }

  const data = (await res.json()) as TIngredientsResponse;
  return data;
};

export const createOrder = async (ingredients: string[]): Promise<TOrderResponse> => {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients }),
  });

  if (!res.ok) {
    throw new Error('Ошибка создания заказа');
  }

  const data = (await res.json()) as TOrderResponse;
  return data;
};
