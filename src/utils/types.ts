export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TUser = {
  email: string;
  name: string;
};

export type TOrderStatus = 'created' | 'pending' | 'done';

export type TFeedOrder = {
  ingredients: string[];
  _id: string;
  status: TOrderStatus;
  name: string;
  number: number;
  createdAt: string;
  updatedAt: string;
};

export type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

export type TOrderResponse = {
  success: boolean;
  order: {
    number: number;
  };
};

export type TOrdersResponse = {
  success: boolean;
  orders: TFeedOrder[];
  total: number;
  totalToday: number;
};

export type TAuthResponse = {
  success: boolean;
  user: TUser;
  accessToken: string;
  refreshToken: string;
};

export type TRefreshTokenResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export type TUserResponse = {
  success: boolean;
  user: TUser;
};

export type TMessageResponse = {
  success: boolean;
  message: string;
};
