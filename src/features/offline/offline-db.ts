import type { SchoolClass, SchoolClassWithSchool } from '@/features/classes/types';
import type { School, SchoolWithClassesCount } from '@/features/schools/types';
import { readCache, writeCache } from '@/lib/offline-cache';

// Cópia local (AsyncStorage) de escolas e classes, atualizada a cada resposta da API.
// Sem conexão, as telas montam as mesmas visões (listas, contagens, detalhes) a partir dela.
type Snapshot = { schools: School[]; classes: SchoolClass[] };

const KEY = 'snapshot';
const EMPTY: Snapshot = { schools: [], classes: [] };

// `null` = nada salvo ainda (ex.: app aberto pela primeira vez já sem rede).
function loadSaved() {
  return readCache<Snapshot>(KEY);
}

async function load(): Promise<Snapshot> {
  return (await loadSaved()) ?? EMPTY;
}

// Escritas em fila: duas respostas chegando juntas não sobrescrevem uma à outra.
let queue = Promise.resolve();
function update(change: (snapshot: Snapshot) => Snapshot) {
  queue = queue.then(async () => writeCache(KEY, change(await load())));
  return queue;
}

// Guarda só os campos da entidade (sem `school`, `classes`, `classesCount` embutidos).
const toSchool = ({ id, name, address }: School): School => ({ id, name, address });
const toClass = ({ id, schoolId, name, shift, year }: SchoolClass): SchoolClass => ({
  id,
  schoolId,
  name,
  shift,
  year,
});

function upsert<T extends { id: string }>(list: T[], items: T[]) {
  const ids = new Set(items.map((item) => item.id));
  return [...list.filter((item) => !ids.has(item.id)), ...items];
}

const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, 'pt-BR');
const byYearThenName = (a: SchoolClass, b: SchoolClass) => b.year - a.year || byName(a, b);

export const offlineDb = {
  // --- Atualização (após respostas bem-sucedidas da API) ---

  // A lista de escolas com `_embed=classes` traz as duas coleções completas.
  replaceAll(schools: School[], classes: SchoolClass[]) {
    return update(() => ({ schools: schools.map(toSchool), classes: classes.map(toClass) }));
  },

  // A lista de classes é completa; as escolas embutidas só complementam.
  replaceClasses(classes: SchoolClass[], schools: School[]) {
    return update((snapshot) => ({
      schools: upsert(snapshot.schools, schools.map(toSchool)),
      classes: classes.map(toClass),
    }));
  },

  saveSchool(school: School) {
    return update((snapshot) => ({ ...snapshot, schools: upsert(snapshot.schools, [toSchool(school)]) }));
  },

  // As classes de uma escola vindas da API substituem as que estavam salvas para ela.
  replaceSchoolClasses(schoolId: string, classes: SchoolClass[]) {
    return update((snapshot) => ({
      ...snapshot,
      classes: [
        ...snapshot.classes.filter((item) => item.schoolId !== schoolId),
        ...classes.map(toClass),
      ],
    }));
  },

  saveClasses(classes: SchoolClass[]) {
    return update((snapshot) => ({ ...snapshot, classes: upsert(snapshot.classes, classes.map(toClass)) }));
  },

  removeSchool(id: string) {
    return update((snapshot) => ({
      schools: snapshot.schools.filter((school) => school.id !== id),
      classes: snapshot.classes.filter((item) => item.schoolId !== id),
    }));
  },

  removeClass(id: string) {
    return update((snapshot) => ({
      ...snapshot,
      classes: snapshot.classes.filter((item) => item.id !== id),
    }));
  },

  // --- Leitura (sem conexão) ---

  // As listas devolvem `undefined` quando não há cópia salva, para a tela mostrar o erro de
  // conexão em vez de "nenhuma cadastrada".
  async listSchools(): Promise<SchoolWithClassesCount[] | undefined> {
    const saved = await loadSaved();
    if (!saved) return undefined;
    const { schools, classes } = saved;
    return [...schools].sort(byName).map((school) => ({
      ...school,
      classesCount: classes.filter((item) => item.schoolId === school.id).length,
    }));
  },

  async getSchool(id: string) {
    return (await load()).schools.find((school) => school.id === id);
  },

  async listClasses(): Promise<SchoolClassWithSchool[] | undefined> {
    const saved = await loadSaved();
    if (!saved) return undefined;
    const { schools, classes } = saved;
    return [...classes].sort(byYearThenName).map((item) => ({
      ...item,
      school: schools.find((school) => school.id === item.schoolId),
    }));
  },

  async listClassesBySchool(schoolId: string) {
    const saved = await loadSaved();
    if (!saved) return undefined;
    return saved.classes.filter((item) => item.schoolId === schoolId).sort(byYearThenName);
  },

  async getClass(id: string) {
    return (await load()).classes.find((item) => item.id === id);
  },
};
