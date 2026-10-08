import type { ReactNode } from 'react';
// SafeAreaView do react-native-screens conhece a altura real da barra de abas nativa
// (o gluestack/react-native-safe-area-context só enxergam as bordas do sistema).
import { SafeAreaView } from 'react-native-screens/experimental';

import { Box } from '@/components/ui/box';
import { OfflineBanner } from '@/features/offline/components/offline-banner';

// Container das telas das abas: o conteúdo (lista + botão do rodapé) nunca fica atrás da
// barra de abas nem da status bar. Usado junto com `disableAutomaticContentInsets` em app-tabs.
export function TabScreen({ children }: { children: ReactNode }) {
  return (
    // Na web as abas ficam no topo (app-tabs.web.tsx), daí o espaço extra em cima.
    <Box className="flex-1 bg-background web:pt-20">
      <SafeAreaView edges={{ top: true, bottom: true }} style={{ flex: 1 }}>
        <OfflineBanner />
        {children}
      </SafeAreaView>
    </Box>
  );
}
