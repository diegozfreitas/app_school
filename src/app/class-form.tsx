import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { FormField } from '@/components/form-field';
import { OptionPicker } from '@/components/option-picker';
import { Box } from '@/components/ui/box';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { HStack } from '@/components/ui/hstack';
import { ScrollView } from '@/components/ui/scroll-view';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { createClass, getClass, updateClass } from '@/features/classes/api';
import { SHIFTS, type Shift } from '@/features/classes/types';
import { OfflineBanner } from '@/features/offline/components/offline-banner';
import { listSchools } from '@/features/schools/api';
import type { School } from '@/features/schools/types';
import { useErrorToast } from '@/hooks/use-error-toast';
import { writeErrorMessage } from '@/lib/api-client';
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
  const showError = useErrorToast();

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
        showError('Não foi possível carregar os dados do formulário.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id, showError]);

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
    } catch (error) {
      showError(writeErrorMessage(error, 'Não foi possível salvar a classe.'));
      setSaving(false);
    }
  };

  const schoolOptions = schools
    .filter((school) => !isSchoolLocked || school.id === schoolId)
    .map((school) => ({ value: school.id, label: school.name }));

  return (
    <Box className="flex-1 bg-background">
      <Stack.Screen options={{ title: isEditing ? 'Editar classe' : 'Nova classe' }} />
      <OfflineBanner />

      {loading ? (
        <Center className="flex-1">
          <Spinner size="large" />
        </Center>
      ) : (
        <ScrollView className="flex-1" contentContainerClassName="gap-4 p-4" keyboardShouldPersistTaps="handled">
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
          {isEditing ? (
            // Na edição a escola não muda: só mostra a qual escola a classe pertence.
            <VStack className="gap-1.5">
              <Text size="sm" className="font-medium text-foreground">
                Escola
              </Text>
              <Text className="text-muted-foreground">
                {schools.find((school) => school.id === schoolId)?.name ?? '—'}
              </Text>
            </VStack>
          ) : schoolOptions.length > 0 ? (
            <OptionPicker
              label="Escola"
              options={schoolOptions}
              value={schoolId}
              onChange={setSchoolId}
              error={errors.schoolId}
              disabled={isSchoolLocked}
            />
          ) : (
            <Text size="sm" className="text-destructive">
              Cadastre uma escola antes de adicionar classes.
            </Text>
          )}

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
