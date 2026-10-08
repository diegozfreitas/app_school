import { router } from 'expo-router';

import { FooterAction } from '@/components/footer-action';
import { ScreenHeader } from '@/components/screen-header';
import { SearchInput } from '@/components/search-input';
import { TabScreen } from '@/components/tab-screen';
import { ManagerMenu } from '@/features/session/components/manager-menu';
import { useRefreshOnFocus } from '@/hooks/use-refresh-on-focus';

import { DeleteSchoolDialog } from '../components/delete-school-dialog';
import { SchoolList } from '../components/school-list';
import { useSchools } from '../hooks/use-schools';

export function SchoolsScreen() {
  const { schools, loading, error, reload, search, deletion } = useSchools();
  useRefreshOnFocus(reload);

  return (
    <TabScreen>
      <ScreenHeader title="Escolas" action={<ManagerMenu />}>
        <SearchInput
          value={search.query}
          onChangeText={search.setQuery}
          placeholder="Buscar por nome ou endereço"
        />
      </ScreenHeader>

      <SchoolList
        schools={schools}
        loading={loading}
        error={error}
        onRefresh={reload}
        searchQuery={search.query}
        onOpen={(school) => router.push({ pathname: '/schools/[id]', params: { id: school.id } })}
        onEdit={(school) => router.push({ pathname: '/schools/form', params: { id: school.id } })}
        onDelete={deletion.request}
      />

      <FooterAction label="Adicionar nova escola" onPress={() => router.push('/schools/form')} />

      <DeleteSchoolDialog
        school={deletion.target}
        onCancel={deletion.cancel}
        onConfirm={deletion.confirm}
      />
    </TabScreen>
  );
}
