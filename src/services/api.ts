import { API_URL } from '@utils/constants';

import type { TIngredientsResponse } from '@/utils/types';

export const fetchIngredients = async (): Promise<TIngredientsResponse> => {
  const res = await fetch(`${API_URL}/ingredients`);

  if (!res.ok) {
    throw new Error('Ошибка загрузки ингредиентов');
  }

  const data = (await res.json()) as TIngredientsResponse;
  return data;
};
