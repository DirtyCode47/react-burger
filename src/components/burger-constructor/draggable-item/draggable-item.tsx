import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { moveIngredient, removeIngredient } from '@services/constructor/slice';
import { useAppDispatch } from '@services/hooks';

import type { TIngredient } from '@utils/types';

import styles from './draggable-item.module.css';

type Props = {
  item: TIngredient & { uuid: string };
  index: number;
};

type DragItem = {
  index: number;
};

export const DraggableItem = ({ item, index }: Props): React.JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const [, drag] = useDrag<DragItem>({
    type: 'constructor',
    item: { index },
  });

  const [, drop] = useDrop<DragItem>({
    accept: 'constructor',
    hover: (dragged) => {
      if (dragged.index === index) return;

      dispatch(moveIngredient({ from: dragged.index, to: index }));
      dragged.index = index;
    },
  });

  drag(drop(ref));

  return (
    <div ref={ref} className={styles.item}>
      <div className={styles.drag}>
        <DragIcon type="primary" />
      </div>

      <ConstructorElement
        text={item.name}
        price={item.price}
        thumbnail={item.image}
        handleClose={() => dispatch(removeIngredient(item.uuid))}
      />
    </div>
  );
};
