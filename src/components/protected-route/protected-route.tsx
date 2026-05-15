import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from '@services/hooks';

import type { Location } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
  onlyUnAuth?: boolean;
  onlyResetPassword?: boolean;
};

type TLocationState = {
  from?: Location;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
  onlyResetPassword = false,
}: Props): React.JSX.Element => {
  const location = useLocation();
  const user = useAppSelector((s) => s.auth.user);
  const state = location.state as TLocationState | null;
  const from = state?.from;
  const isResetPasswordAllowed = localStorage.getItem('resetPasswordAllowed') === 'true';

  if (onlyResetPassword && !isResetPasswordAllowed) {
    return <Navigate to="/forgot-password" replace />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to={from?.pathname ?? '/'} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
