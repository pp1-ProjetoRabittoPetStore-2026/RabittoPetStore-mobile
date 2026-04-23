import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from '@/services/modules/auth/storage';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      const storedToken = await getStoredToken();

      if (!isMounted) {
        return;
      }

      setToken(storedToken);
      setIsLoading(false);
    }

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = useCallback(async (newToken: string) => {
    setToken(newToken);
    await setStoredToken(newToken);
  }, []);

  const signOut = useCallback(async () => {
    setToken(null);
    await clearStoredToken();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      isLoading,
      signIn,
      signOut,
    }),
    [isLoading, signIn, signOut, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
