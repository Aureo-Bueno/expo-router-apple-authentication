import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { clearSession, getSession, saveSession } from '../services/auth';

type AuthContextValue = {
  isReady: boolean;
  signedIn: boolean;
  displayName: string | null;
  signIn: (displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getSession()
      .then((session) => {
        if (active) {
          setDisplayName(session?.displayName ?? null);
        }
      })
      .finally(() => {
        if (active) {
          setIsReady(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (name: string) => {
    await saveSession({ displayName: name });
    setDisplayName(name);
  }, []);

  const signOut = useCallback(async () => {
    await clearSession();
    setDisplayName(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isReady,
      signedIn: displayName !== null,
      displayName,
      signIn,
      signOut,
    }),
    [displayName, isReady, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
