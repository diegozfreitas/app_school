import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, View } from 'react-native';

import { FormField } from '@/components/form-field';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { createSchool, getSchool, updateSchool } from '@/features/schools/api';
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

  useEffect(() => {
    if (!id) return;
    getSchool(id)
      .then((school) => {
        setName(school.name);
        setAddress(school.address);
      })
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar a escola.'))
      .finally(() => setLoading(false));
  }, [id]);

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
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a escola.');
      setSaving(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: isEditing ? 'Editar escola' : 'Nova escola' }} />

      {loading ? (
        <ActivityIndicator className="flex-1 bg-background" />
      ) : (
        <ScrollView
          className="flex-1 bg-background"
          contentContainerClassName="gap-4 p-4"
          keyboardShouldPersistTaps="handled">
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

          <View className="mt-2 flex-row justify-end gap-2">
            <Button variant="outline" onPress={() => goBack()} isDisabled={saving}>
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button onPress={handleSubmit} isDisabled={saving}>
              {saving && <ButtonSpinner />}
              <ButtonText>Salvar</ButtonText>
            </Button>
          </View>
        </ScrollView>
      )}
    </>
  );
}
