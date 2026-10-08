import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-screens/experimental';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { FlatList } from '@/components/ui/flat-list';
import { Heading } from '@/components/ui/heading';
import { AddIcon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { deleteClass, listClassesBySchool } from '@/features/classes/api';
import { ClassCard } from '@/features/classes/components/class-card';
import type { SchoolClass } from '@/features/classes/types';
import { OfflineBanner } from '@/features/offline/components/offline-banner';
import { getSchool } from '@/features/schools/api';
import type { School } from '@/features/schools/types';
import { useErrorToast } from '@/hooks/use-error-toast';
import { writeErrorMessage } from '@/lib/api-client';

export default function SchoolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [school, setSchool] = useState<School | null>(null);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classToDelete, setClassToDelete] = useState<SchoolClass | null>(null);
  const showError = useErrorToast();

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
    } catch (error) {
      showError(writeErrorMessage(error, 'Não foi possível excluir a classe.'));
    }
  };

  return (
    <Box className="flex-1 bg-background">
      <SafeAreaView edges={{ bottom: true }} style={{ flex: 1 }}>
        <Stack.Screen options={{ title: school?.name ?? 'Escola' }} />
        <OfflineBanner />

        {loading && !school ? (
          <Center className="flex-1">
            <Spinner size="large" />
          </Center>
        ) : error || !school ? (
          <Center className="flex-1 gap-4 px-6">
            <Text className="text-center text-muted-foreground">{error}</Text>
            <Button variant="outline" onPress={load}>
              <ButtonText>Tentar novamente</ButtonText>
            </Button>
          </Center>
        ) : (
          <FlatList
            data={classes}
            keyExtractor={(item) => item.id}
            contentContainerClassName="grow gap-3 p-4"
            refreshing={loading}
            onRefresh={load}
            ListHeaderComponent={
              <VStack className="gap-1 pb-2">
                <Heading size="2xl">{school.name}</Heading>
                <Text size="sm" className="text-muted-foreground">
                  {school.address}
                </Text>
                <Heading size="md" className="pt-3">
                  Classes ({classes.length})
                </Heading>
              </VStack>
            }
            ListEmptyComponent={
              <Center className="flex-1 py-8">
                <Text className="text-muted-foreground">Nenhuma classe cadastrada nesta escola</Text>
              </Center>
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
          <Box className="border-t border-border p-4">
            <Button
              size="lg"
              onPress={() => router.push({ pathname: '/class-form', params: { schoolId: school.id } })}>
              <ButtonIcon as={AddIcon} />
              <ButtonText>Adicionar nova classe</ButtonText>
            </Button>
          </Box>
        )}

        <ConfirmDialog
          isOpen={classToDelete !== null}
          title="Excluir classe"
          message={`Excluir a classe "${classToDelete?.name}"?`}
          onCancel={() => setClassToDelete(null)}
          onConfirm={handleDelete}
        />
      </SafeAreaView>
    </Box>
  );
}
