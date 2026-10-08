import { useState } from 'react';

import { useErrorToast } from '@/hooks/use-error-toast';
import { writeErrorMessage } from '@/lib/api-client';

type Options<T> = {
  onDeleted: (item: T) => void;
  errorMessage: string;
};

// Fluxo "pedir confirmação → excluir → avisar erro" usado pelos diálogos de exclusão.
export function useConfirmDelete<T extends { id: string }>(
  remove: (id: string) => Promise<unknown>,
  { onDeleted, errorMessage }: Options<T>
) {
  const [target, setTarget] = useState<T | null>(null);
  const showError = useErrorToast();

  const confirm = async () => {
    if (!target) return;
    try {
      await remove(target.id);
      onDeleted(target);
      setTarget(null);
    } catch (error) {
      showError(writeErrorMessage(error, errorMessage));
    }
  };

  return { target, request: setTarget, cancel: () => setTarget(null), confirm };
}
