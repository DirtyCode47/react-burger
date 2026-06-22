import { useEffect } from 'react';

import { OrderCard } from '@components/order-card/order-card';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { feedConnect, feedDisconnect } from '@services/orders-feed/slice';
import { PENDING_ORDER_RECONNECT_DELAY, WS_FEED_URL } from '@utils/constants';

import styles from './feed-page.module.css';

const getOrderColumns = (numbers: number[]): number[][] => {
  return [numbers.slice(0, 10), numbers.slice(10, 20)].filter(
    (column) => column.length > 0
  );
};

export const FeedPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector((state) => state.ingredients.items);
  const { orders, total, totalToday } = useAppSelector((state) => state.ordersFeed);

  useEffect(() => {
    dispatch(feedConnect(WS_FEED_URL));

    return (): void => {
      dispatch(feedDisconnect());
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
      dispatch(feedDisconnect());

      connectTimeout = setTimeout(() => {
        dispatch(feedConnect(WS_FEED_URL));
      }, 0);
    }, PENDING_ORDER_RECONNECT_DELAY);

    return (): void => {
      clearTimeout(reconnectTimeout);

      if (connectTimeout) {
        clearTimeout(connectTimeout);
      }
    };
  }, [dispatch, pendingOrdersKey]);

  const doneOrderNumbers = orders
    .filter((order) => order.status === 'done')
    .map((order) => order.number);
  const pendingOrderNumbers = orders
    .filter((order) => order.status === 'pending')
    .map((order) => order.number);

  return (
    <main className={`${styles.page} pt-10`}>
      <h1 className="text text_type_main-large mb-5">Лента заказов</h1>
      <div className={styles.content}>
        <section className={`${styles.orders} custom-scroll pr-2`}>
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              ingredients={ingredients}
              to={`/feed/${order.number}`}
            />
          ))}
        </section>
        <section className={styles.info}>
          <div className={`${styles.statuses} mb-15`}>
            <div>
              <h2 className="text text_type_main-medium mb-6">Готовы:</h2>
              <div className={styles.statusColumns}>
                {getOrderColumns(doneOrderNumbers).map((column, columnIndex) => (
                  <ul key={columnIndex} className={styles.statusList}>
                    {column.map((number) => (
                      <li
                        key={number}
                        className={`${styles.ready} text text_type_digits-default mb-2`}
                      >
                        {number}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text text_type_main-medium mb-6">В работе:</h2>
              <div className={styles.statusColumns}>
                {getOrderColumns(pendingOrderNumbers).map((column, columnIndex) => (
                  <ul key={columnIndex} className={styles.statusList}>
                    {column.map((number) => (
                      <li key={number} className="text text_type_digits-default mb-2">
                        {number}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-15">
            <h2 className="text text_type_main-medium">Выполнено за все время:</h2>
            <p className={`${styles.total} text text_type_digits-large`}>{total}</p>
          </div>
          <div>
            <h2 className="text text_type_main-medium">Выполнено за сегодня:</h2>
            <p className={`${styles.total} text text_type_digits-large`}>{totalToday}</p>
          </div>
        </section>
      </div>
    </main>
  );
};
