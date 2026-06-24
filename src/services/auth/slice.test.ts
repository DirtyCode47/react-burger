import { describe, expect, it } from 'vitest';

import { userMock } from '../test-data';
import reducer from './slice';
import {
  checkUserAuthThunk,
  loginUserThunk,
  logoutUserThunk,
  registerUserThunk,
  updateUserThunk,
} from './thunks';

const initialState = {
  user: null,
  loading: false,
  isAuthChecked: false,
  error: null,
};

describe('auth slice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('handles registerUserThunk.pending', () => {
    expect(
      reducer(
        undefined,
        registerUserThunk.pending('', { email: '', password: '', name: '' })
      )
    ).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('handles registerUserThunk.fulfilled', () => {
    expect(
      reducer(
        { ...initialState, loading: true },
        registerUserThunk.fulfilled(userMock, '', { email: '', password: '', name: '' })
      )
    ).toEqual({
      ...initialState,
      user: userMock,
    });
  });

  it('handles registerUserThunk.rejected', () => {
    expect(
      reducer(
        { ...initialState, loading: true },
        registerUserThunk.rejected(null, '', { email: '', password: '', name: '' })
      )
    ).toEqual({
      ...initialState,
      error: 'Не удалось зарегистрироваться',
    });
  });

  it('handles loginUserThunk.pending', () => {
    expect(
      reducer(undefined, loginUserThunk.pending('', { email: '', password: '' }))
    ).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('handles loginUserThunk.fulfilled', () => {
    expect(
      reducer(
        { ...initialState, loading: true },
        loginUserThunk.fulfilled(userMock, '', { email: '', password: '' })
      )
    ).toEqual({
      ...initialState,
      user: userMock,
    });
  });

  it('handles loginUserThunk.rejected', () => {
    expect(
      reducer(
        { ...initialState, loading: true },
        loginUserThunk.rejected(null, '', { email: '', password: '' })
      )
    ).toEqual({
      ...initialState,
      error: 'Не удалось войти',
    });
  });

  it('handles logoutUserThunk.pending', () => {
    expect(
      reducer({ ...initialState, user: userMock }, logoutUserThunk.pending(''))
    ).toEqual({
      ...initialState,
      user: userMock,
      loading: true,
    });
  });

  it('handles logoutUserThunk.fulfilled', () => {
    expect(
      reducer(
        { ...initialState, user: userMock, loading: true },
        logoutUserThunk.fulfilled(undefined, '')
      )
    ).toEqual(initialState);
  });

  it('handles logoutUserThunk.rejected', () => {
    expect(
      reducer(
        { ...initialState, user: userMock, loading: true },
        logoutUserThunk.rejected(null, '')
      )
    ).toEqual({
      ...initialState,
      user: userMock,
      error: 'Не удалось выйти',
    });
  });

  it('handles checkUserAuthThunk.pending', () => {
    expect(reducer(undefined, checkUserAuthThunk.pending(''))).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('handles checkUserAuthThunk.fulfilled', () => {
    expect(
      reducer(
        { ...initialState, loading: true },
        checkUserAuthThunk.fulfilled(userMock, '')
      )
    ).toEqual({
      ...initialState,
      user: userMock,
      isAuthChecked: true,
    });
  });

  it('handles checkUserAuthThunk.rejected', () => {
    expect(
      reducer(
        { ...initialState, user: userMock, loading: true },
        checkUserAuthThunk.rejected(null, '')
      )
    ).toEqual({
      ...initialState,
      isAuthChecked: true,
    });
  });

  it('handles updateUserThunk.pending', () => {
    expect(
      reducer(
        { ...initialState, error: 'error' },
        updateUserThunk.pending('', { email: '', password: '', name: '' })
      )
    ).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('handles updateUserThunk.fulfilled', () => {
    expect(
      reducer(
        { ...initialState, loading: true },
        updateUserThunk.fulfilled(userMock, '', { email: '', password: '', name: '' })
      )
    ).toEqual({
      ...initialState,
      user: userMock,
    });
  });

  it('handles updateUserThunk.rejected', () => {
    expect(
      reducer(
        { ...initialState, loading: true },
        updateUserThunk.rejected(null, '', { email: '', password: '', name: '' })
      )
    ).toEqual({
      ...initialState,
      error: 'Не удалось обновить данные',
    });
  });
});
