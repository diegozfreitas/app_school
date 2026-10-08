import '@/global.css';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { HeaderBackButton } from '@/components/header-back-button';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { SessionProvider, useSession } from '@/contexts/session-context';
import { SplashScreenController } from '@/features/session/components/splash-screen-controller';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <SessionProvider>
      <GluestackUIProvider mode="system">
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar style="auto" />
          {/* Título padrão da aba do navegador; cada tela troca pelo seu (PageTitle). */}
          <Head>
            <title>AppSchool</title>
          </Head>
          <SplashScreenController />
          <RootNavigator />
        </ThemeProvider>
      </GluestackUIProvider>
    </SessionProvider>
  );
}

// Sem gestor identificado só a tela de login fica acessível; ao entrar/sair o Expo Router
// redireciona automaticamente entre os dois grupos.
function RootNavigator() {
  const { managerName, isLoading } = useSession();
  const isSignedIn = Boolean(managerName);

  // Só monta a navegação depois de restaurar a sessão (a splash cobre a tela até lá). Senão,
  // ao abrir um link direto (ex.: /schools/1) o app veria "deslogado" por um instante e
  // mandaria para o login, perdendo a tela pedida.
  if (isLoading) return null;

  return (
    // Toda tela fora das abas ganha um "Voltar" que funciona mesmo sem histórico.
    <Stack screenOptions={{ headerLeft: () => <HeaderBackButton /> }}>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="schools/[id]" options={{ title: 'Escola' }} />
        <Stack.Screen name="schools/form" options={{ presentation: 'modal' }} />
        <Stack.Screen name="classes/form" options={{ presentation: 'modal' }} />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
