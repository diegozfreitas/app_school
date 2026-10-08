import { Stack, useLocalSearchParams } from 'expo-router';

import { LoadingState } from '@/components/loading-state';
import { PageTitle } from '@/components/page-title';
import { StackScreen } from '@/components/stack-screen';
import { goBack } from '@/lib/navigation';

import { SchoolForm } from '../components/school-form';
import { useSchoolForm } from '../hooks/use-school-form';

export function SchoolFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const form = useSchoolForm(id, { onSaved: () => goBack() });

  return (
    <StackScreen>
      <Stack.Screen options={{ title: form.isEditing ? 'Editar escola' : 'Nova escola' }} />
      <PageTitle title={form.isEditing ? 'Editar escola' : 'Nova escola'} />
      {form.loading ? <LoadingState /> : <SchoolForm form={form} onCancel={() => goBack()} />}
    </StackScreen>
  );
}
