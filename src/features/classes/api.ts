import { request } from '@/lib/api-client';

import type { SchoolClass, SchoolClassInput, SchoolClassWithSchool } from './types';

const ORDER = '_sort=-year,name';

export function listClasses() {
  return request<SchoolClassWithSchool[]>(`/classes?_embed=school&${ORDER}`);
}

export function listClassesBySchool(schoolId: string) {
  // `?schoolId=1` não funciona: o json-server converte "1" em número e não encontra o id em texto.
  // Com `_where` o valor continua sendo string.
  const where = encodeURIComponent(JSON.stringify({ schoolId: { eq: schoolId } }));
  return request<SchoolClass[]>(`/classes?_where=${where}&${ORDER}`);
}

export function getClass(id: string) {
  return request<SchoolClass>(`/classes/${id}`);
}

export function createClass(input: SchoolClassInput) {
  return request<SchoolClass>('/classes', { method: 'POST', body: JSON.stringify(input) });
}

export function updateClass(id: string, input: SchoolClassInput) {
  return request<SchoolClass>(`/classes/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
}

export function deleteClass(id: string) {
  return request<SchoolClass>(`/classes/${id}`, { method: 'DELETE' });
}
