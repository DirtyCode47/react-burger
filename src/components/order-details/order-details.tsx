import styles from './order-details.module.css';

import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

export const OrderDetails = () => {
  return (
    <div className={styles.container}>
      <p className="text text_type_digits-large mb-8">12345</p>

      <p className="text text_type_main-medium mb-15">идентификатор заказа</p>

      <div className={styles.icon}>
        <CheckMarkIcon type="primary" />
      </div>

      <p className="text text_type_main-default mt-15 mb-2">Ваш заказ начали готовить</p>

      <p className="text text_type_main-default text_color_inactive">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};
