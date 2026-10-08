import type { ReactElement } from 'react';

import { LoadingState } from '@/components/loading-state';
import { Button, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { FlatList } from '@/components/ui/flat-list';
import { Text } from '@/components/ui/text';

type DataListProps<T> = {
  data: T[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  emptyMessage: string;
  renderItem: (item: T) => ReactElement;
  header?: ReactElement | null;
};

// Lista com os estados padrão das telas: carregando, erro com "Tentar novamente", vazia e
// "puxar para atualizar".
export function DataList<T extends { id: string }>({
  data,
  loading,
  error,
  onRefresh,
  emptyMessage,
  renderItem,
  header,
}: DataListProps<T>) {
  if (loading && data.length === 0) return <LoadingState />;

  if (error) {
    return (
      <Center className="flex-1 gap-4 px-6">
        <Text className="text-center text-muted-foreground">{error}</Text>
        <Button variant="outline" onPress={onRefresh}>
          <ButtonText>Tentar novamente</ButtonText>
        </Button>
      </Center>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="grow gap-3 p-4"
      refreshing={loading}
      onRefresh={onRefresh}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <Center className="flex-1 py-8">
          <Text className="text-center text-muted-foreground">{emptyMessage}</Text>
        </Center>
      }
      renderItem={({ item }) => renderItem(item)}
    />
  );
}
