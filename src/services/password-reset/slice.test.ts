import { describe, expect, it } from 'vitest';

import reducer from './slice';
import { forgotPasswordThunk, resetPasswordThunk } from './thunks';

const initialState = {
  loading: false,
  error: null,
};

describe('password-reset slice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('handles forgotPasswordThunk.pending', () => {
    expect(
      reducer(undefined, forgotPasswordThunk.pending('', 'test@example.com'))
    ).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('handles forgotPasswordThunk.fulfilled', () => {
    expect(
      reducer(
        { ...initialState, loading: true },
        forgotPasswordThunk.fulfilled(undefined, '', 'test@example.com')
      )
    ).toEqual(initialState);
  });

  it('handles forgotPasswordThunk.rejected', () => {
    expect(
      reducer(
        { ...initialState, loading: true },
        forgotPasswordThunk.rejected(null, '', 'test@example.com')
      )
    ).toEqual({
      ...initialState,
      error: 'Не удалось отправить письмо',
    });
  });

  it('handles resetPasswordThunk.pending', () => {
    expect(
      reducer(undefined, resetPasswordThunk.pending('', { password: '', token: '' }))
    ).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('handles resetPasswordThunk.fulfilled', () => {
    expect(
      reducer(
        { ...initialState, loading: true },
        resetPasswordThunk.fulfilled(undefined, '', { password: '', token: '' })
      )
    ).toEqual(initialState);
  });

  it('handles resetPasswordThunk.rejected', () => {
    expect(
      reducer(
        { ...initialState, loading: true },
        resetPasswordThunk.rejected(null, '', { password: '', token: '' })
      )
    ).toEqual({
      ...initialState,
      error: 'Не удалось сохранить новый пароль',
    });
  });
});
