import { configureStore, combineSlices } from '@reduxjs/toolkit';

import authReducer from './auth/slice';
import constructorReducer from './constructor/slice';
import ingredientsReducer from './ingredients/slice';
import modalReducer from './modal/slice';
import orderInfoReducer from './order-info/slice';
import orderReducer from './order/slice';
import ordersFeedReducer, { feedActions } from './orders-feed/slice';
import passwordResetReducer from './password-reset/slice';
import profileOrdersReducer, { profileOrdersActions } from './profile-orders/slice';
import { createSocketMiddleware } from './socket/middleware';

const rootReducer = combineSlices({
  auth: authReducer,
  ingredients: ingredientsReducer,
  constructorBurger: constructorReducer,
  modal: modalReducer,
  order: orderReducer,
  orderInfo: orderInfoReducer,
  ordersFeed: ordersFeedReducer,
  passwordReset: passwordResetReducer,
  profileOrders: profileOrdersReducer,
});

const feedMiddleware = createSocketMiddleware(feedActions);
const profileOrdersMiddleware = createSocketMiddleware(profileOrdersActions, {
  withTokenRefresh: true,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedMiddleware, profileOrdersMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
