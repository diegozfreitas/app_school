import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { SearchInput } from '@/components/search-input';
import { TabScreen } from '@/components/tab-screen';
import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { FlatList } from '@/components/ui/flat-list';
import { Heading } from '@/components/ui/heading';
import { AddIcon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { deleteSchool, listSchools } from '@/features/schools/api';
import { SchoolCard } from '@/features/schools/components/school-card';
import type { SchoolWithClassesCount } from '@/features/schools/types';
import { useErrorToast } from '@/hooks/use-error-toast';
import { useSearch } from '@/hooks/use-search';
import { writeErrorMessage } from '@/lib/api-client';

const searchFields = (school: SchoolWithClassesCount) => [school.name, school.address];

export default function SchoolsScreen() {
  const [schools, setSchools] = useState<SchoolWithClassesCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schoolToDelete, setSchoolToDelete] = useState<SchoolWithClassesCount | null>(null);
  const { query, setQuery, results, hasQuery } = useSearch(schools, { fields: searchFields });
  const showError = useErrorToast();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSchools(await listSchools());
    } catch {
      setError('Não foi possível carregar as escolas. Verifique se a API está rodando (yarn api).');
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarrega sempre que a tela volta ao foco (ex.: depois de salvar no formulário).
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleDelete = async () => {
    if (!schoolToDelete) return;
    try {
      await deleteSchool(schoolToDelete.id);
      setSchools((current) => current.filter((item) => item.id !== schoolToDelete.id));
      setSchoolToDelete(null);
    } catch (error) {
      showError(writeErrorMessage(error, 'Não foi possível excluir a escola.'));
    }
  };

  return (
    <TabScreen>
      <VStack className="gap-2 px-4 pb-1 pt-4">
        <Heading size="2xl">Escolas</Heading>
        <SearchInput value={query} onChangeText={setQuery} placeholder="Buscar por nome ou endereço" />
      </VStack>

      {loading && schools.length === 0 ? (
        <Center className="flex-1">
          <Spinner size="large" />
        </Center>
      ) : error ? (
        <Center className="flex-1 gap-4 px-6">
          <Text className="text-center text-muted-foreground">{error}</Text>
          <Button variant="outline" onPress={load}>
            <ButtonText>Tentar novamente</ButtonText>
          </Button>
        </Center>
      ) : (
        <FlatList
          data={results}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(school) => school.id}
          contentContainerClassName="grow gap-3 p-4"
          refreshing={loading}
          onRefresh={load}
          ListEmptyComponent={
            <Center className="flex-1">
              <Text className="text-center text-muted-foreground">
                {hasQuery ? `Nenhuma escola encontrada para "${query.trim()}"` : 'Nenhuma escola cadastrada'}
              </Text>
            </Center>
          }
          renderItem={({ item }) => (
            <SchoolCard
              item={item}
              onPress={() => router.push({ pathname: '/schools/[id]', params: { id: item.id } })}
              onEdit={() => router.push({ pathname: '/school-form', params: { id: item.id } })}
              onDelete={() => setSchoolToDelete(item)}
            />
          )}
        />
      )}

      <Box className="border-t border-border p-4">
        <Button size="lg" onPress={() => router.push('/school-form')}>
          <ButtonIcon as={AddIcon} />
          <ButtonText>Adicionar nova escola</ButtonText>
        </Button>
      </Box>

      <ConfirmDialog
        isOpen={schoolToDelete !== null}
        title="Excluir escola"
        message={`Excluir "${schoolToDelete?.name}"? As classes vinculadas também serão excluídas.`}
        onCancel={() => setSchoolToDelete(null)}
        onConfirm={handleDelete}
      />
    </TabScreen>
  );
}
