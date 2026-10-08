import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { AddIcon } from '@/components/ui/icon';

// Botão principal fixo no rodapé da tela (ex.: "Adicionar nova escola").
export function FooterAction({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Box className="border-t border-border p-4">
      <Button size="lg" onPress={onPress}>
        <ButtonIcon as={AddIcon} />
        <ButtonText>{label}</ButtonText>
      </Button>
    </Box>
  );
}
