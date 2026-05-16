import { forgotPasswordThunk } from '@/services/password-reset/thunks';
import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@services/hooks';

import styles from './forgot-password-page.module.css';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.passwordReset);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    void dispatch(forgotPasswordThunk(email))
      .unwrap()
      .then(() => {
        localStorage.setItem('resetPasswordAllowed', 'true');
        void navigate('/reset-password');
      })
      .catch(() => undefined);
  };

  return (
    <main className={`${styles.page} pt-30`}>
      <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <EmailInput
          name="email"
          value={email}
          placeholder="Укажите e-mail"
          extraClass="mb-6"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button htmlType="submit" type="primary" size="medium" disabled={loading}>
          Восстановить
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
