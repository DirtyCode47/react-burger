import styles from './feed-page.module.css';

export const FeedPage = (): React.JSX.Element => {
  return (
    <main className={`${styles.page} pt-30`}>
      <h1 className="text text_type_main-large mb-6">Лента заказов</h1>
      <p className="text text_type_main-default text_color_inactive">
        Страница находится в разработке
      </p>
    </main>
  );
};
