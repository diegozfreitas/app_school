import { offlineDb } from '@/features/offline/offline-db';
import { request, withOfflineFallback } from '@/lib/api-client';

import type { SchoolClass, SchoolClassInput, SchoolClassWithSchool } from './types';

const ORDER = '_sort=-year,name';

export function listClasses() {
  return withOfflineFallback(
    async () => {
      const classes = await request<SchoolClassWithSchool[]>(`/classes?_embed=school&${ORDER}`);
      await offlineDb.replaceClasses(
        classes,
        classes.flatMap((item) => (item.school ? [item.school] : []))
      );
      return classes;
    },
    () => offlineDb.listClasses()
  );
}

export function listClassesBySchool(schoolId: string) {
  return withOfflineFallback(
    async () => {
      // `?schoolId=1` não funciona: o json-server converte "1" em número e não encontra o id em texto.
      // Com `_where` o valor continua sendo string.
      const where = encodeURIComponent(JSON.stringify({ schoolId: { eq: schoolId } }));
      const classes = await request<SchoolClass[]>(`/classes?_where=${where}&${ORDER}`);
      await offlineDb.replaceSchoolClasses(schoolId, classes);
      return classes;
    },
    () => offlineDb.listClassesBySchool(schoolId)
  );
}

export function getClass(id: string) {
  return withOfflineFallback(
    async () => {
      const schoolClass = await request<SchoolClass>(`/classes/${id}`);
      await offlineDb.saveClasses([schoolClass]);
      return schoolClass;
    },
    () => offlineDb.getClass(id)
  );
}

export async function createClass(input: SchoolClassInput) {
  const schoolClass = await request<SchoolClass>('/classes', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  await offlineDb.saveClasses([schoolClass]);
  return schoolClass;
}

export async function updateClass(id: string, input: SchoolClassInput) {
  const schoolClass = await request<SchoolClass>(`/classes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
  await offlineDb.saveClasses([schoolClass]);
  return schoolClass;
}

export async function deleteClass(id: string) {
  const schoolClass = await request<SchoolClass>(`/classes/${id}`, { method: 'DELETE' });
  await offlineDb.removeClass(id);
  return schoolClass;
}
