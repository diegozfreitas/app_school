import { FormFieldError, FormFieldLabel } from '@/components/form-field';
import { Button, ButtonText } from '@/components/ui/button';
import { FormControl } from '@/components/ui/form-control';
import { HStack } from '@/components/ui/hstack';

type Option = { value: string; label: string };

type OptionPickerProps = {
  label: string;
  options: Option[];
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  // Mostra a opção selecionada, mas não permite trocar.
  disabled?: boolean;
};

// Seleção única em "chips" (botões do gluestack), usada para poucas opções (turno, escola).
export function OptionPicker({ label, options, value, onChange, error, disabled }: OptionPickerProps) {
  return (
    <FormControl isRequired isInvalid={Boolean(error)}>
      <FormFieldLabel label={label} />
      <HStack className="flex-wrap gap-2">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Button
              key={option.value}
              size="sm"
              variant={selected ? 'default' : 'outline'}
              className="rounded-full"
              onPress={disabled ? undefined : () => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled }}>
              <ButtonText>{option.label}</ButtonText>
            </Button>
          );
        })}
      </HStack>
      <FormFieldError error={error} />
    </FormControl>
  );
}
