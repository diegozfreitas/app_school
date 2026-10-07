import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { Button, ButtonText } from '@/components/ui/button';
import { BottomTabInset } from '@/constants/theme';
import { deleteClass, listClasses } from '@/features/classes/api';
import { ClassCard } from '@/features/classes/components/class-card';
import type { SchoolClassWithSchool } from '@/features/classes/types';

export default function ClassesScreen() {
  const [classes, setClasses] = useState<SchoolClassWithSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classToDelete, setClassToDelete] = useState<SchoolClassWithSchool | null>(null);

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
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir a classe.');
    }
  };

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-background web:pt-20"
      style={{ paddingBottom: BottomTabInset }}>
      <Text className="px-4 pb-2 pt-4 text-2xl font-semibold text-foreground">Classes</Text>

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
          data={classes}
          keyExtractor={(item) => item.id}
          contentContainerClassName="grow gap-3 p-4"
          refreshing={loading}
          onRefresh={load}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <Text className="text-muted-foreground">Nenhuma classe cadastrada</Text>
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
    </SafeAreaView>
  );
}
