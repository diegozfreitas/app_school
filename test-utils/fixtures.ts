import type { SchoolClass, SchoolClassWithSchool } from '@/features/classes/types';
import type { School, SchoolWithClassesCount } from '@/features/schools/types';

export const schools: School[] = [
  { id: '1', name: 'Escola Municipal Monteiro Lobato', address: 'Rua das Flores, 120 - Centro' },
  { id: '2', name: 'Colégio Estadual Machado de Assis', address: 'Av. Brasil, 1500 - Jardim América' },
];

export const schoolsWithCount: SchoolWithClassesCount[] = [
  { ...schools[0], classesCount: 2 },
  { ...schools[1], classesCount: 1 },
];

export const classes: SchoolClass[] = [
  { id: '1', schoolId: '1', name: '1º Ano A', shift: 'morning', year: 2026 },
  { id: '2', schoolId: '1', name: '2º Ano B', shift: 'afternoon', year: 2026 },
  { id: '3', schoolId: '2', name: '9º Ano A', shift: 'evening', year: 2025 },
];

export const classesWithSchool: SchoolClassWithSchool[] = classes.map((item) => ({
  ...item,
  school: schools.find((school) => school.id === item.schoolId),
}));
