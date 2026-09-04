import { useCallback, useEffect, useState } from 'react';

export function useApi<T>(loader: () => Promise<T>, enabled = true) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error>();
  const reload = useCallback(async () => {
    setLoading(true); setError(undefined);
    try { setData(await loader()); } catch (cause) { setError(cause instanceof Error ? cause : new Error('Erro desconhecido')); }
    finally { setLoading(false); }
  }, [loader]);
  useEffect(() => { if (enabled) void reload(); }, [enabled, reload]);
  return { data, loading, error, reload };
}
