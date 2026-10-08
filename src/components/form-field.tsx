import type { ComponentProps } from 'react';

import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';

type FormFieldProps = Pick<
  ComponentProps<typeof InputField>,
  | 'value'
  | 'onChangeText'
  | 'placeholder'
  | 'keyboardType'
  | 'maxLength'
  | 'autoCapitalize'
  | 'autoComplete'
  | 'returnKeyType'
  | 'onSubmitEditing'
> & {
  label: string;
  error?: string;
};

// Campo de texto obrigatório: rótulo com "*", input e mensagem de erro (FormControl do gluestack).
export function FormField({ label, error, ...inputProps }: FormFieldProps) {
  return (
    <FormControl isRequired isInvalid={Boolean(error)}>
      <FormFieldLabel label={label} />
      <Input className="h-11">
        <InputField {...inputProps} aria-label={label} className="text-base" />
      </Input>
      <FormFieldError error={error} />
    </FormControl>
  );
}

// O asterisco de obrigatório é adicionado pelo FormControl (isRequired).
export function FormFieldLabel({ label }: { label: string }) {
  return (
    <FormControlLabel>
      <FormControlLabelText>{label}</FormControlLabelText>
    </FormControlLabel>
  );
}

export function FormFieldError({ error }: { error?: string }) {
  return (
    <FormControlError>
      <FormControlErrorText className="text-sm">{error}</FormControlErrorText>
    </FormControlError>
  );
}
