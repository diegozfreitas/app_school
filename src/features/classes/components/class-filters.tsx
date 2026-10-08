import { FilterChips } from '@/components/filter-chips';
import { SearchInput } from '@/components/search-input';

import { SHIFTS, type Shift } from '../types';

type ClassFiltersProps = {
  query: string;
  setQuery: (value: string) => void;
  shift: Shift | null;
  setShift: (value: Shift | null) => void;
};

export function ClassFilters({ query, setQuery, shift, setShift }: ClassFiltersProps) {
  return (
    <>
      <SearchInput value={query} onChangeText={setQuery} placeholder="Buscar por classe ou escola" />
      <FilterChips options={SHIFTS} value={shift} onChange={setShift} />
    </>
  );
}
