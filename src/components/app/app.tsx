import { checkUserAuthThunk } from '@/services/auth/thunks';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo } from 'react';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { OrderInfo } from '@components/order-info/order-info';
import { ProtectedRoute } from '@components/protected-route/protected-route';
import { FeedPage } from '@pages/feed-page/feed-page';
import { ForgotPasswordPage } from '@pages/forgot-password-page/forgot-password-page';
import { Home } from '@pages/home/home';
import { IngredientPage } from '@pages/ingredient-page/ingredient-page';
import { LoginPage } from '@pages/login-page/login-page';
import { NotFoundPage } from '@pages/not-found-page/not-found-page';
import { OrderInfoPage } from '@pages/order-info-page/order-info-page';
import { ProfileForm } from '@pages/profile-form/profile-form';
import { ProfileOrderPage } from '@pages/profile-order-page/profile-order-page';
import { ProfilePage } from '@pages/profile-page/profile-page';
import { RegisterPage } from '@pages/register-page/register-page';
import { ResetPasswordPage } from '@pages/reset-password-page/reset-password-page';
import { clearConstructor } from '@services/constructor/slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { fetchIngredientsThunk } from '@services/ingredients/thunks';
import { clearOrder } from '@services/order/slice';
import { ORDER_MODAL_PATH_KEY } from '@utils/constants';

import type { TFeedOrder } from '@utils/types';
import type { Location } from 'react-router-dom';

import styles from './app.module.css';

type TLocationState = {
  background?: Location;
};

type TOrderModalProps = {
  order?: TFeedOrder;
  onClose: () => void;
};

const getOrderNumberFromPath = (pathname: string): number | null => {
  const value = pathname.split('/').at(-1);
  const number = Number(value);

  return Number.isFinite(number) ? number : null;
};

const createPersistedBackground = (location: Location): Location | null => {
  const orderModalPath = sessionStorage.getItem(ORDER_MODAL_PATH_KEY);

  if (orderModalPath !== location.pathname) {
    return null;
  }

  if (/^\/feed\/\d+$/.test(location.pathname)) {
    return {
      pathname: '/feed',
      search: '',
      hash: '',
      state: null,
      key: 'feed-background',
    };
  }

  if (/^\/profile\/orders\/\d+$/.test(location.pathname)) {
    return {
      pathname: '/profile/orders',
      search: '',
      hash: '',
      state: null,
      key: 'profile-orders-background',
    };
  }

  return null;
};

const OrderModalContent = ({ order, onClose }: TOrderModalProps): React.JSX.Element => {
  const { id = '' } = useParams();

  return (
    <Modal title={id ? `#${id}` : ''} onClose={onClose}>
      <OrderInfo order={order} modal />
    </Modal>
  );
};

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as TLocationState | null;

  const { loading, error } = useAppSelector((s) => s.ingredients);
  const ingredients = useAppSelector((s) => s.ingredients.items);
  const orderNumber = useAppSelector((s) => s.order.number);
  const orderLoading = useAppSelector((s) => s.order.loading);
  const isAuthChecked = useAppSelector((s) => s.auth.isAuthChecked);
  const feedOrders = useAppSelector((s) => s.ordersFeed.orders);
  const profileOrders = useAppSelector((s) => s.profileOrders.orders);

  const persistedBackground = useMemo(
    () => createPersistedBackground(location),
    [location]
  );
  const background = state?.background ?? persistedBackground;
  const ingredientId = background ? location.pathname.split('/').at(-1) : '';
  const activeIngredient = ingredients.find((item) => item._id === ingredientId);
  const orderRouteNumber = getOrderNumberFromPath(location.pathname);
  const activeFeedOrder = feedOrders.find((order) => order.number === orderRouteNumber);
  const activeProfileOrder = profileOrders.find(
    (order) => order.number === orderRouteNumber
  );

  useEffect(() => {
    void dispatch(fetchIngredientsThunk());
    void dispatch(checkUserAuthThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!/^\/(feed|profile\/orders)\/\d+$/.test(location.pathname)) {
      sessionStorage.removeItem(ORDER_MODAL_PATH_KEY);
    }
  }, [location.pathname]);

  const handleCloseIngredient = (): void => {
    void navigate(-1);
  };

  const handleCloseOrder = (): void => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
  };

  const handleCloseOrderInfo = (): void => {
    sessionStorage.removeItem(ORDER_MODAL_PATH_KEY);
    void navigate(-1);
  };

  if (!isAuthChecked) {
    return (
      <div className={styles.app}>
        <Preloader />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background ?? location}>
        <Route path="/" element={<Home loading={loading} error={error} />} />
        <Route path="/ingredients/:id" element={<IngredientPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/feed/:id" element={<OrderInfoPage />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <RegisterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth onlyResetPassword>
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders/:id"
          element={
            <ProtectedRoute>
              <OrderInfoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileForm />} />
          <Route path="orders" element={<ProfileOrderPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {background && activeIngredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseIngredient}>
          <IngredientDetails ingredient={activeIngredient} />
        </Modal>
      )}

      {background && /^\/feed\/\d+$/.test(location.pathname) && (
        <OrderModalContent order={activeFeedOrder} onClose={handleCloseOrderInfo} />
      )}

      {background && /^\/profile\/orders\/\d+$/.test(location.pathname) && (
        <OrderModalContent order={activeProfileOrder} onClose={handleCloseOrderInfo} />
      )}

      {(orderLoading || orderNumber) && (
        <Modal title="" onClose={handleCloseOrder}>
          {orderLoading ? <Preloader /> : <OrderDetails />}
        </Modal>
      )}
    </div>
  );
};
