import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

import { ORDER_MODAL_PATH_KEY } from '@utils/constants';

import type { TFeedOrder, TIngredient } from '@utils/types';

import styles from './order-card.module.css';

type TOrderCardProps = {
  order: TFeedOrder;
  ingredients: TIngredient[];
  to: string;
  showStatus?: boolean;
};

const getOrderStatusText = (status: TFeedOrder['status']): string => {
  if (status === 'done') return 'Выполнен';
  if (status === 'pending') return 'Готовится';
  return 'Создан';
};

const getOrderIngredients = (
  order: TFeedOrder,
  ingredients: TIngredient[]
): TIngredient[] => {
  return order.ingredients
    .map((ingredientId) =>
      ingredients.find((ingredient) => ingredient._id === ingredientId)
    )
    .filter((ingredient): ingredient is TIngredient => Boolean(ingredient));
};

const getOrderPrice = (order: TFeedOrder, ingredients: TIngredient[]): number => {
  return getOrderIngredients(order, ingredients).reduce(
    (sum, ingredient) => sum + ingredient.price,
    0
  );
};

export const OrderCard = ({
  order,
  ingredients,
  to,
  showStatus = false,
}: TOrderCardProps): React.JSX.Element | null => {
  const location = useLocation();
  const orderIngredients = getOrderIngredients(order, ingredients);

  if (orderIngredients.length === 0) {
    return null;
  }

  const visibleIngredients = orderIngredients.slice(0, 6);
  const hiddenIngredientsCount = orderIngredients.length - visibleIngredients.length;
  const orderPrice = getOrderPrice(order, ingredients);

  const handleClick = (): void => {
    sessionStorage.setItem(ORDER_MODAL_PATH_KEY, to);
  };

  return (
    <Link
      to={to}
      state={{ background: location }}
      className={`${styles.card} p-6 mb-4`}
      onClick={handleClick}
    >
      <div className={`${styles.header} mb-6`}>
        <p className="text text_type_digits-default">#{order.number}</p>
        <FormattedDate
          date={new Date(order.createdAt)}
          className="text text_type_main-default text_color_inactive"
        />
      </div>
      <h2 className="text text_type_main-medium mb-2">{order.name}</h2>
      {showStatus && (
        <p className={`${styles.status} text text_type_main-default mb-6`}>
          {getOrderStatusText(order.status)}
        </p>
      )}
      <div className={styles.footer}>
        <ul className={styles.ingredients}>
          {visibleIngredients.map((ingredient, index) => {
            const isLastVisible = index === visibleIngredients.length - 1;

            return (
              <li
                key={`${ingredient._id}-${index}`}
                className={styles.ingredient}
                style={{ zIndex: visibleIngredients.length - index }}
              >
                <img
                  className={styles.image}
                  src={ingredient.image_mobile}
                  alt={ingredient.name}
                />
                {isLastVisible && hiddenIngredientsCount > 0 && (
                  <span className={`${styles.counter} text text_type_main-default`}>
                    +{hiddenIngredientsCount}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <div className={styles.price}>
          <p className="text text_type_digits-default mr-2">{orderPrice}</p>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </Link>
  );
};
