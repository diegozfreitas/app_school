import { useTheme } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Text, View } from 'react-native';

import { useIsOffline } from '@/lib/connectivity';

// Aviso exibido enquanto a API está inacessível e as telas mostram a cópia salva no aparelho.
export function OfflineBanner() {
  const isOffline = useIsOffline();
  const { colors } = useTheme();

  if (!isOffline) return null;

  return (
    <View
      accessibilityRole="alert"
      testID="offline-banner"
      className="flex-row items-center gap-2 bg-muted px-4 py-2">
      <SymbolView
        name={{ ios: 'wifi.slash', android: 'wifi_off', web: 'wifi_off' }}
        tintColor={colors.text}
        size={16}
      />
      <Text className="flex-1 text-sm text-foreground">
        Sem conexão. Exibindo os últimos dados salvos no aparelho.
      </Text>
    </View>
  );
}
