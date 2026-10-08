import { HStack } from '@/components/ui/hstack';
import { AlertCircleIcon, Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useIsOffline } from '@/lib/connectivity';

// Aviso exibido enquanto a API está inacessível e as telas mostram a cópia salva no aparelho.
export function OfflineBanner() {
  const isOffline = useIsOffline();

  if (!isOffline) return null;

  return (
    <HStack
      accessibilityRole="alert"
      testID="offline-banner"
      className="items-center gap-2 bg-muted px-4 py-2">
      <Icon as={AlertCircleIcon} size="sm" className="text-foreground" />
      <Text size="sm" className="flex-1 text-foreground">
        Sem conexão. Exibindo os últimos dados salvos no aparelho.
      </Text>
    </HStack>
  );
}
