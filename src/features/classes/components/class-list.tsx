import type { ReactElement } from 'react';

import { DataList } from '@/components/data-list';

import type { SchoolClassWithSchool } from '../types';
import { ClassCard } from './class-card';

type ClassListProps = {
  classes: SchoolClassWithSchool[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  // Busca/filtro ativos: muda a mensagem de lista vazia.
  isFiltering?: boolean;
  emptyMessage?: string;
  header?: ReactElement | null;
  onEdit: (item: SchoolClassWithSchool) => void;
  onDelete: (item: SchoolClassWithSchool) => void;
  // Quando informado, cada card mostra a escola como link.
  onOpenSchool?: (item: SchoolClassWithSchool) => void;
};

export function ClassList({
  classes,
  isFiltering = false,
  emptyMessage = 'Nenhuma classe cadastrada',
  onEdit,
  onDelete,
  onOpenSchool,
  ...state
}: ClassListProps) {
  return (
    <DataList
      {...state}
      data={classes}
      emptyMessage={isFiltering ? 'Nenhuma classe encontrada com esses filtros' : emptyMessage}
      renderItem={(item) => (
        <ClassCard
          item={item}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item)}
          onOpenSchool={onOpenSchool && (() => onOpenSchool(item))}
        />
      )}
    />
  );
}
