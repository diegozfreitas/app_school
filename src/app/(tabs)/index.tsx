import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { SearchInput } from '@/components/search-input';
import { TabScreen } from '@/components/tab-screen';
import { Button, ButtonText } from '@/components/ui/button';
import { deleteSchool, listSchools } from '@/features/schools/api';
import { SchoolCard } from '@/features/schools/components/school-card';
import type { SchoolWithClassesCount } from '@/features/schools/types';
import { useSearch } from '@/hooks/use-search';
import { writeErrorMessage } from '@/lib/api-client';

const searchFields = (school: SchoolWithClassesCount) => [school.name, school.address];

export default function SchoolsScreen() {
  const [schools, setSchools] = useState<SchoolWithClassesCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schoolToDelete, setSchoolToDelete] = useState<SchoolWithClassesCount | null>(null);
  const { query, setQuery, results, hasQuery } = useSearch(schools, { fields: searchFields });

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
      Alert.alert('Erro', writeErrorMessage(error, 'Não foi possível excluir a escola.'));
    }
  };

  return (
    <TabScreen>
      <Text className="px-4 pb-2 pt-4 text-2xl font-semibold text-foreground">Escolas</Text>
      <View className="px-4 pb-1">
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar por nome ou endereço"
        />
      </View>

      {loading && schools.length === 0 ? (
        <ActivityIndicator className="flex-1" />
      ) : error ? (
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <Text className="text-center text-muted-foreground">{error}</Text>
          <Button variant="outline" onPress={load}>
            <ButtonText>Tentar novamente</ButtonText>
          </Button>
        </View>
      ) : (
        <FlatList
          data={results}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(school) => school.id}
          contentContainerClassName="grow gap-3 p-4"
          refreshing={loading}
          onRefresh={load}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <Text className="text-center text-muted-foreground">
                {hasQuery ? `Nenhuma escola encontrada para "${query.trim()}"` : 'Nenhuma escola cadastrada'}
              </Text>
            </View>
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

      <View className="border-t border-border p-4">
        <Button size="lg" onPress={() => router.push('/school-form')}>
          <ButtonText>Adicionar nova escola</ButtonText>
        </Button>
      </View>

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
