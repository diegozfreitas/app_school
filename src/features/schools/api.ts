import type { SchoolClass } from '@/features/classes/types';
import { offlineDb } from '@/features/offline/offline-db';
import { request, withOfflineFallback } from '@/lib/api-client';

import type { School, SchoolInput, SchoolWithClassesCount } from './types';

type SchoolWithClasses = School & { classes?: SchoolClass[] };

export function listSchools(): Promise<SchoolWithClassesCount[]> {
  return withOfflineFallback(
    async () => {
      const schools = await request<SchoolWithClasses[]>('/schools?_embed=classes&_sort=name');
      await offlineDb.replaceAll(
        schools,
        schools.flatMap((school) => school.classes ?? [])
      );
      return schools.map(({ classes, ...school }) => ({
        ...school,
        classesCount: classes?.length ?? 0,
      }));
    },
    () => offlineDb.listSchools()
  );
}

export function getSchool(id: string) {
  return withOfflineFallback(
    async () => {
      const school = await request<School>(`/schools/${id}`);
      await offlineDb.saveSchool(school);
      return school;
    },
    () => offlineDb.getSchool(id)
  );
}

export async function createSchool(input: SchoolInput) {
  const school = await request<School>('/schools', { method: 'POST', body: JSON.stringify(input) });
  await offlineDb.saveSchool(school);
  return school;
}

export async function updateSchool(id: string, input: SchoolInput) {
  const school = await request<School>(`/schools/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
  await offlineDb.saveSchool(school);
  return school;
}

// Exclui também as classes vinculadas à escola.
export async function deleteSchool(id: string) {
  const school = await request<School>(`/schools/${id}?_dependent=classes`, { method: 'DELETE' });
  await offlineDb.removeSchool(id);
  return school;
}
