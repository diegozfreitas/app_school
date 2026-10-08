import * as SplashScreen from 'expo-splash-screen';

import { useSession } from '@/contexts/session-context';

// Mantém a splash nativa até a sessão salva ser restaurada, para a tela de login não
// "piscar" antes de entrar direto no app.
SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useSession();

  if (!isLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}
