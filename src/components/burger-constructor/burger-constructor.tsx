import {
  ConstructorElement,
  Button,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useDrop, useDragLayer } from 'react-dnd';
import { useLocation, useNavigate } from 'react-router-dom';

import { selectTotalPrice, addIngredient } from '@services/constructor/slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { createOrderThunk } from '@services/order/thunks';

import { DraggableItem } from './draggable-item/draggable-item';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type DragItem = TIngredient | null;

type DragLayerCollected = {
  isDragging: boolean;
  item: TIngredient | null;
};

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { bun, ingredients } = useAppSelector((s) => s.constructorBurger);
  const totalPrice = useAppSelector(selectTotalPrice);
  const user = useAppSelector((s) => s.auth.user);

  const [, dropRef] = useDrop<TIngredient, void, { isOver: boolean; canDrop: boolean }>({
    accept: 'ingredient',
    drop: (item) => {
      dispatch(addIngredient(item));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const { isDragging, item } = useDragLayer<DragLayerCollected, DragItem>((monitor) => ({
    isDragging: monitor.isDragging(),
    item: monitor.getItem(),
  }));

  const draggingType = item?.type;

  const highlightBun = isDragging && draggingType === 'bun' && !bun;

  const highlightIngredient =
    isDragging && draggingType !== 'bun' && ingredients.length === 0;

  const handleOrder = (): void => {
    if (!bun) return;

    if (!user) {
      void navigate('/login', { state: { from: location } });
      return;
    }

    const ids = [bun._id, ...ingredients.map((i) => i._id), bun._id];

    void dispatch(createOrderThunk(ids));
  };

  const setDropRef = (node: HTMLElement | null): void => {
    dropRef(node);
  };

  return (
    <section
      ref={setDropRef}
      className={styles.burger_constructor}
      data-testid="burger-constructor"
    >
      {bun ? (
        <div className="mb-4 ml-8 mt-1" data-testid="constructor-bun-top">
          <ConstructorElement
            type="top"
            isLocked
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.placeholder} ${styles.placeholder_top} ${
            highlightBun ? styles.active_drop : ''
          } text text_type_main-default mb-4 ml-8 mt-1`}
        >
          Выберите булки
        </div>
      )}

      <div
        className={`${styles.scroll} custom-scroll`}
        data-testid="constructor-ingredients"
      >
        {ingredients.length === 0 && (
          <div
            className={`${styles.placeholder} ${
              highlightIngredient ? styles.active_drop : ''
            } ml-8 mb-1 mt-1 text text_type_main-default`}
          >
            Выберите начинку
          </div>
        )}

        {ingredients.map((item, index) => (
          <DraggableItem key={item.uuid} item={item} index={index} />
        ))}
      </div>

      {bun ? (
        <div className="mt-4 ml-8" data-testid="constructor-bun-bottom">
          <ConstructorElement
            type="bottom"
            isLocked
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.placeholder} ${styles.placeholder_bottom} ${
            highlightBun ? styles.active_drop : ''
          } text text_type_main-default mt-4 ml-8`}
        >
          Выберите булки
        </div>
      )}

      <div className={`${styles.footer} mt-10 mr-8`}>
        <div className={`${styles.price} mr-10`}>
          <p className="text text_type_digits-medium mr-2">{totalPrice}</p>
          <CurrencyIcon type="primary" />
        </div>

        <Button
          htmlType="button"
          type="primary"
          size="large"
          onClick={handleOrder}
          disabled={!bun}
          data-testid="order-button"
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
