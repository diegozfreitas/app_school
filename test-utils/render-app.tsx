import { Stack } from 'expo-router';
import { renderRouter } from 'expo-router/testing-library';

import ClassesScreen from '@/app/(tabs)/classes';
import SchoolsScreen from '@/app/(tabs)/index';
import ClassFormScreen from '@/app/class-form';
import SchoolFormScreen from '@/app/school-form';
import SchoolDetailScreen from '@/app/schools/[id]';
import { HeaderBackButton } from '@/components/header-back-button';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

// Layout raiz simplificado: mesmo provider e botão de voltar do app, mas com Stack no lugar
// das abas nativas, que não rodam no ambiente do Jest.
function TestRootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <Stack screenOptions={{ headerLeft: () => <HeaderBackButton /> }} />
    </GluestackUIProvider>
  );
}

// Renderiza as telas reais do app a partir de uma URL inicial.
// Use `expect(app).toHavePathname(...)` para verificar a rota atual.
export async function renderApp(initialUrl = '/') {
  const rendered = renderRouter(
    {
      _layout: TestRootLayout,
      '(tabs)/index': SchoolsScreen,
      '(tabs)/classes': ClassesScreen,
      'schools/[id]': SchoolDetailScreen,
      'school-form': SchoolFormScreen,
      'class-form': ClassFormScreen,
    },
    { initialUrl }
  );
  await rendered;
  // Com o RNTL 14 o render é assíncrono e o expo-router anexa getPathname() & cia. na promise,
  // não no resultado do await. Por isso devolvemos a própria promise dentro de um objeto.
  return { app: rendered };
}
