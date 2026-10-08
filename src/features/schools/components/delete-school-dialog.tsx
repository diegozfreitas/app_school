import { ConfirmDialog } from '@/components/confirm-dialog';

import type { School } from '../types';

type DeleteSchoolDialogProps = {
  school: School | null;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
};

export function DeleteSchoolDialog({ school, onCancel, onConfirm }: DeleteSchoolDialogProps) {
  return (
    <ConfirmDialog
      isOpen={school !== null}
      title="Excluir escola"
      message={`Excluir "${school?.name}"? As classes vinculadas também serão excluídas.`}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
