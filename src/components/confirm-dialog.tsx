import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onCancel: () => void;
  // Pode ser assíncrono: o botão mostra um spinner até a promise terminar.
  onConfirm: () => void | Promise<void>;
};

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Excluir',
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false);
  // Mantém o último texto enquanto a animação de saída roda (o item já foi limpo pela tela).
  const [content, setContent] = useState({ title, message });
  if (isOpen && (content.title !== title || content.message !== message)) {
    setContent({ title, message });
  }

  const handleConfirm = async () => {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  };

  return (
    <AlertDialog isOpen={isOpen} onClose={busy ? undefined : onCancel} size="md">
      <AlertDialogBackdrop />
      <AlertDialogContent className="gap-3" testID="confirm-dialog">
        <AlertDialogHeader>
          <Heading size="md">{content.title}</Heading>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text size="sm" className="text-muted-foreground">{content.message}</Text>
        </AlertDialogBody>
        <AlertDialogFooter className="mt-2">
          <Button variant="outline" onPress={onCancel} isDisabled={busy}>
            <ButtonText>Cancelar</ButtonText>
          </Button>
          <Button variant="destructive" onPress={handleConfirm} isDisabled={busy}>
            {busy && <ButtonSpinner color="white" />}
            <ButtonText>{confirmLabel}</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
