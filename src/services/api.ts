import { API_URL } from '@utils/constants';

export const fetchIngredients = async () => {
  const res = await fetch(`${API_URL}/ingredients`);

  if (!res.ok) {
    throw new Error('Ошибка загрузки ингредиентов');
  }

  return res.json();
};
