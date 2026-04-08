import { useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { Modal } from '@components/modal/modal';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { OrderDetails } from '@components/order-details/order-details';

import { fetchIngredients } from '@services/api';

import type { TIngredient, TConstructorItem } from '@utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [constructorItems, setConstructorItems] = useState<TConstructorItem[]>([]);

  const [activeIngredient, setActiveIngredient] = useState<TIngredient | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchIngredients();
        setIngredients(data.data);
      } catch (e) {
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const addIngredient = (item: TIngredient) => {
    const id = crypto.randomUUID();

    setConstructorItems((prev) => [...prev, { ...item, id }]);
  };

  const addBun = (bun: TIngredient) => {
    if (bun.type !== 'bun') return;

    setConstructorItems((prev) => {
      const filtered = prev.filter((i) => i.type !== 'bun');

      const existingBun = prev.find((i) => i.type === 'bun');

      if (existingBun && existingBun._id === bun._id) {
        return prev;
      }

      return [...filtered, { ...bun, id: crypto.randomUUID() }];
    });
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>

      <main className={`${styles.main} pl-5 pr-5`}>
        {loading && <p className="text text_type_main-default">Загрузка...</p>}

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
              setItems={setConstructorItems}
              onOrder={() => setOrderModalOpen(true)}
            />
          </>
        )}
      </main>

      {activeIngredient && (
        <Modal title="Детали ингредиента" onClose={() => setActiveIngredient(null)}>
          <IngredientDetails
            ingredient={activeIngredient}
            onAdd={(item) => {
              if (item.type === 'bun') {
                addBun(item);
              } else {
                addIngredient(item);
              }

              setActiveIngredient(null);
            }}
          />
        </Modal>
      )}

      {orderModalOpen && (
        <Modal title="Заказ оформлен" onClose={() => setOrderModalOpen(false)}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default App;
