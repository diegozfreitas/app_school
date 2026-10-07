import { useTheme } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable } from 'react-native';

import { goBack } from '@/lib/navigation';

// Botão de voltar do cabeçalho que sempre aparece, mesmo sem histórico de navegação.
export function HeaderBackButton() {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => goBack()}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      hitSlop={12}
      className="pr-3 active:opacity-60">
      <SymbolView
        name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
        tintColor={colors.text}
        size={24}
      />
    </Pressable>
  );
}
