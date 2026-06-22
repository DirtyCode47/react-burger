import { useEffect } from 'react';

import { OrderCard } from '@components/order-card/order-card';
import { getAccessToken } from '@services/api';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
  profileOrdersConnect,
  profileOrdersDisconnect,
} from '@services/profile-orders/slice';
import { PENDING_ORDER_RECONNECT_DELAY, WS_PROFILE_ORDERS_URL } from '@utils/constants';

import styles from './profile-order-page.module.css';

const getTokenValue = (): string => getAccessToken().replace('Bearer ', '');

export const ProfileOrderPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector((state) => state.ingredients.items);
  const orders = useAppSelector((state) => state.profileOrders.orders);

  useEffect(() => {
    dispatch(profileOrdersConnect(`${WS_PROFILE_ORDERS_URL}?token=${getTokenValue()}`));

    return (): void => {
      dispatch(profileOrdersDisconnect());
    };
  }, [dispatch]);

  const pendingOrdersKey = orders
    .filter((order) => order.status === 'pending')
    .map((order) => `${order.number}-${order.updatedAt}`)
    .join('|');

  useEffect(() => {
    if (!pendingOrdersKey) {
      return undefined;
    }

    let connectTimeout: ReturnType<typeof setTimeout> | null = null;

    const reconnectTimeout = setTimeout(() => {
      dispatch(profileOrdersDisconnect());

      connectTimeout = setTimeout(() => {
        dispatch(
          profileOrdersConnect(`${WS_PROFILE_ORDERS_URL}?token=${getTokenValue()}`)
        );
      }, 0);
    }, PENDING_ORDER_RECONNECT_DELAY);

    return (): void => {
      clearTimeout(reconnectTimeout);

      if (connectTimeout) {
        clearTimeout(connectTimeout);
      }
    };
  }, [dispatch, pendingOrdersKey]);

  return (
    <section className={`${styles.container} custom-scroll pr-2`}>
      {[...orders]
        .sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            ingredients={ingredients}
            to={`/profile/orders/${order.number}`}
            showStatus
          />
        ))}
    </section>
  );
};
