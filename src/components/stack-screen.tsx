import type { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-screens/experimental';

import { Box } from '@/components/ui/box';
import { OfflineBanner } from '@/features/offline/components/offline-banner';

// Container das telas fora das abas (detalhe e formulários): fundo do tema, aviso offline e
// respiro para a barra de navegação do sistema. O topo fica por conta do cabeçalho da Stack.
export function StackScreen({ children }: { children: ReactNode }) {
  return (
    <Box className="flex-1 bg-background">
      <SafeAreaView edges={{ bottom: true }} style={{ flex: 1 }}>
        <OfflineBanner />
        {children}
      </SafeAreaView>
    </Box>
  );
}
