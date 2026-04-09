import { useMemo } from 'react';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

import {
  ConstructorElement,
  Button,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';

import type { TConstructorItem } from '@utils/types';

import styles from './burger-constructor.module.css';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';

type Props = {
  items: TConstructorItem[];
  setItems: React.Dispatch<React.SetStateAction<TConstructorItem[]>>;
  onOrder: () => void;
};

function SortableItem({
  item,
  onDelete,
}: {
  item: TConstructorItem;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.item}
      {...attributes}
      {...listeners}
    >
      <div className={styles.drag}>
        <DragIcon type="primary" />
      </div>

      <ConstructorElement
        text={item.name}
        price={item.price}
        thumbnail={item.image}
        handleClose={() => onDelete(item.id)}
      />
    </div>
  );
}

export const BurgerConstructor = ({ items, setItems, onOrder }: Props) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const bun = useMemo(() => items.find((i) => i.type === 'bun'), [items]);

  const rest = useMemo(() => items.filter((i) => i.type !== 'bun'), [items]);

  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const restPrice = rest.reduce((sum, i) => sum + i.price, 0);
    return bunPrice + restPrice;
  }, [bun, rest]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = rest.findIndex((i) => i.id === active.id);
    const newIndex = rest.findIndex((i) => i.id === over.id);

    setItems((prev) => {
      const buns = prev.filter((i) => i.type === 'bun');
      const nonBuns = prev.filter((i) => i.type !== 'bun');

      const reordered = arrayMove(nonBuns, oldIndex, newIndex);

      return [...reordered, ...buns];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext
            items={rest.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            {rest.map((item) => (
              <SortableItem key={item.id} item={item} onDelete={removeItem} />
            ))}
          </SortableContext>
        </DndContext>
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

      <div className={`${styles.footer} mt-10`}>
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
