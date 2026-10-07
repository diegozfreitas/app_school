import { Pressable, Text, View } from 'react-native';

import { Button, ButtonText } from '@/components/ui/button';

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
      className="gap-1 rounded-lg border border-border bg-card p-4 active:opacity-70">
      <Text className="text-base font-semibold text-foreground">{item.name}</Text>
      <Text className="text-sm text-muted-foreground">{item.address}</Text>
      <Text className="text-sm text-muted-foreground">
        {item.classesCount} {item.classesCount === 1 ? 'classe' : 'classes'} ›
      </Text>
      <View className="mt-2 flex-row justify-end gap-2">
        <Button size="sm" variant="outline" onPress={onEdit}>
          <ButtonText>Editar</ButtonText>
        </Button>
        <Button size="sm" variant="destructive" onPress={onDelete}>
          <ButtonText>Excluir</ButtonText>
        </Button>
      </View>
    </Pressable>
  );
}
