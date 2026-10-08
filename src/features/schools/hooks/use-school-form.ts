import { useEffect, useState } from 'react';

import { useErrorToast } from '@/hooks/use-error-toast';
import { writeErrorMessage } from '@/lib/api-client';

import { createSchool, getSchool, updateSchool } from '../api';

type Field = 'name' | 'address';
type Errors = Partial<Record<Field, string>>;

// Estado, validação e envio do formulário de escola (cadastro quando `id` é vazio, senão edição).
export function useSchoolForm(id: string | undefined, { onSaved }: { onSaved: () => void }) {
  const isEditing = Boolean(id);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const showError = useErrorToast();

  useEffect(() => {
    if (!id) return;
    getSchool(id)
      .then((school) => {
        setName(school.name);
        setAddress(school.address);
      })
      .catch(() => showError('Não foi possível carregar a escola.'))
      .finally(() => setLoading(false));
  }, [id, showError]);

  const validate = () => {
    const next: Errors = {};
    if (!name.trim()) next.name = 'Informe o nome da escola.';
    if (!address.trim()) next.address = 'Informe o endereço da escola.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const input = { name: name.trim(), address: address.trim() };
      if (id) {
        await updateSchool(id, input);
      } else {
        await createSchool(input);
      }
      onSaved();
    } catch (error) {
      showError(writeErrorMessage(error, 'Não foi possível salvar a escola.'));
      setSaving(false);
    }
  };

  return { isEditing, name, setName, address, setAddress, errors, loading, saving, submit };
}

export type SchoolFormState = ReturnType<typeof useSchoolForm>;
