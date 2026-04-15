import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';

import type { TIngredient } from '@utils/types';

import styles from './ingredient.module.css';

type Props = {
  item: TIngredient;
  count: number;
  onClick: () => void;
};

export const Ingredient = ({ item, count, onClick }: Props): React.JSX.Element => {
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
      onClick={onClick}
    >
      {count > 0 && <Counter count={count} size="default" extraClass={styles.counter} />}

      <img src={item.image} alt={item.name} className={styles.image} />

      <div className={styles.price}>
        <p className="text text_type_digits-default mr-2">{item.price}</p>
        <CurrencyIcon type="primary" />
      </div>

      <p className={`${styles.name} text text_type_main-default`}>{item.name}</p>
    </li>
  );
};
