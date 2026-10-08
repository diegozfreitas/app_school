import type { ReactNode } from 'react';

import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';

type ScreenHeaderProps = {
  title: string;
  // Conteúdo à direita do título (ex.: menu do gestor).
  action?: ReactNode;
  // Conteúdo abaixo do título (ex.: busca e filtros).
  children?: ReactNode;
};

// Título das telas de aba, com espaço para busca/filtros logo abaixo.
export function ScreenHeader({ title, action, children }: ScreenHeaderProps) {
  return (
    <VStack className="gap-2 px-4 pb-1 pt-4">
      <HStack className="items-center justify-between gap-2">
        <Heading size="2xl">{title}</Heading>
        {action}
      </HStack>
      {children}
    </VStack>
  );
}
