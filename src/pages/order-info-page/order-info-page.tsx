import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderInfo } from '@components/order-info/order-info';
import { getAccessToken } from '@services/api';
import { useAppDispatch } from '@services/hooks';
import { feedActions } from '@services/orders-feed/slice';
import { profileOrdersActions } from '@services/profile-orders/slice';
import { WS_FEED_URL, WS_PROFILE_ORDERS_URL } from '@utils/constants';

const getTokenValue = (): string => getAccessToken().replace('Bearer ', '');

export const OrderInfoPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    if (/^\/feed\/\d+$/.test(location.pathname)) {
      dispatch(feedActions.connect(WS_FEED_URL));

      return (): void => {
        dispatch(feedActions.disconnect());
      };
    }

    if (/^\/profile\/orders\/\d+$/.test(location.pathname)) {
      dispatch(
        profileOrdersActions.connect(`${WS_PROFILE_ORDERS_URL}?token=${getTokenValue()}`)
      );

      return (): void => {
        dispatch(profileOrdersActions.disconnect());
      };
    }

    return undefined;
  }, [dispatch, location.pathname]);

  return <OrderInfo centered />;
};
