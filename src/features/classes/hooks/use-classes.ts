import { useState } from 'react';

import { useAsyncData } from '@/hooks/use-async-data';
import { useConfirmDelete } from '@/hooks/use-confirm-delete';
import { useSearch } from '@/hooks/use-search';

import { deleteClass, listClasses } from '../api';
import type { SchoolClassWithSchool, Shift } from '../types';

const searchFields = (item: SchoolClassWithSchool) => [item.name, item.school?.name];

// Todas as classes, com busca (classe ou escola), filtro por turno e exclusão.
export function useClasses() {
  const { data, setData, loading, error, reload } = useAsyncData<SchoolClassWithSchool[]>(
    listClasses,
    [],
    'Não foi possível carregar as classes. Verifique se a API está rodando (yarn api).'
  );
  const [shift, setShift] = useState<Shift | null>(null);
  const search = useSearch(data, {
    fields: searchFields,
    filter: (item) => shift === null || item.shift === shift,
  });
  const deletion = useConfirmDelete<SchoolClassWithSchool>(deleteClass, {
    errorMessage: 'Não foi possível excluir a classe.',
    onDeleted: (removed) => setData((current) => current.filter((item) => item.id !== removed.id)),
  });

  return {
    classes: search.results,
    loading,
    error,
    reload,
    filters: { query: search.query, setQuery: search.setQuery, shift, setShift },
    isFiltering: search.hasQuery || shift !== null,
    deletion,
  };
}
