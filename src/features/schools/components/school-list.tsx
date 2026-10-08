import { DataList } from '@/components/data-list';

import type { SchoolWithClassesCount } from '../types';
import { SchoolCard } from './school-card';

type SchoolListProps = {
  schools: SchoolWithClassesCount[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  // Termo da busca ativa, para a mensagem de lista vazia.
  searchQuery?: string;
  onOpen: (school: SchoolWithClassesCount) => void;
  onEdit: (school: SchoolWithClassesCount) => void;
  onDelete: (school: SchoolWithClassesCount) => void;
};

export function SchoolList({ schools, searchQuery, onOpen, onEdit, onDelete, ...state }: SchoolListProps) {
  const term = searchQuery?.trim();

  return (
    <DataList
      {...state}
      data={schools}
      emptyMessage={term ? `Nenhuma escola encontrada para "${term}"` : 'Nenhuma escola cadastrada'}
      renderItem={(school) => (
        <SchoolCard
          item={school}
          onPress={() => onOpen(school)}
          onEdit={() => onEdit(school)}
          onDelete={() => onDelete(school)}
        />
      )}
    />
  );
}
