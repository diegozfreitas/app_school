import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import type { School } from '../types';

// Cabeçalho da tela da escola: nome, endereço e total de classes.
export function SchoolSummary({ school, classesCount }: { school: School; classesCount: number }) {
  return (
    <VStack className="gap-1 pb-2">
      <Heading size="2xl">{school.name}</Heading>
      <Text size="sm" className="text-muted-foreground">
        {school.address}
      </Text>
      <Heading size="md" className="pt-3">
        Classes ({classesCount})
      </Heading>
    </VStack>
  );
}
