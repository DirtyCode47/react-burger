import { Button } from '@krgaa/react-developer-burger-ui-components';
import { useNavigate } from 'react-router-dom';

import styles from './not-found-page.module.css';

export const NotFoundPage = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <main className={`${styles.page} pt-30`}>
      <h1 className="text text_type_digits-large mb-6">404</h1>
      <p className="text text_type_main-medium mb-6">Страница не найдена</p>
      <Button
        htmlType="button"
        type="primary"
        size="medium"
        onClick={() => {
          void navigate('/');
        }}
      >
        На главную
      </Button>
    </main>
  );
};
