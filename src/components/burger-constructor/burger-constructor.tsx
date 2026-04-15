import {
  ConstructorElement,
  Button,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useDrop } from 'react-dnd';

import { selectTotalPrice, addIngredient } from '@services/constructor/slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { createOrderThunk } from '@services/order/thunks';

import { DraggableItem } from './draggable-item';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const { bun, ingredients } = useAppSelector((s) => s.constructorBurger);
  const totalPrice = useAppSelector(selectTotalPrice);

  const [{ isOver }, dropRef] = useDrop<TIngredient, void, { isOver: boolean }>({
    accept: 'ingredient',
    drop: (item) => {
      dispatch(addIngredient(item));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleOrder = (): void => {
    if (!bun) return;

    const ids = [bun._id, ...ingredients.map((i) => i._id), bun._id];

    void dispatch(createOrderThunk(ids));
  };

  return (
    <section
      ref={(node) => {
        dropRef(node);
      }}
      className={styles.burger_constructor}
      style={{ outline: isOver ? '2px dashed #4c4cff' : 'none' }}
    >
      {bun ? (
        <div className="mb-4 ml-8">
          <ConstructorElement
            type="top"
            isLocked
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      ) : (
        <div className="mb-4 ml-8">
          <ConstructorElement
            type="top"
            isLocked
            text="Выберите булки"
            price={0}
            thumbnail=""
          />
        </div>
      )}

      <div className={`${styles.scroll} custom-scroll`}>
        {ingredients.length === 0 && (
          <ConstructorElement text="Выберите начинку" price={0} thumbnail="" />
        )}

        {ingredients.map((item, index) => (
          <DraggableItem key={item.uuid} item={item} index={index} />
        ))}
      </div>

      {bun ? (
        <div className="mt-4 ml-8">
          <ConstructorElement
            type="bottom"
            isLocked
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      ) : (
        <div className="mt-4 ml-8">
          <ConstructorElement
            type="bottom"
            isLocked
            text="Выберите булки"
            price={0}
            thumbnail=""
          />
        </div>
      )}

      <div className={`${styles.footer} mt-10 mr-8`}>
        <div className={`${styles.price} mr-10`}>
          <p className="text text_type_digits-medium mr-2">{totalPrice}</p>
          <CurrencyIcon type="primary" />
        </div>

        <Button htmlType="button" type="primary" size="large" onClick={handleOrder}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
