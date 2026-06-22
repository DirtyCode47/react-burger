import {
  CurrencyIcon,
  FormattedDate,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import { clearOrderInfo } from '@services/order-info/slice';
import { fetchOrderByNumberThunk } from '@services/order-info/thunks';

import type { TFeedOrder, TIngredient } from '@utils/types';

import styles from './order-info.module.css';

type TOrderInfoProps = {
  order?: TFeedOrder;
  centered?: boolean;
  modal?: boolean;
};

type TOrderIngredient = TIngredient & {
  count: number;
};

const getOrderStatusText = (status: TFeedOrder['status']): string => {
  if (status === 'done') return 'Выполнен';
  if (status === 'pending') return 'Готовится';
  return 'Создан';
};

const getOrderIngredients = (
  order: TFeedOrder,
  ingredients: TIngredient[]
): TOrderIngredient[] => {
  return order.ingredients.reduce<TOrderIngredient[]>((acc, ingredientId) => {
    const ingredient = ingredients.find((item) => item._id === ingredientId);

    if (!ingredient) {
      return acc;
    }

    const existingIngredient = acc.find((item) => item._id === ingredientId);

    if (existingIngredient) {
      existingIngredient.count += 1;
      return acc;
    }

    acc.push({ ...ingredient, count: 1 });
    return acc;
  }, []);
};

const getOrderPrice = (ingredients: TOrderIngredient[]): number => {
  return ingredients.reduce(
    (sum, ingredient) => sum + ingredient.price * ingredient.count,
    0
  );
};

export const OrderInfo = ({
  order,
  centered = false,
  modal = false,
}: TOrderInfoProps): React.JSX.Element => {
  const { id = '' } = useParams();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector((state) => state.ingredients.items);
  const orderInfo = useAppSelector((state) => state.orderInfo.order);
  const feedOrders = useAppSelector((state) => state.ordersFeed.orders);
  const feedLoaded = useAppSelector((state) => state.ordersFeed.loaded);
  const profileOrders = useAppSelector((state) => state.profileOrders.orders);
  const profileOrdersLoaded = useAppSelector((state) => state.profileOrders.loaded);
  const loading = useAppSelector((state) => state.orderInfo.loading);
  const error = useAppSelector((state) => state.orderInfo.error);

  const orderNumber = Number(id);
  const feedOrder = feedOrders.find((item) => item.number === orderNumber);
  const profileOrder = profileOrders.find((item) => item.number === orderNumber);
  const fetchedOrder = orderInfo?.number === orderNumber ? orderInfo : null;
  const currentOrder = order ?? feedOrder ?? profileOrder ?? fetchedOrder;
  const isFeedOrderPage = /^\/feed\/\d+$/.test(location.pathname);
  const isProfileOrderPage = /^\/profile\/orders\/\d+$/.test(location.pathname);
  const isWaitingForFeedOrder = isFeedOrderPage && !feedLoaded && !feedOrder;
  const isWaitingForProfileOrder =
    isProfileOrderPage && !profileOrdersLoaded && !profileOrder;
  const isWaitingForSocketOrder = isWaitingForFeedOrder || isWaitingForProfileOrder;

  useEffect(() => {
    if (!order && id && !currentOrder && !isWaitingForSocketOrder) {
      void dispatch(fetchOrderByNumberThunk(id));
    }

    return (): void => {
      if (!order) {
        dispatch(clearOrderInfo());
      }
    };
  }, [currentOrder, dispatch, id, isWaitingForSocketOrder, order]);

  if (loading || isWaitingForSocketOrder || (!currentOrder && id && !error)) {
    return <Preloader />;
  }

  if (error && !currentOrder) {
    return <p className="text text_type_main-default text_color_inactive">{error}</p>;
  }

  if (!currentOrder) {
    return (
      <p className="text text_type_main-default text_color_inactive">Заказ не найден</p>
    );
  }

  const orderIngredients = getOrderIngredients(currentOrder, ingredients);
  const orderPrice = getOrderPrice(orderIngredients);

  return (
    <section
      className={`${styles.container} ${centered ? styles.centered : ''} ${
        modal ? styles.modal : ''
      }`}
    >
      <p className={`${styles.number} text text_type_digits-default mb-10`}>
        #{currentOrder.number}
      </p>
      <h1 className="text text_type_main-medium mb-3">{currentOrder.name}</h1>
      <p className={`${styles.status} text text_type_main-default mb-15`}>
        {getOrderStatusText(currentOrder.status)}
      </p>
      <h2 className="text text_type_main-medium mb-6">Состав:</h2>
      <ul className={`${styles.list} custom-scroll pr-6 mb-10`}>
        {orderIngredients.map((ingredient) => (
          <li key={ingredient._id} className={`${styles.item} mb-4`}>
            <div className={styles.imageWrapper}>
              <img
                className={styles.image}
                src={ingredient.image_mobile}
                alt={ingredient.name}
              />
            </div>
            <p className={`${styles.name} text text_type_main-default`}>
              {ingredient.name}
            </p>
            <div className={styles.price}>
              <p className="text text_type_digits-default mr-2">
                {ingredient.count} x {ingredient.price}
              </p>
              <CurrencyIcon type="primary" />
            </div>
          </li>
        ))}
      </ul>
      <div className={styles.footer}>
        <FormattedDate
          date={new Date(currentOrder.createdAt)}
          className="text text_type_main-default text_color_inactive"
        />
        <div className={styles.price}>
          <p className="text text_type_digits-default mr-2">{orderPrice}</p>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </section>
  );
};
