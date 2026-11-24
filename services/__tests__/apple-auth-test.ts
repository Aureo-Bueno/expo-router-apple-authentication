import { getAppleSignInErrorMessage, getDisplayName } from '../apple-auth';

it('uses the Apple given name when available', () => {
  expect(getDisplayName({ givenName: ' Ana ' })).toBe('Ana');
});

it('falls back to a generic name when Apple provides none', () => {
  expect(getDisplayName(null)).toBe('usuário');
});

it('stays silent when the user cancels Apple sign in', () => {
  expect(getAppleSignInErrorMessage({ code: 'ERR_CANCELED' })).toBeNull();
});

it('shows a friendly message for other Apple sign in errors', () => {
  expect(getAppleSignInErrorMessage(new Error('boom'))).toBe(
    'Não foi possível entrar com a Apple. Tente novamente.',
  );
});
