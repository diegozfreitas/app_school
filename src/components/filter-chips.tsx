import { Button, ButtonText } from '@/components/ui/button';
import { ScrollView } from '@/components/ui/scroll-view';

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
          <Button
            key={chip.value ?? 'all'}
            size="sm"
            variant={selected ? 'default' : 'outline'}
            className="rounded-full"
            onPress={() => onChange(chip.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}>
            <ButtonText>{chip.label}</ButtonText>
          </Button>
        );
      })}
    </ScrollView>
  );
}
