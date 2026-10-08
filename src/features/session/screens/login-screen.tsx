import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-screens/experimental';

import { Box } from '@/components/ui/box';
import { ScrollView } from '@/components/ui/scroll-view';

import { LoginForm } from '../components/login-form';

export function LoginScreen() {
  return (
    <Box className="flex-1 bg-background">
      <SafeAreaView edges={{ top: true, bottom: true }} style={{ flex: 1 }}>
        <ScrollView
          contentContainerClassName="grow items-center justify-center p-6"
          keyboardShouldPersistTaps="handled">
          <LoginForm onSignedIn={() => router.replace('/')} />
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
}
