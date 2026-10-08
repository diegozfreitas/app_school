import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { EditIcon, TrashIcon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';

import type { SchoolWithClassesCount } from '../types';

type SchoolCardProps = {
  item: SchoolWithClassesCount;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function SchoolCard({ item, onPress, onEdit, onDelete }: SchoolCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="gap-1 rounded-lg border border-border bg-card p-4 data-[active=true]:opacity-70">
      <Heading size="sm">{item.name}</Heading>
      <Text size="sm" className="text-muted-foreground">
        {item.address}
      </Text>
      <Text size="sm" className="text-muted-foreground">
        {item.classesCount} {item.classesCount === 1 ? 'classe' : 'classes'} ›
      </Text>
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
    </Pressable>
  );
}
