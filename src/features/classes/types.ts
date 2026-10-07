import type { School } from '@/features/schools/types';

export const SHIFTS = [
  { value: 'morning', label: 'Manhã' },
  { value: 'afternoon', label: 'Tarde' },
  { value: 'evening', label: 'Noite' },
  { value: 'full-time', label: 'Integral' },
] as const;

export type Shift = (typeof SHIFTS)[number]['value'];

export function shiftLabel(shift: Shift) {
  return SHIFTS.find((item) => item.value === shift)?.label ?? shift;
}

export type SchoolClass = {
  id: string;
  schoolId: string;
  name: string;
  shift: Shift;
  year: number;
};

export type SchoolClassWithSchool = SchoolClass & {
  school?: School;
};

export type SchoolClassInput = Omit<SchoolClass, 'id'>;
