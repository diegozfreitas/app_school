import { useEffect, useState } from 'react';

import { listSchools } from '@/features/schools/api';
import type { School } from '@/features/schools/types';
import { useErrorToast } from '@/hooks/use-error-toast';
import { writeErrorMessage } from '@/lib/api-client';

import { createClass, getClass, updateClass } from '../api';
import type { Shift } from '../types';

type Field = 'name' | 'shift' | 'year' | 'schoolId';
type Errors = Partial<Record<Field, string>>;

type Params = {
  // Editar uma classe existente.
  id?: string;
  // Nova classe já vinculada a uma escola (a escola não pode ser trocada).
  schoolId?: string;
};

// Estado, validação e envio do formulário de classe.
export function useClassForm(params: Params, { onSaved }: { onSaved: () => void }) {
  const isEditing = Boolean(params.id);
  const isSchoolLocked = !isEditing && Boolean(params.schoolId);

  const [name, setName] = useState('');
  const [shift, setShift] = useState<Shift | undefined>();
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [schoolId, setSchoolId] = useState(params.schoolId);
  const [schools, setSchools] = useState<School[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const showError = useErrorToast();

  useEffect(() => {
    const load = async () => {
      try {
        const [schoolsData, schoolClass] = await Promise.all([
          listSchools(),
          params.id ? getClass(params.id) : undefined,
        ]);
        setSchools(schoolsData);
        if (schoolClass) {
          setName(schoolClass.name);
          setShift(schoolClass.shift);
          setYear(String(schoolClass.year));
          setSchoolId(schoolClass.schoolId);
        }
      } catch {
        showError('Não foi possível carregar os dados do formulário.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id, showError]);

  const validate = () => {
    const next: Errors = {};
    const yearNumber = Number(year);
    if (!name.trim()) next.name = 'Informe o nome da classe.';
    if (!shift) next.shift = 'Selecione o turno.';
    if (!/^\d{4}$/.test(year) || yearNumber < 2000 || yearNumber > 2100) {
      next.year = 'Informe um ano letivo válido (ex.: 2026).';
    }
    if (!schoolId) next.schoolId = 'Selecione a escola.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate() || !shift || !schoolId) return;

    setSaving(true);
    try {
      const input = { name: name.trim(), shift, year: Number(year), schoolId };
      if (params.id) {
        await updateClass(params.id, input);
      } else {
        await createClass(input);
      }
      onSaved();
    } catch (error) {
      showError(writeErrorMessage(error, 'Não foi possível salvar a classe.'));
      setSaving(false);
    }
  };

  // Escolas oferecidas no seletor: só a de origem quando a escola está travada.
  const schoolOptions = schools
    .filter((school) => !isSchoolLocked || school.id === schoolId)
    .map((school) => ({ value: school.id, label: school.name }));

  return {
    isEditing,
    isSchoolLocked,
    name,
    setName,
    shift,
    setShift,
    year,
    setYear,
    schoolId,
    setSchoolId,
    schoolName: schools.find((school) => school.id === schoolId)?.name,
    schoolOptions,
    errors,
    loading,
    saving,
    submit,
  };
}

export type ClassFormState = ReturnType<typeof useClassForm>;
