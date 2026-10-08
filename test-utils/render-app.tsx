import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderRouter } from 'expo-router/testing-library';

import ClassesScreen from '@/app/(tabs)/classes';
import SchoolsScreen from '@/app/(tabs)/index';
import RootLayout from '@/app/_layout';
import ClassFormScreen from '@/app/classes/form';
import LoginScreen from '@/app/login';
import SchoolFormScreen from '@/app/schools/form';
import SchoolDetailScreen from '@/app/schools/[id]';

type RenderAppOptions = {
  // Gestor já identificado (sessão salva no aparelho). `null` abre deslogado, na tela de login.
  signedInAs?: string | null;
};

// Renderiza o app real (layout raiz com sessão e rotas protegidas) a partir de uma URL inicial.
// As abas nativas ficam de fora (não rodam no Jest): as telas das abas entram direto no Stack.
// Use `expect(app).toHavePathname(...)` para verificar a rota atual.
export async function renderApp(initialUrl = '/', { signedInAs = 'Diego' }: RenderAppOptions = {}) {
  await AsyncStorage.clear();
  if (signedInAs) {
    await AsyncStorage.setItem('@appschool/session/manager-name', signedInAs);
  }

  const rendered = renderRouter(
    {
      _layout: RootLayout,
      '(tabs)/index': SchoolsScreen,
      '(tabs)/classes': ClassesScreen,
      'schools/[id]': SchoolDetailScreen,
      'schools/form': SchoolFormScreen,
      'classes/form': ClassFormScreen,
      login: LoginScreen,
    },
    { initialUrl }
  );
  await rendered;
  // Com o RNTL 14 o render é assíncrono e o expo-router anexa getPathname() & cia. na promise,
  // não no resultado do await. Por isso devolvemos a própria promise dentro de um objeto.
  return { app: rendered };
}
