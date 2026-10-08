import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { FilterChips } from '@/components/filter-chips';
import { SearchInput } from '@/components/search-input';
import { TabScreen } from '@/components/tab-screen';
import { Button, ButtonText } from '@/components/ui/button';
import { deleteClass, listClasses } from '@/features/classes/api';
import { ClassCard } from '@/features/classes/components/class-card';
import { SHIFTS, type SchoolClassWithSchool, type Shift } from '@/features/classes/types';
import { useSearch } from '@/hooks/use-search';
import { writeErrorMessage } from '@/lib/api-client';

const searchFields = (item: SchoolClassWithSchool) => [item.name, item.school?.name];

export default function ClassesScreen() {
  const [classes, setClasses] = useState<SchoolClassWithSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classToDelete, setClassToDelete] = useState<SchoolClassWithSchool | null>(null);
  const [shift, setShift] = useState<Shift | null>(null);
  const { query, setQuery, results, hasQuery } = useSearch(classes, {
    fields: searchFields,
    filter: (item) => shift === null || item.shift === shift,
  });
  const isFiltering = hasQuery || shift !== null;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setClasses(await listClasses());
    } catch {
      setError('Não foi possível carregar as classes. Verifique se a API está rodando (yarn api).');
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
    if (!classToDelete) return;
    try {
      await deleteClass(classToDelete.id);
      setClasses((current) => current.filter((item) => item.id !== classToDelete.id));
      setClassToDelete(null);
    } catch (error) {
      Alert.alert('Erro', writeErrorMessage(error, 'Não foi possível excluir a classe.'));
    }
  };

  return (
    <TabScreen>
      <Text className="px-4 pb-2 pt-4 text-2xl font-semibold text-foreground">Classes</Text>
      <View className="gap-2 px-4 pb-1">
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar por classe ou escola"
        />
        <FilterChips options={SHIFTS} value={shift} onChange={setShift} />
      </View>

      {loading && classes.length === 0 ? (
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
          keyExtractor={(item) => item.id}
          contentContainerClassName="grow gap-3 p-4"
          refreshing={loading}
          onRefresh={load}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <Text className="text-center text-muted-foreground">
                {isFiltering ? 'Nenhuma classe encontrada com esses filtros' : 'Nenhuma classe cadastrada'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ClassCard
              item={item}
              onOpenSchool={() =>
                router.push({ pathname: '/schools/[id]', params: { id: item.schoolId } })
              }
              onEdit={() => router.push({ pathname: '/class-form', params: { id: item.id } })}
              onDelete={() => setClassToDelete(item)}
            />
          )}
        />
      )}

      <View className="border-t border-border p-4">
        <Button size="lg" onPress={() => router.push('/class-form')}>
          <ButtonText>Adicionar nova classe</ButtonText>
        </Button>
      </View>

      <ConfirmDialog
        isOpen={classToDelete !== null}
        title="Excluir classe"
        message={`Excluir a classe "${classToDelete?.name}"?`}
        onCancel={() => setClassToDelete(null)}
        onConfirm={handleDelete}
      />
    </TabScreen>
  );
}
