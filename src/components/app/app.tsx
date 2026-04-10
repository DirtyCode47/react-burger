import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { fetchIngredients } from '@services/api';

import type { TIngredient } from '@utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeIngredient, setActiveIngredient] = useState<TIngredient | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        setLoading(true);
        const data = await fetchIngredients();
        setIngredients(data.data);
      } catch {
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const constructorItems = useMemo(() => {
    if (!ingredients.length) return [];

    const bun = ingredients.find((i) => i.type === 'bun');
    const mains = ingredients.filter((i) => i.type === 'main');
    const sauce = ingredients.find((i) => i.type === 'sauce');

    const result: TIngredient[] = [];

    if (bun) result.push(bun);

    const expandedMains = [...mains, ...mains].slice(0, 9);
    result.push(...expandedMains);

    if (sauce) result.push(sauce);

    return result;
  }, [ingredients]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>

      <main className={`${styles.main} pl-5 pr-5`}>
        {loading && <Preloader />}
        {error && <p className="text text_type_main-default">{error}</p>}

        {!loading && !error && (
          <>
            <BurgerIngredients
              ingredients={ingredients}
              constructorItems={constructorItems}
              onIngredientClick={setActiveIngredient}
            />

            <BurgerConstructor
              items={constructorItems}
              onOrder={() => setOrderModalOpen(true)}
            />
          </>
        )}
      </main>

      {activeIngredient && (
        <Modal title="Детали ингредиента" onClose={() => setActiveIngredient(null)}>
          <IngredientDetails ingredient={activeIngredient} />
        </Modal>
      )}

      {orderModalOpen && (
        <Modal title="" onClose={() => setOrderModalOpen(false)}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default App;
