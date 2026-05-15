import { resetPasswordThunk } from '@/services/password-reset/thunks';
import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@services/hooks';

import styles from './reset-password-page.module.css';

export const ResetPasswordPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.passwordReset);

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    if (localStorage.getItem('resetPasswordAllowed') !== 'true') {
      void navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    void dispatch(resetPasswordThunk({ password, token }))
      .unwrap()
      .then(() => {
        localStorage.removeItem('resetPasswordAllowed');
        void navigate('/login', { replace: true });
      })
      .catch(() => undefined);
  };

  return (
    <main className={`${styles.page} pt-30`}>
      <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <PasswordInput
          name="password"
          value={password}
          placeholder="Введите новый пароль"
          extraClass="mb-6"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          name="token"
          value={token}
          type="text"
          placeholder="Введите код из письма"
          extraClass="mb-6"
          onChange={(e) => setToken(e.target.value)}
        />
        <Button htmlType="submit" type="primary" size="medium" disabled={loading}>
          Сохранить
        </Button>
      </form>

      {error && (
        <p className={`${styles.error} text text_type_main-default mt-6`}>{error}</p>
      )}

      <p className="text text_type_main-default text_color_inactive mt-20">
        Вспомнили пароль?{' '}
        <Link className={styles.link} to="/login">
          Войти
        </Link>
      </p>
    </main>
  );
};
