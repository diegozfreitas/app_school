import { useCallback } from 'react';

import { deleteClass, listClassesBySchool } from '@/features/classes/api';
import type { SchoolClass } from '@/features/classes/types';
import { useAsyncData } from '@/hooks/use-async-data';
import { useConfirmDelete } from '@/hooks/use-confirm-delete';

import { getSchool } from '../api';
import type { School } from '../types';

type SchoolDetails = { school: School | null; classes: SchoolClass[] };

// Dados da tela da escola: a escola e as classes dela, com exclusão de classe.
export function useSchoolDetails(schoolId: string) {
  const fetchDetails = useCallback(async (): Promise<SchoolDetails> => {
    const [school, classes] = await Promise.all([getSchool(schoolId), listClassesBySchool(schoolId)]);
    return { school, classes };
  }, [schoolId]);

  const { data, setData, loading, error, reload } = useAsyncData<SchoolDetails>(
    fetchDetails,
    { school: null, classes: [] },
    'Não foi possível carregar a escola. Verifique se a API está rodando (yarn api).'
  );

  const deletion = useConfirmDelete<SchoolClass>(deleteClass, {
    errorMessage: 'Não foi possível excluir a classe.',
    onDeleted: (removed) =>
      setData((current) => ({
        ...current,
        classes: current.classes.filter((item) => item.id !== removed.id),
      })),
  });

  return { school: data.school, classes: data.classes, loading, error, reload, deletion };
}
