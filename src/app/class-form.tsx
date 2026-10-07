import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';

import { FormField } from '@/components/form-field';
import { OptionPicker } from '@/components/option-picker';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { createClass, getClass, updateClass } from '@/features/classes/api';
import { SHIFTS, type Shift } from '@/features/classes/types';
import { listSchools } from '@/features/schools/api';
import type { School } from '@/features/schools/types';
import { goBack } from '@/lib/navigation';

type Field = 'name' | 'shift' | 'year' | 'schoolId';
type Errors = Partial<Record<Field, string>>;

export default function ClassFormScreen() {
  // id: editar uma classe existente. schoolId: nova classe já vinculada a uma escola.
  const params = useLocalSearchParams<{ id?: string; schoolId?: string }>();
  const isEditing = Boolean(params.id);
  const isSchoolLocked = !isEditing && Boolean(params.schoolId);

  const [name, setName] = useState('');
  const [shift, setShift] = useState<Shift | undefined>();
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [schoolId, setSchoolId] = useState(params.schoolId);
  const [schools, setSchools] = useState<School[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [schoolsData, schoolClass] = await Promise.all([
          listSchools(),
          params.id ? getClass(params.id) : undefined,
        ]);
        setSchools(schoolsData);
        if (schoolClass) {
          setName(schoolClass.name);
          setShift(schoolClass.shift);
          setYear(String(schoolClass.year));
          setSchoolId(schoolClass.schoolId);
        }
      } catch {
        Alert.alert('Erro', 'Não foi possível carregar os dados do formulário.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id]);

  const validate = () => {
    const next: Errors = {};
    const yearNumber = Number(year);
    if (!name.trim()) next.name = 'Informe o nome da classe.';
    if (!shift) next.shift = 'Selecione o turno.';
    if (!/^\d{4}$/.test(year) || yearNumber < 2000 || yearNumber > 2100) {
      next.year = 'Informe um ano letivo válido (ex.: 2026).';
    }
    if (!schoolId) next.schoolId = 'Selecione a escola.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !shift || !schoolId) return;

    setSaving(true);
    try {
      const input = { name: name.trim(), shift, year: Number(year), schoolId };
      if (params.id) {
        await updateClass(params.id, input);
      } else {
        await createClass(input);
      }
      goBack();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a classe.');
      setSaving(false);
    }
  };

  const schoolOptions = schools
    .filter((school) => !isSchoolLocked || school.id === schoolId)
    .map((school) => ({ value: school.id, label: school.name }));

  return (
    <>
      <Stack.Screen options={{ title: isEditing ? 'Editar classe' : 'Nova classe' }} />

      {loading ? (
        <ActivityIndicator className="flex-1 bg-background" />
      ) : (
        <ScrollView
          className="flex-1 bg-background"
          contentContainerClassName="gap-4 p-4"
          keyboardShouldPersistTaps="handled">
          <FormField
            label="Nome da classe"
            value={name}
            onChangeText={setName}
            error={errors.name}
            placeholder="Ex.: 1º Ano A"
          />
          <OptionPicker
            label="Turno"
            options={[...SHIFTS]}
            value={shift}
            onChange={(value) => setShift(value as Shift)}
            error={errors.shift}
          />
          <FormField
            label="Ano letivo"
            value={year}
            onChangeText={setYear}
            error={errors.year}
            placeholder="Ex.: 2026"
            keyboardType="number-pad"
            maxLength={4}
          />
          {schoolOptions.length > 0 ? (
            <OptionPicker
              label="Escola"
              options={schoolOptions}
              value={schoolId}
              onChange={setSchoolId}
              error={errors.schoolId}
              disabled={isSchoolLocked}
            />
          ) : (
            <Text className="text-sm text-destructive">
              Cadastre uma escola antes de adicionar classes.
            </Text>
          )}

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
