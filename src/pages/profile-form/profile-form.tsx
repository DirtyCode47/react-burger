import { updateUserThunk } from '@/services/auth/thunks';
import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@services/hooks';

import styles from './profile-form.module.css';

export const ProfileForm = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((s) => s.auth);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setPassword('');
  }, [user]);

  const isChanged =
    name !== (user?.name ?? '') || email !== (user?.email ?? '') || password;

  const handleCancel = (): void => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setPassword('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    void dispatch(updateUserThunk({ name, email, password }));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        name="name"
        value={name}
        type="text"
        placeholder="Имя"
        icon="EditIcon"
        extraClass="mb-6"
        onChange={(e) => setName(e.target.value)}
      />
      <EmailInput
        name="email"
        value={email}
        placeholder="Логин"
        isIcon
        extraClass="mb-6"
        onChange={(e) => setEmail(e.target.value)}
      />
      <PasswordInput
        name="password"
        value={password}
        placeholder="Пароль"
        icon="EditIcon"
        extraClass="mb-6"
        onChange={(e) => setPassword(e.target.value)}
      />

      {isChanged && (
        <div className={styles.buttons}>
          <Button
            htmlType="button"
            //type="secondary"
            size="medium"
            onClick={handleCancel}
          >
            Отмена
          </Button>
          <Button htmlType="submit" type="primary" size="medium" disabled={loading}>
            Сохранить
          </Button>
        </div>
      )}

      {error && (
        <p className={`${styles.error} text text_type_main-default mt-6`}>{error}</p>
      )}
    </form>
  );
};
