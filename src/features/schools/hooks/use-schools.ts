import { useAsyncData } from '@/hooks/use-async-data';
import { useConfirmDelete } from '@/hooks/use-confirm-delete';
import { useSearch } from '@/hooks/use-search';

import { deleteSchool, listSchools } from '../api';
import type { SchoolWithClassesCount } from '../types';

const searchFields = (school: SchoolWithClassesCount) => [school.name, school.address];

// Lista de escolas com busca e exclusão.
export function useSchools() {
  const { data, setData, loading, error, reload } = useAsyncData<SchoolWithClassesCount[]>(
    listSchools,
    [],
    'Não foi possível carregar as escolas. Verifique se a API está rodando (yarn api).'
  );
  const search = useSearch(data, { fields: searchFields });
  const deletion = useConfirmDelete<SchoolWithClassesCount>(deleteSchool, {
    errorMessage: 'Não foi possível excluir a escola.',
    onDeleted: (school) => setData((current) => current.filter((item) => item.id !== school.id)),
  });

  return { schools: search.results, loading, error, reload, search, deletion };
}
