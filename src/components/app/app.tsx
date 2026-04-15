import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { fetchIngredientsThunk } from '@services/ingredients/thunks';
import { clearIngredient } from '@services/modal/slice';
import { clearOrder } from '@services/order/slice';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector((s) => s.ingredients);
  const activeIngredient = useAppSelector((s) => s.modal.ingredient);
  const orderNumber = useAppSelector((s) => s.order.number);

  useEffect(() => {
    void dispatch(fetchIngredientsThunk());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>

      <main className={`${styles.main} pl-5 pr-5`}>
        {loading && <Preloader />}
        {error && <p>{error}</p>}

        {!loading && !error && (
          <>
            <BurgerIngredients />
            <BurgerConstructor />
          </>
        )}
      </main>

      {activeIngredient && (
        <Modal title="Детали ингредиента" onClose={() => dispatch(clearIngredient())}>
          <IngredientDetails ingredient={activeIngredient} />
        </Modal>
      )}

      {orderNumber && (
        <Modal title="" onClose={() => dispatch(clearOrder())}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};
