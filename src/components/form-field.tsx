import { Text, TextInput, type TextInputProps, View } from 'react-native';

type FormFieldProps = Pick<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'keyboardType' | 'maxLength'> & {
  label: string;
  error?: string;
};

export function FormField({ label, error, ...inputProps }: FormFieldProps) {
  return (
    <View className="gap-1.5">
      <FieldLabel label={label} />
      <TextInput
        {...inputProps}
        className={`rounded-md border px-3 py-2.5 text-base text-foreground ${
          error ? 'border-destructive' : 'border-input'
        }`}
      />
      <FieldError error={error} />
    </View>
  );
}

export function FieldLabel({ label }: { label: string }) {
  return (
    <Text className="text-sm font-medium text-foreground">
      {label} <Text className="text-destructive">*</Text>
    </Text>
  );
}

export function FieldError({ error }: { error?: string }) {
  return error ? <Text className="text-sm text-destructive">{error}</Text> : null;
}
