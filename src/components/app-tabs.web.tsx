import { TabList, TabSlot, TabTrigger, Tabs, type TabTriggerSlotProps } from 'expo-router/ui';
import type { ComponentProps } from 'react';

import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';

// Na web as abas ficam numa barra fixa no topo (no celular são as abas nativas, em app-tabs.tsx).
export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Escolas</TabButton>
          </TabTrigger>
          <TabTrigger name="classes" href="/classes" asChild>
            <TabButton>Classes</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

// O `ref` do TabTrigger tem um tipo diferente do esperado pelo Pressable do gluestack; não é
// necessário aqui, então fica de fora.
function TabButton({ children, isFocused, ref: _ref, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable
      {...props}
      className={`rounded-md px-3 py-1.5 data-[active=true]:opacity-70 ${isFocused ? 'bg-background' : ''}`}>
      <Text size="sm" className={isFocused ? 'font-medium text-foreground' : 'text-muted-foreground'}>
        {children}
      </Text>
    </Pressable>
  );
}

function CustomTabList({ children, ...props }: ComponentProps<typeof Box>) {
  return (
    <Box {...props} className="absolute w-full flex-row justify-center p-3">
      <HStack className="w-full max-w-200 items-center gap-2 rounded-xl bg-muted px-5 py-2">
        <Heading size="sm" className="mr-auto">
          App School
        </Heading>
        {children}
      </HStack>
    </Box>
  );
}
