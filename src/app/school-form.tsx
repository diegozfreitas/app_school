import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { FormField } from '@/components/form-field';
import { Box } from '@/components/ui/box';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { HStack } from '@/components/ui/hstack';
import { ScrollView } from '@/components/ui/scroll-view';
import { Spinner } from '@/components/ui/spinner';
import { OfflineBanner } from '@/features/offline/components/offline-banner';
import { createSchool, getSchool, updateSchool } from '@/features/schools/api';
import { useErrorToast } from '@/hooks/use-error-toast';
import { writeErrorMessage } from '@/lib/api-client';
import { goBack } from '@/lib/navigation';

type Field = 'name' | 'address';
type Errors = Partial<Record<Field, string>>;

export default function SchoolFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = Boolean(id);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const showError = useErrorToast();

  useEffect(() => {
    if (!id) return;
    getSchool(id)
      .then((school) => {
        setName(school.name);
        setAddress(school.address);
      })
      .catch(() => showError('Não foi possível carregar a escola.'))
      .finally(() => setLoading(false));
  }, [id, showError]);

  const validate = () => {
    const next: Errors = {};
    if (!name.trim()) next.name = 'Informe o nome da escola.';
    if (!address.trim()) next.address = 'Informe o endereço da escola.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const input = { name: name.trim(), address: address.trim() };
      if (id) {
        await updateSchool(id, input);
      } else {
        await createSchool(input);
      }
      goBack();
    } catch (error) {
      showError(writeErrorMessage(error, 'Não foi possível salvar a escola.'));
      setSaving(false);
    }
  };

  return (
    <Box className="flex-1 bg-background">
      <Stack.Screen options={{ title: isEditing ? 'Editar escola' : 'Nova escola' }} />
      <OfflineBanner />

      {loading ? (
        <Center className="flex-1">
          <Spinner size="large" />
        </Center>
      ) : (
        <ScrollView className="flex-1" contentContainerClassName="gap-4 p-4" keyboardShouldPersistTaps="handled">
          <FormField
            label="Nome"
            value={name}
            onChangeText={setName}
            error={errors.name}
            placeholder="Ex.: Escola Municipal Monteiro Lobato"
          />
          <FormField
            label="Endereço"
            value={address}
            onChangeText={setAddress}
            error={errors.address}
            placeholder="Ex.: Rua das Flores, 120 - Centro"
          />

          <HStack className="mt-2 justify-end gap-2">
            <Button variant="outline" onPress={() => goBack()} isDisabled={saving}>
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button onPress={handleSubmit} isDisabled={saving}>
              {saving && <ButtonSpinner />}
              <ButtonText>Salvar</ButtonText>
            </Button>
          </HStack>
        </ScrollView>
      )}
    </Box>
  );
}
