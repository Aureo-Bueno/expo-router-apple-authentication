import * as SecureStore from 'expo-secure-store';
import { clearSession, getSession, saveSession } from '../auth';

jest.mock('expo-secure-store', () => ({
  deleteItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
}));

const SESSION_KEY = 'apple_sign_in_session';

beforeEach(() => {
  jest.clearAllMocks();
});

it('returns no session when nothing is stored', async () => {
  (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

  await expect(getSession()).resolves.toBeNull();
});

it('reads the stored display name', async () => {
  (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(
    JSON.stringify({ displayName: 'Ana' }),
  );

  await expect(getSession()).resolves.toEqual({ displayName: 'Ana' });
});

it('stores the display name', async () => {
  await saveSession({ displayName: 'Ana' });

  expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
    SESSION_KEY,
    JSON.stringify({ displayName: 'Ana' }),
  );
});

it('removes the stored session', async () => {
  await clearSession();

  expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(SESSION_KEY);
});
