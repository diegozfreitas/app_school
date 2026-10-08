import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

const STORAGE_KEY = '@appschool/session/manager-name';

type SessionContextValue = {
  // Nome de quem está gerenciando o app; `null` = ninguém identificado (tela de login).
  managerName: string | null;
  // true enquanto a sessão salva no aparelho é restaurada (a splash fica visível).
  isLoading: boolean;
  signIn: (name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

// Sessão do gestor via Context API, persistida no AsyncStorage entre aberturas do app.
// É só uma identificação (não há senha nem token), por isso não usa armazenamento seguro.
export function SessionProvider({ children }: { children: ReactNode }) {
  const [managerName, setManagerName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => setManagerName(saved || null))
      .catch(() => setManagerName(null))
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = useCallback(async (name: string) => {
    const trimmed = name.trim();
    setManagerName(trimmed);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, trimmed);
    } catch {
      // Sem persistência a sessão vale até o app fechar.
    }
  }, []);

  const signOut = useCallback(async () => {
    setManagerName(null);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignora: na próxima abertura o nome antigo pode reaparecer.
    }
  }, []);

  const value = useMemo(
    () => ({ managerName, isLoading, signIn, signOut }),
    [managerName, isLoading, signIn, signOut]
  );

  return <SessionContext value={value}>{children}</SessionContext>;
}

export function useSession() {
  const value = use(SessionContext);
  if (!value) {
    throw new Error('useSession precisa estar dentro de <SessionProvider />');
  }
  return value;
}
