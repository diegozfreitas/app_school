import { FormActions } from '@/components/form-actions';
import { FormField } from '@/components/form-field';
import { OptionPicker } from '@/components/option-picker';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import type { ClassFormState } from '../hooks/use-class-form';
import { SHIFTS, type Shift } from '../types';

export function ClassForm({ form, onCancel }: { form: ClassFormState; onCancel: () => void }) {
  return (
    <ScrollView className="flex-1" contentContainerClassName="gap-4 p-4" keyboardShouldPersistTaps="handled">
      <FormField
        label="Nome da classe"
        value={form.name}
        onChangeText={form.setName}
        error={form.errors.name}
        placeholder="Ex.: 1º Ano A"
      />
      <OptionPicker
        label="Turno"
        options={[...SHIFTS]}
        value={form.shift}
        onChange={(value) => form.setShift(value as Shift)}
        error={form.errors.shift}
      />
      <FormField
        label="Ano letivo"
        value={form.year}
        onChangeText={form.setYear}
        error={form.errors.year}
        placeholder="Ex.: 2026"
        keyboardType="number-pad"
        maxLength={4}
      />
      <SchoolField form={form} />
      <FormActions saving={form.saving} onCancel={onCancel} onSubmit={form.submit} />
    </ScrollView>
  );
}

function SchoolField({ form }: { form: ClassFormState }) {
  if (form.isEditing) {
    // Na edição a escola não muda: só mostra a qual escola a classe pertence.
    return (
      <VStack className="gap-1.5">
        <Text size="sm" className="font-medium text-foreground">
          Escola
        </Text>
        <Text className="text-muted-foreground">{form.schoolName ?? '—'}</Text>
      </VStack>
    );
  }

  if (form.schoolOptions.length === 0) {
    return (
      <Text size="sm" className="text-destructive">
        Cadastre uma escola antes de adicionar classes.
      </Text>
    );
  }

  return (
    <OptionPicker
      label="Escola"
      options={form.schoolOptions}
      value={form.schoolId}
      onChange={form.setSchoolId}
      error={form.errors.schoolId}
      disabled={form.isSchoolLocked}
    />
  );
}
