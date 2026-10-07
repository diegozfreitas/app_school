import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { Button, ButtonText } from '@/components/ui/button';
import { deleteClass, listClassesBySchool } from '@/features/classes/api';
import { ClassCard } from '@/features/classes/class-card';
import type { SchoolClass } from '@/features/classes/types';
import { getSchool } from '@/features/schools/api';
import type { School } from '@/features/schools/types';

export default function SchoolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [school, setSchool] = useState<School | null>(null);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classToDelete, setClassToDelete] = useState<SchoolClass | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [schoolData, classesData] = await Promise.all([getSchool(id), listClassesBySchool(id)]);
      setSchool(schoolData);
      setClasses(classesData);
    } catch {
      setError('Não foi possível carregar a escola. Verifique se a API está rodando (yarn api).');
    } finally {
      setLoading(false);
    }
  }, [id]);

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
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir a classe.');
    }
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background">
      <Stack.Screen options={{ title: school?.name ?? 'Escola' }} />

      {loading && !school ? (
        <ActivityIndicator className="flex-1" />
      ) : error || !school ? (
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <Text className="text-center text-muted-foreground">{error}</Text>
          <Button variant="outline" onPress={load}>
            <ButtonText>Tentar novamente</ButtonText>
          </Button>
        </View>
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.id}
          contentContainerClassName="grow gap-3 p-4"
          refreshing={loading}
          onRefresh={load}
          ListHeaderComponent={
            <View className="gap-1 pb-2">
              <Text className="text-2xl font-semibold text-foreground">{school.name}</Text>
              <Text className="text-sm text-muted-foreground">{school.address}</Text>
              <Text className="pt-3 text-lg font-semibold text-foreground">
                Classes ({classes.length})
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-muted-foreground">Nenhuma classe cadastrada nesta escola</Text>
            </View>
          }
          renderItem={({ item }) => (
            <ClassCard
              item={item}
              onEdit={() => router.push({ pathname: '/class-form', params: { id: item.id } })}
              onDelete={() => setClassToDelete(item)}
            />
          )}
        />
      )}

      {school && (
        <View className="border-t border-border p-4">
          <Button
            size="lg"
            onPress={() => router.push({ pathname: '/class-form', params: { schoolId: school.id } })}>
            <ButtonText>Adicionar nova classe</ButtonText>
          </Button>
        </View>
      )}

      <ConfirmDialog
        isOpen={classToDelete !== null}
        title="Excluir classe"
        message={`Excluir a classe "${classToDelete?.name}"?`}
        onCancel={() => setClassToDelete(null)}
        onConfirm={handleDelete}
      />
    </SafeAreaView>
  );
}
