import { registerUserThunk } from '@/services/auth/thunks';
import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@services/hooks';

import styles from './register-page.module.css';

export const RegisterPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    void dispatch(registerUserThunk({ name, email, password }));
  };

  return (
    <main className={`${styles.page} pt-30`}>
      <h1 className="text text_type_main-medium mb-6">Регистрация</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          name="name"
          value={name}
          type="text"
          placeholder="Имя"
          extraClass="mb-6"
          onChange={(e) => setName(e.target.value)}
        />
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
          Зарегистрироваться
        </Button>
      </form>

      {error && (
        <p className={`${styles.error} text text_type_main-default mt-6`}>{error}</p>
      )}

      <p className="text text_type_main-default text_color_inactive mt-20">
        Уже зарегистрированы?{' '}
        <Link className={styles.link} to="/login">
          Войти
        </Link>
      </p>
    </main>
  );
};
