import { Pressable, Text, View } from 'react-native';

import { FieldError, FieldLabel } from '@/components/form-field';

type Option = { value: string; label: string };

type OptionPickerProps = {
  label: string;
  options: Option[];
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

// Seleção única em formato de "chips", usada para poucas opções (turno, escola).
export function OptionPicker({ label, options, value, onChange, error, disabled }: OptionPickerProps) {
  return (
    <View className="gap-1.5">
      <FieldLabel label={label} />
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              disabled={disabled}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled }}
              className={`rounded-full border px-4 py-2 ${
                selected ? 'border-primary bg-primary' : 'border-input bg-background'
              } ${disabled && !selected ? 'opacity-40' : ''}`}>
              <Text className={`text-sm ${selected ? 'text-primary-foreground' : 'text-foreground'}`}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <FieldError error={error} />
    </View>
  );
}
