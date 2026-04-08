import { Button } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types';

import styles from './ingredient-details.module.css';

type Props = {
  ingredient: TIngredient;
  onAdd: (i: TIngredient) => void;
};

export const IngredientDetails = ({ ingredient, onAdd }: Props) => {
  return (
    <div className={styles.container}>
      <img src={ingredient.image_large} alt={ingredient.name} className={styles.image} />

      <p className="text text_type_main-medium mt-4 mb-8">{ingredient.name}</p>

      <ul className={styles.nutrients}>
        <li>
          <p className="text text_type_main-default text_color_inactive">Калории</p>
          <p className="text text_type_digits-default">{ingredient.calories}</p>
        </li>
        <li>
          <p className="text text_type_main-default text_color_inactive">Белки</p>
          <p className="text text_type_digits-default">{ingredient.proteins}</p>
        </li>
        <li>
          <p className="text text_type_main-default text_color_inactive">Жиры</p>
          <p className="text text_type_digits-default">{ingredient.fat}</p>
        </li>
        <li>
          <p className="text text_type_main-default text_color_inactive">Углеводы</p>
          <p className="text text_type_digits-default">{ingredient.carbohydrates}</p>
        </li>
      </ul>

      <Button
        htmlType="button"
        type="primary"
        size="large"
        extraClass="mt-10"
        onClick={() => onAdd(ingredient)}
      >
        Добавить в заказ
      </Button>
    </div>
  );
};
