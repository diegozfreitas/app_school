import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { EditIcon, TrashIcon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';

import { shiftLabel, type SchoolClassWithSchool } from '../types';

type ClassCardProps = {
  item: SchoolClassWithSchool;
  onEdit: () => void;
  onDelete: () => void;
  // Quando informado, mostra o nome da escola como link para a tela da escola.
  onOpenSchool?: () => void;
};

export function ClassCard({ item, onEdit, onDelete, onOpenSchool }: ClassCardProps) {
  return (
    <Box className="gap-1 rounded-lg border border-border bg-card p-4">
      <Heading size="sm">{item.name}</Heading>
      <Text size="sm" className="text-muted-foreground">
        {shiftLabel(item.shift)} · Ano letivo {item.year}
      </Text>

      {onOpenSchool && (
        <Pressable onPress={onOpenSchool} accessibilityRole="link" hitSlop={8}>
          <Text size="sm" className="font-medium text-foreground underline">
            {item.school?.name ?? 'Escola não encontrada'} ›
          </Text>
        </Pressable>
      )}

      <HStack className="mt-2 justify-end gap-2">
        <Button size="sm" variant="outline" onPress={onEdit}>
          <ButtonIcon as={EditIcon} />
          <ButtonText>Editar</ButtonText>
        </Button>
        <Button size="sm" variant="destructive" onPress={onDelete}>
          <ButtonIcon as={TrashIcon} />
          <ButtonText>Excluir</ButtonText>
        </Button>
      </HStack>
    </Box>
  );
}
