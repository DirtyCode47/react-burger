import {
  ConstructorElement,
  Button,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type Props = {
  items: TIngredient[];
  onOrder: () => void;
};

export const BurgerConstructor = ({ items, onOrder }: Props): React.JSX.Element => {
  const bun = useMemo(() => items.find((i) => i.type === 'bun'), [items]);
  const rest = useMemo(() => items.filter((i) => i.type !== 'bun'), [items]);

  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const restPrice = rest.reduce((sum, i) => sum + i.price, 0);
    return bunPrice + restPrice;
  }, [bun, rest]);

  return (
    <section className={styles.burger_constructor}>
      {bun && (
        <div className="mb-4 ml-8">
          <ConstructorElement
            type="top"
            isLocked
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      )}

      <div className={`${styles.scroll} custom-scroll`}>
        {rest.map((item) => (
          <div key={item._id} className={styles.item}>
            <div className={styles.drag}>
              <DragIcon type="primary" />
            </div>

            <ConstructorElement
              text={item.name}
              price={item.price}
              thumbnail={item.image}
            />
          </div>
        ))}
      </div>

      {bun && (
        <div className="mt-4 ml-8">
          <ConstructorElement
            type="bottom"
            isLocked
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      )}

      <div className={`${styles.footer} mt-10 mr-8`}>
        <div className={`${styles.price} mr-10`}>
          <p className="text text_type_digits-medium mr-2">{totalPrice}</p>
          <CurrencyIcon type="primary" />
        </div>

        <Button htmlType="button" type="primary" size="large" onClick={onOrder}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
