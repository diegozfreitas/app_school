import { Pressable, Text, View } from 'react-native';

import { Button, ButtonText } from '@/components/ui/button';

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
    <View className="gap-1 rounded-lg border border-border bg-card p-4">
      <Text className="text-base font-semibold text-foreground">{item.name}</Text>
      <Text className="text-sm text-muted-foreground">
        {shiftLabel(item.shift)} · Ano letivo {item.year}
      </Text>

      {onOpenSchool && (
        <Pressable onPress={onOpenSchool} accessibilityRole="link" hitSlop={8}>
          <Text className="text-sm font-medium text-foreground underline">
            {item.school?.name ?? 'Escola não encontrada'} ›
          </Text>
        </Pressable>
      )}

      <View className="mt-2 flex-row justify-end gap-2">
        <Button size="sm" variant="outline" onPress={onEdit}>
          <ButtonText>Editar</ButtonText>
        </Button>
        <Button size="sm" variant="destructive" onPress={onDelete}>
          <ButtonText>Excluir</ButtonText>
        </Button>
      </View>
    </View>
  );
}
