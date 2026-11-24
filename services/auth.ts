import * as SecureStore from 'expo-secure-store';

export type Session = {
  displayName: string;
};

const SESSION_KEY = 'apple_sign_in_session';

export async function getSession(): Promise<Session | null> {
  const raw = await SecureStore.getItemAsync(SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    const session = JSON.parse(raw) as Session;
    return typeof session.displayName === 'string' ? session : null;
  } catch {
    return null;
  }
}

export async function saveSession(session: Session): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
