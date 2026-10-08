import '@/global.css';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { HeaderBackButton } from '@/components/header-back-button';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <GluestackUIProvider mode="system">
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style="auto" />
        {/* Toda tela fora das abas ganha um "Voltar" que funciona mesmo sem histórico. */}
        <Stack screenOptions={{ headerLeft: () => <HeaderBackButton /> }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="schools/[id]" options={{ title: 'Escola' }} />
          <Stack.Screen name="school-form" options={{ presentation: 'modal' }} />
          <Stack.Screen name="class-form" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
