import { useCallback } from 'react';

import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';

// Exibe erros com o Toast do gluestack (o Alert nativo não aparece na web).
export function useErrorToast() {
  const toast = useToast();

  return useCallback(
    (description: string, title = 'Erro') => {
      toast.show({
        placement: 'top',
        duration: 4000,
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="error" variant="solid">
            <ToastTitle>{title}</ToastTitle>
            <ToastDescription>{description}</ToastDescription>
          </Toast>
        ),
      });
    },
    [toast]
  );
}
