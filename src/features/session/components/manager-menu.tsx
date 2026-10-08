import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useSession } from '@/contexts/session-context';

// "Olá, {nome}" + "Sair". Ao sair, as rotas protegidas levam de volta à tela de login.
export function ManagerMenu() {
  const { managerName, signOut } = useSession();

  if (!managerName) return null;

  return (
    <HStack className="items-center gap-1">
      <Text size="sm" className="text-muted-foreground" numberOfLines={1}>
        Olá, {managerName}
      </Text>
      <Button size="sm" variant="ghost" onPress={signOut}>
        <ButtonText>Sair</ButtonText>
      </Button>
    </HStack>
  );
}
