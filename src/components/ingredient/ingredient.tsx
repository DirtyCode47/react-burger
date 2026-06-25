import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';
import { Link, useLocation } from 'react-router-dom';

import type { TIngredient } from '@utils/types';

import styles from './ingredient.module.css';

type Props = {
  item: TIngredient;
  count: number;
};

export const Ingredient = ({ item, count }: Props): React.JSX.Element => {
  const location = useLocation();
  const [{ isDragging }, dragRef] = useDrag<TIngredient, void, { isDragging: boolean }>({
    type: 'ingredient',
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <li
      ref={(node) => {
        dragRef(node);
      }}
      className={styles.card}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      data-testid={`ingredient-${item._id}`}
    >
      <Link
        className={styles.link}
        to={`/ingredients/${item._id}`}
        state={{ background: location }}
      >
        {count > 0 && (
          <Counter count={count} size="default" extraClass={styles.counter} />
        )}

        <img src={item.image} alt={item.name} className={styles.image} />

        <div className={styles.price}>
          <p className="text text_type_digits-default mr-2">{item.price}</p>
          <CurrencyIcon type="primary" />
        </div>

        <p className={`${styles.name} text text_type_main-default`}>{item.name}</p>
      </Link>
    </li>
  );
};
