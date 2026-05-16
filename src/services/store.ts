import { configureStore, combineSlices } from '@reduxjs/toolkit';

import authReducer from './auth/slice';
import constructorReducer from './constructor/slice';
import ingredientsReducer from './ingredients/slice';
import modalReducer from './modal/slice';
import orderReducer from './order/slice';
import passwordResetReducer from './password-reset/slice';

const rootReducer = combineSlices({
  auth: authReducer,
  ingredients: ingredientsReducer,
  constructorBurger: constructorReducer,
  modal: modalReducer,
  order: orderReducer,
  passwordReset: passwordResetReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
