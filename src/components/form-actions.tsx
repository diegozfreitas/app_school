import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';

type FormActionsProps = {
  saving: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

export function FormActions({ saving, onCancel, onSubmit }: FormActionsProps) {
  return (
    <HStack className="mt-2 justify-end gap-2">
      <Button variant="outline" onPress={onCancel} isDisabled={saving}>
        <ButtonText>Cancelar</ButtonText>
      </Button>
      <Button onPress={onSubmit} isDisabled={saving}>
        {saving && <ButtonSpinner />}
        <ButtonText>Salvar</ButtonText>
      </Button>
    </HStack>
  );
}
