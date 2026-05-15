import { API_URL } from '@utils/constants';

import type {
  TAuthResponse,
  TIngredientsResponse,
  TMessageResponse,
  TOrderResponse,
  TRefreshTokenResponse,
  TUserResponse,
} from '@utils/types';

type TRequestOptions = RequestInit & {
  headers?: HeadersInit;
};

const checkResponse = async <T>(res: Response): Promise<T> => {
  const data = (await res.json()) as T;

  if (!res.ok) {
    throw new Error('Ошибка сервера');
  }

  return data;
};

const request = async <T>(endpoint: string, options?: TRequestOptions): Promise<T> => {
  const res = await fetch(`${API_URL}${endpoint}`, options);
  return await checkResponse<T>(res);
};

export const getAccessToken = (): string => localStorage.getItem('accessToken') ?? '';

export const getRefreshToken = (): string => localStorage.getItem('refreshToken') ?? '';

export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const removeTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

const refreshToken = async (): Promise<TRefreshTokenResponse> => {
  const data = await request<TRefreshTokenResponse>('/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: getRefreshToken() }),
  });

  setTokens(data.accessToken, data.refreshToken);

  return data;
};

export const fetchWithRefresh = async <T>(
  endpoint: string,
  options: TRequestOptions = {}
): Promise<T> => {
  try {
    return await request<T>(endpoint, options);
  } catch (err) {
    if (err instanceof Error) {
      await refreshToken();

      const headers = new Headers(options.headers);
      headers.set('authorization', getAccessToken());

      return await request<T>(endpoint, {
        ...options,
        headers,
      });
    }

    throw new Error('Ошибка сервера');
  }
};

export const fetchIngredients = async (): Promise<TIngredientsResponse> => {
  return await request<TIngredientsResponse>('/ingredients');
};

export const createOrder = async (ingredients: string[]): Promise<TOrderResponse> => {
  return await fetchWithRefresh<TOrderResponse>('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: getAccessToken(),
    },
    body: JSON.stringify({ ingredients }),
  });
};

export const registerUser = async (data: {
  email: string;
  password: string;
  name: string;
}): Promise<TAuthResponse> => {
  return await request<TAuthResponse>('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<TAuthResponse> => {
  return await request<TAuthResponse>('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const logoutUser = async (): Promise<TMessageResponse> => {
  return await request<TMessageResponse>('/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: getRefreshToken() }),
  });
};

export const fetchUser = async (): Promise<TUserResponse> => {
  return await fetchWithRefresh<TUserResponse>('/auth/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: getAccessToken(),
    },
  });
};

export const updateUser = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<TUserResponse> => {
  return await fetchWithRefresh<TUserResponse>('/auth/user', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      authorization: getAccessToken(),
    },
    body: JSON.stringify(data),
  });
};

export const forgotPassword = async (email: string): Promise<TMessageResponse> => {
  return await request<TMessageResponse>('/password-reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = async (data: {
  password: string;
  token: string;
}): Promise<TMessageResponse> => {
  return await request<TMessageResponse>('/password-reset/reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};
