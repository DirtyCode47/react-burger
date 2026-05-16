import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { useAppSelector } from '@services/hooks';

import styles from './ingredient-page.module.css';

export const IngredientPage = (): React.JSX.Element => {
  const { id } = useParams();
  const { items, loading, error } = useAppSelector((s) => s.ingredients);
  const ingredient = items.find((item) => item._id === id);

  if (loading) {
    return (
      <main className={styles.page}>
        <Preloader />
      </main>
    );
  }

  if (error || !ingredient) {
    return (
      <main className={styles.page}>
        <p className="text text_type_main-medium">Ингредиент не найден</p>
      </main>
    );
  }

  return (
    <main className={`${styles.page} pt-30`}>
      <h1 className="text text_type_main-large mb-6">Детали ингредиента</h1>
      <IngredientDetails ingredient={ingredient} />
    </main>
  );
};
