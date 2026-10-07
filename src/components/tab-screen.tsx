import type { ReactNode } from 'react';
import { View } from 'react-native';
// SafeAreaView do react-native-screens conhece a altura real da barra de abas nativa
// (a do react-native-safe-area-context só enxerga as bordas do sistema).
import { SafeAreaView } from 'react-native-screens/experimental';

// Container das telas das abas: o conteúdo (lista + botão do rodapé) nunca fica atrás da
// barra de abas nem da status bar. Usado junto com `disableAutomaticContentInsets` em app-tabs.
export function TabScreen({ children }: { children: ReactNode }) {
  return (
    // Na web as abas ficam no topo (app-tabs.web.tsx), daí o espaço extra em cima.
    <View className="flex-1 bg-background web:pt-20">
      <SafeAreaView edges={{ top: true, bottom: true }} style={{ flex: 1 }}>
        {children}
      </SafeAreaView>
    </View>
  );
}
