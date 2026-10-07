import { Pressable, ScrollView, Text } from 'react-native';

type FilterOption<T extends string> = { value: T; label: string };

type FilterChipsProps<T extends string> = {
  options: readonly FilterOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  allLabel?: string;
};

// Filtro de seleção única em linha rolável; o primeiro chip ("Todos") limpa o filtro.
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  allLabel = 'Todos',
}: FilterChipsProps<T>) {
  const chips: { value: T | null; label: string }[] = [{ value: null, label: allLabel }, ...options];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
      {chips.map((chip) => {
        const selected = chip.value === value;
        return (
          <Pressable
            key={chip.value ?? 'all'}
            onPress={() => onChange(chip.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            className={`rounded-full border px-4 py-1.5 ${
              selected ? 'border-primary bg-primary' : 'border-input bg-background'
            }`}>
            <Text className={`text-sm ${selected ? 'text-primary-foreground' : 'text-foreground'}`}>
              {chip.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
