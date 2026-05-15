import { logoutUserThunk } from '@/services/auth/thunks';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@services/hooks';

import styles from './profile-page.module.css';

const getLinkClassName = ({ isActive }: { isActive: boolean }): string =>
  `${styles.link} ${isActive ? styles.linkActive : ''} text text_type_main-medium`;

export const ProfilePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    void dispatch(logoutUserThunk())
      .unwrap()
      .then(() => {
        void navigate('/login', { replace: true });
      })
      .catch(() => undefined);
  };

  return (
    <main className={`${styles.page} pt-30`}>
      <aside className={styles.menu}>
        <nav>
          <NavLink end to="/profile" className={getLinkClassName}>
            Профиль
          </NavLink>
          <NavLink to="/profile/orders" className={getLinkClassName}>
            История заказов
          </NavLink>
          <button
            className={`${styles.button} text text_type_main-medium`}
            type="button"
            onClick={handleLogout}
          >
            Выход
          </button>
        </nav>
        <p className="text text_type_main-default text_color_inactive mt-20">
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </aside>

      <section className={styles.content}>
        <Outlet />
      </section>
    </main>
  );
};
