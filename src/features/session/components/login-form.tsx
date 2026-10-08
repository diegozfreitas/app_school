import { FormField } from '@/components/form-field';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import { useLoginForm } from '../hooks/use-login-form';

// Identificação de quem está gerenciando o app (não há senha: é só o nome do gestor).
export function LoginForm({ onSignedIn }: { onSignedIn: () => void }) {
  const form = useLoginForm({ onSignedIn });

  return (
    <VStack className="w-full max-w-100 gap-6">
      <VStack className="gap-1">
        <Heading size="3xl">App School</Heading>
        <Text className="text-muted-foreground">
          Cadastro das escolas públicas e suas classes. Para começar, diga quem está gerenciando.
        </Text>
      </VStack>

      <FormField
        label="Seu nome"
        value={form.name}
        onChangeText={form.setName}
        error={form.error}
        placeholder="Ex.: Maria Silva"
        autoCapitalize="words"
        autoComplete="name"
        returnKeyType="go"
        onSubmitEditing={form.submit}
      />

      <Button size="lg" onPress={form.submit} isDisabled={form.submitting}>
        {form.submitting && <ButtonSpinner />}
        <ButtonText>Entrar</ButtonText>
      </Button>
    </VStack>
  );
}
