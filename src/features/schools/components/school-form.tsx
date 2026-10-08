import { FormActions } from '@/components/form-actions';
import { FormField } from '@/components/form-field';
import { ScrollView } from '@/components/ui/scroll-view';

import type { SchoolFormState } from '../hooks/use-school-form';

export function SchoolForm({ form, onCancel }: { form: SchoolFormState; onCancel: () => void }) {
  return (
    <ScrollView className="flex-1" contentContainerClassName="gap-4 p-4" keyboardShouldPersistTaps="handled">
      <FormField
        label="Nome"
        value={form.name}
        onChangeText={form.setName}
        error={form.errors.name}
        placeholder="Ex.: Escola Municipal Monteiro Lobato"
      />
      <FormField
        label="Endereço"
        value={form.address}
        onChangeText={form.setAddress}
        error={form.errors.address}
        placeholder="Ex.: Rua das Flores, 120 - Centro"
      />
      <FormActions saving={form.saving} onCancel={onCancel} onSubmit={form.submit} />
    </ScrollView>
  );
}
