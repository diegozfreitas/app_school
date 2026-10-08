import { useCallback, useState } from 'react';

// Carrega dados assíncronos com estados de carregamento e erro. `fetcher` deve ser estável
// (função de módulo ou useCallback), pois `reload` depende dela.
export function useAsyncData<T>(fetcher: () => Promise<T>, initialData: T, errorMessage: string) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetcher());
    } catch {
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetcher, errorMessage]);

  return { data, setData, loading, error, reload };
}
