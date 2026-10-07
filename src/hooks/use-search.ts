import { useMemo, useState } from 'react';

import { normalizeText } from '@/lib/text';

type UseSearchOptions<T> = {
  // Campos de texto do item que entram na busca (ex.: nome e endereço).
  fields: (item: T) => (string | undefined)[];
  // Filtro extra aplicado junto com a busca (ex.: turno selecionado).
  filter?: (item: T) => boolean;
};

// Busca local, sem diferenciar acentos e maiúsculas, sobre uma lista já carregada.
export function useSearch<T>(items: T[], { fields, filter }: UseSearchOptions<T>) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const term = normalizeText(query);
    return items.filter((item) => {
      if (filter && !filter(item)) return false;
      if (!term) return true;
      return fields(item).some((field) => field && normalizeText(field).includes(term));
    });
    // `fields` e `filter` costumam ser funções inline; o React Compiler (ativo no app.json) as memoiza.
  }, [items, query, fields, filter]);

  return { query, setQuery, results, hasQuery: normalizeText(query) !== '' };
}
