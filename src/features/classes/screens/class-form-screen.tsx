import { Stack, useLocalSearchParams } from 'expo-router';

import { LoadingState } from '@/components/loading-state';
import { PageTitle } from '@/components/page-title';
import { StackScreen } from '@/components/stack-screen';
import { goBack } from '@/lib/navigation';

import { ClassForm } from '../components/class-form';
import { useClassForm } from '../hooks/use-class-form';

export function ClassFormScreen() {
  // id: editar uma classe existente. schoolId: nova classe já vinculada a uma escola.
  const params = useLocalSearchParams<{ id?: string; schoolId?: string }>();
  const form = useClassForm(params, { onSaved: () => goBack() });

  return (
    <StackScreen>
      <Stack.Screen options={{ title: form.isEditing ? 'Editar classe' : 'Nova classe' }} />
      <PageTitle title={form.isEditing ? 'Editar classe' : 'Nova classe'} />
      {form.loading ? <LoadingState /> : <ClassForm form={form} onCancel={() => goBack()} />}
    </StackScreen>
  );
}
