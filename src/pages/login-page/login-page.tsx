import { loginUserThunk } from '@/services/auth/thunks';
import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@services/hooks';

import type { Location } from 'react-router-dom';

import styles from './login-page.module.css';

type TLocationState = {
  from?: Location;
};

export const LoginPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as TLocationState | null;
  const { loading, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    void dispatch(loginUserThunk({ email, password }))
      .unwrap()
      .then(() => {
        void navigate(state?.from?.pathname ?? '/', { replace: true });
      })
      .catch(() => undefined);
  };

  return (
    <main className={`${styles.page} pt-30`}>
      <h1 className="text text_type_main-medium mb-6">Вход</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <EmailInput
          name="email"
          value={email}
          placeholder="E-mail"
          extraClass="mb-6"
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          name="password"
          value={password}
          placeholder="Пароль"
          extraClass="mb-6"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button htmlType="submit" type="primary" size="medium" disabled={loading}>
          Войти
        </Button>
      </form>

      {error && (
        <p className={`${styles.error} text text_type_main-default mt-6`}>{error}</p>
      )}

      <div className={`${styles.links} mt-20`}>
        <p className="text text_type_main-default text_color_inactive">
          Вы — новый пользователь?{' '}
          <Link className={styles.link} to="/register">
            Зарегистрироваться
          </Link>
        </p>
        <p className="text text_type_main-default text_color_inactive">
          Забыли пароль?{' '}
          <Link className={styles.link} to="/forgot-password">
            Восстановить пароль
          </Link>
        </p>
      </div>
    </main>
  );
};
