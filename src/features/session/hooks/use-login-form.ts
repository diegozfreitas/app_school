import { useState } from 'react';

import { useSession } from '../session-context';

const MIN_NAME_LENGTH = 2;

// Estado e validação da tela de identificação do gestor.
export function useLoginForm({ onSignedIn }: { onSignedIn: () => void }) {
  const { signIn } = useSession();
  const [name, setName] = useState('');
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (name.trim().length < MIN_NAME_LENGTH) {
      setError('Informe seu nome para continuar.');
      return;
    }
    setError(undefined);
    setSubmitting(true);
    await signIn(name);
    onSignedIn();
  };

  return { name, setName, error, submitting, submit };
}
