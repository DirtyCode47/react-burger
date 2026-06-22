import { getAccessToken, refreshToken } from '@services/api';

import type {
  ActionCreatorWithPayload,
  ActionCreatorWithoutPayload,
  Dispatch,
  Middleware,
  UnknownAction,
} from '@reduxjs/toolkit';

export type TSocketActions<TData> = {
  connect: ActionCreatorWithPayload<string>;
  disconnect: ActionCreatorWithoutPayload;
  connecting: ActionCreatorWithoutPayload;
  open: ActionCreatorWithoutPayload;
  close: ActionCreatorWithoutPayload;
  error: ActionCreatorWithPayload<string>;
  message: ActionCreatorWithPayload<TData>;
};

type TSocketMiddlewareOptions = {
  withTokenRefresh?: boolean;
};

type TSocketError = {
  success: false;
  message: string;
};

const INVALID_TOKEN_MESSAGE = 'Invalid or missing token';
const RECONNECT_DELAY = 3000;

const isSocketError = (data: unknown): data is TSocketError => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    'message' in data &&
    data.success === false &&
    typeof data.message === 'string'
  );
};

const getTokenValue = (): string => getAccessToken().replace('Bearer ', '');

const getProfileOrdersUrl = (url: string): string => {
  return `${url.split('?')[0]}?token=${getTokenValue()}`;
};

export const createSocketMiddleware = <TData>(
  actions: TSocketActions<TData>,
  options: TSocketMiddlewareOptions = {}
): Middleware<object, unknown, Dispatch<UnknownAction>> => {
  return (store) => {
    let socket: WebSocket | null = null;
    let connectUrl = '';
    let reconnectTimeout: number | null = null;
    let wasClosedByUser = false;

    const clearReconnectTimeout = (): void => {
      if (reconnectTimeout !== null) {
        window.clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
    };

    const reconnect = (): void => {
      clearReconnectTimeout();

      if (!connectUrl || wasClosedByUser) {
        return;
      }

      reconnectTimeout = window.setTimeout(() => {
        store.dispatch(actions.connect(connectUrl));
      }, RECONNECT_DELAY);
    };

    return (next) =>
      (action): unknown => {
        if (actions.connect.match(action)) {
          connectUrl = action.payload;
          wasClosedByUser = false;
          clearReconnectTimeout();

          if (
            socket &&
            (socket.readyState === WebSocket.OPEN ||
              socket.readyState === WebSocket.CONNECTING)
          ) {
            socket.close();
          }

          store.dispatch(actions.connecting());

          const currentSocket = new WebSocket(connectUrl);
          socket = currentSocket;

          currentSocket.onopen = (): void => {
            if (socket === currentSocket) {
              store.dispatch(actions.open());
            }
          };

          currentSocket.onerror = (): void => {
            if (socket === currentSocket) {
              store.dispatch(actions.error('Ошибка соединения'));
            }
          };

          currentSocket.onclose = (): void => {
            if (socket !== currentSocket) {
              return;
            }

            socket = null;
            store.dispatch(actions.close());

            if (!wasClosedByUser) {
              reconnect();
            }
          };

          currentSocket.onmessage = (event: MessageEvent<string>): void => {
            if (socket !== currentSocket) {
              return;
            }

            const data: unknown = JSON.parse(event.data);

            if (
              options.withTokenRefresh &&
              isSocketError(data) &&
              data.message === INVALID_TOKEN_MESSAGE
            ) {
              void refreshToken()
                .then(() => {
                  store.dispatch(actions.connect(getProfileOrdersUrl(connectUrl)));
                })
                .catch(() => {
                  store.dispatch(actions.error(data.message));
                });

              return;
            }

            store.dispatch(actions.message(data as TData));
          };
        }

        if (actions.disconnect.match(action)) {
          wasClosedByUser = true;
          clearReconnectTimeout();

          if (socket) {
            socket.close();
            socket = null;
          }
        }

        return next(action);
      };
  };
};
