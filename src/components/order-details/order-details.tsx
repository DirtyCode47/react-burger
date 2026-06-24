import { useAppSelector } from '@services/hooks';

import styles from './order-details.module.css';

export const OrderDetails = (): React.JSX.Element => {
  const number = useAppSelector((s) => s.order.number);

  return (
    <div className={styles.container}>
      <p className="text text_type_digits-large mb-8" data-testid="order-number">
        {number}
      </p>

      <p className="text text_type_main-medium mb-15">идентификатор заказа</p>

      <div>
        <img src="../../../public/done.svg" />
      </div>

      <p className="text text_type_main-default mt-15 mb-2">Ваш заказ начали готовить</p>

      <p className="text text_type_main-default text_color_inactive">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};
