import { router, Stack, useLocalSearchParams } from 'expo-router';

import { FooterAction } from '@/components/footer-action';
import { PageTitle } from '@/components/page-title';
import { StackScreen } from '@/components/stack-screen';
import { ClassList } from '@/features/classes/components/class-list';
import { DeleteClassDialog } from '@/features/classes/components/delete-class-dialog';
import { useRefreshOnFocus } from '@/hooks/use-refresh-on-focus';

import { SchoolSummary } from '../components/school-summary';
import { useSchoolDetails } from '../hooks/use-school-details';

export function SchoolDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { school, classes, loading, error, reload, deletion } = useSchoolDetails(id);
  useRefreshOnFocus(reload);

  return (
    <StackScreen>
      <Stack.Screen options={{ title: school?.name ?? 'Escola' }} />
      <PageTitle title={school?.name ?? 'Escola'} />

      <ClassList
        classes={classes}
        loading={loading}
        error={error}
        onRefresh={reload}
        emptyMessage="Nenhuma classe cadastrada nesta escola"
        header={school && <SchoolSummary school={school} classesCount={classes.length} />}
        onEdit={(item) => router.push({ pathname: '/classes/form', params: { id: item.id } })}
        onDelete={deletion.request}
      />

      {school && (
        <FooterAction
          label="Adicionar nova classe"
          onPress={() => router.push({ pathname: '/classes/form', params: { schoolId: school.id } })}
        />
      )}

      <DeleteClassDialog
        schoolClass={deletion.target}
        onCancel={deletion.cancel}
        onConfirm={deletion.confirm}
      />
    </StackScreen>
  );
}
