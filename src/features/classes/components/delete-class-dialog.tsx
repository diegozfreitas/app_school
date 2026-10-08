import { ConfirmDialog } from '@/components/confirm-dialog';

import type { SchoolClass } from '../types';

type DeleteClassDialogProps = {
  schoolClass: SchoolClass | null;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
};

export function DeleteClassDialog({ schoolClass, onCancel, onConfirm }: DeleteClassDialogProps) {
  return (
    <ConfirmDialog
      isOpen={schoolClass !== null}
      title="Excluir classe"
      message={`Excluir a classe "${schoolClass?.name}"?`}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
