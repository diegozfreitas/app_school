import { ChevronLeftIcon, Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { goBack } from '@/lib/navigation';

// Botão de voltar do cabeçalho que sempre aparece, mesmo sem histórico de navegação.
export function HeaderBackButton() {
  return (
    <Pressable
      onPress={() => goBack()}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      hitSlop={12}
      className="pr-3 data-[active=true]:opacity-60">
      <Icon as={ChevronLeftIcon} size="xl" className="text-foreground" />
    </Pressable>
  );
}
