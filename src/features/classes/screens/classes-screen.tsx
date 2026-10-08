import { router } from 'expo-router';

import { FooterAction } from '@/components/footer-action';
import { PageTitle } from '@/components/page-title';
import { ScreenHeader } from '@/components/screen-header';
import { TabScreen } from '@/components/tab-screen';
import { ManagerMenu } from '@/features/session/components/manager-menu';
import { useRefreshOnFocus } from '@/hooks/use-refresh-on-focus';

import { ClassFilters } from '../components/class-filters';
import { ClassList } from '../components/class-list';
import { DeleteClassDialog } from '../components/delete-class-dialog';
import { useClasses } from '../hooks/use-classes';

export function ClassesScreen() {
  const { classes, loading, error, reload, filters, isFiltering, deletion } = useClasses();
  useRefreshOnFocus(reload);

  return (
    <TabScreen>
      <PageTitle title="Classes" />
      <ScreenHeader title="Classes" action={<ManagerMenu />}>
        <ClassFilters {...filters} />
      </ScreenHeader>

      <ClassList
        classes={classes}
        loading={loading}
        error={error}
        onRefresh={reload}
        isFiltering={isFiltering}
        onOpenSchool={(item) =>
          router.push({ pathname: '/schools/[id]', params: { id: item.schoolId } })
        }
        onEdit={(item) => router.push({ pathname: '/classes/form', params: { id: item.id } })}
        onDelete={deletion.request}
      />

      <FooterAction label="Adicionar nova classe" onPress={() => router.push('/classes/form')} />

      <DeleteClassDialog
        schoolClass={deletion.target}
        onCancel={deletion.cancel}
        onConfirm={deletion.confirm}
      />
    </TabScreen>
  );
}
