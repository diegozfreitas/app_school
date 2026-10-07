import { request } from '@/lib/api-client';

import type { School, SchoolInput, SchoolWithClassesCount } from './types';

type SchoolWithClasses = School & { classes?: unknown[] };

export async function listSchools(): Promise<SchoolWithClassesCount[]> {
  const schools = await request<SchoolWithClasses[]>('/schools?_embed=classes&_sort=name');
  return schools.map(({ classes, ...school }) => ({
    ...school,
    classesCount: classes?.length ?? 0,
  }));
}

export function getSchool(id: string) {
  return request<School>(`/schools/${id}`);
}

export function createSchool(input: SchoolInput) {
  return request<School>('/schools', { method: 'POST', body: JSON.stringify(input) });
}

export function updateSchool(id: string, input: SchoolInput) {
  return request<School>(`/schools/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
}

// Exclui também as classes vinculadas à escola.
export function deleteSchool(id: string) {
  return request<School>(`/schools/${id}?_dependent=classes`, { method: 'DELETE' });
}
