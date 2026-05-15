import styles from './profile-order-page.module.css';

export const ProfileOrderPage = (): React.JSX.Element => {
  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-medium mb-6">История заказов</h1>
      <p className="text text_type_main-default text_color_inactive">
        Страница находится в разработке
      </p>
    </div>
  );
};
