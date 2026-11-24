import { act } from 'react';
import renderer from 'react-test-renderer';
import { clearSession, getSession, saveSession } from '../../services/auth';
import { AuthProvider, useAuth } from '../useAuth';

jest.mock('../../services/auth', () => ({
  clearSession: jest.fn(),
  getSession: jest.fn(),
  saveSession: jest.fn(),
}));

type AuthApi = ReturnType<typeof useAuth>;

let auth!: AuthApi;

function Probe() {
  auth = useAuth();
  return null;
}

async function renderProvider() {
  await act(async () => {
    renderer.create(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(getSession).mockResolvedValue(null);
  jest.mocked(saveSession).mockResolvedValue(undefined);
  jest.mocked(clearSession).mockResolvedValue(undefined);
});

it('starts ready and signed out when there is no stored session', async () => {
  await renderProvider();

  expect(auth.isReady).toBe(true);
  expect(auth.signedIn).toBe(false);
  expect(auth.displayName).toBeNull();
});

it('signs in with the display name and persists it', async () => {
  await renderProvider();

  await act(async () => {
    await auth.signIn('Ana');
  });

  expect(auth.signedIn).toBe(true);
  expect(auth.displayName).toBe('Ana');
  expect(saveSession).toHaveBeenCalledWith({ displayName: 'Ana' });
});

it('signs out and clears the stored session', async () => {
  jest.mocked(getSession).mockResolvedValue({ displayName: 'Ana' });
  await renderProvider();

  expect(auth.signedIn).toBe(true);

  await act(async () => {
    await auth.signOut();
  });

  expect(auth.signedIn).toBe(false);
  expect(auth.displayName).toBeNull();
  expect(clearSession).toHaveBeenCalledTimes(1);
});
