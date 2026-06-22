import type { TFeedOrder } from '@utils/types';

const ORDER_STATUSES = ['created', 'pending', 'done'];

export const isValidOrder = (order: TFeedOrder): boolean => {
  return (
    Array.isArray(order.ingredients) &&
    order.ingredients.every((ingredient) => typeof ingredient === 'string') &&
    typeof order._id === 'string' &&
    typeof order.name === 'string' &&
    typeof order.number === 'number' &&
    typeof order.createdAt === 'string' &&
    typeof order.updatedAt === 'string' &&
    ORDER_STATUSES.includes(order.status)
  );
};
