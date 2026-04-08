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

import { ConstructorElement, Button } from '@krgaa/react-developer-burger-ui-components';

import type { TConstructorItem } from '@utils/types';

import styles from './burger-constructor.module.css';

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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (item.type === 'bun') {
    return (
      <ConstructorElement
        type="top"
        isLocked
        text={`${item.name} (верх)`}
        price={item.price}
        thumbnail={item.image}
      />
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ConstructorElement
        text={item.name}
        price={item.price}
        thumbnail={item.image}
        handleClose={() => onDelete(item.id)}
        {...listeners}
      />
    </div>
  );
}

export const BurgerConstructor = ({ items, setItems, onOrder }: Props) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const bun = useMemo(() => items.find((i) => i.type === 'bun'), [items]);
  const rest = useMemo(() => items.filter((i) => i.type !== 'bun'), [items]);

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
    <section className={`${styles.burger_constructor} custom-scroll`}>
      {bun && (
        <ConstructorElement
          type="top"
          isLocked
          text={`${bun.name} (верх)`}
          price={bun.price}
          thumbnail={bun.image}
        />
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={rest.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {rest.map((item) => (
            <SortableItem key={item.id} item={item} onDelete={removeItem} />
          ))}
        </SortableContext>
      </DndContext>

      {bun && (
        <ConstructorElement
          type="bottom"
          isLocked
          text={`${bun.name} (низ)`}
          price={bun.price}
          thumbnail={bun.image}
        />
      )}

      <div className={styles.footer}>
        <Button htmlType="button" onClick={onOrder}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};