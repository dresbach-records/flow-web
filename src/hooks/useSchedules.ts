// FLOW — useSchedules (FASE 3).
// Estado de agendamentos extraído de src/app/ScheduleCenter.tsx sem alterar
// o comportamento. Firebase continua real; nenhum mock foi criado.
import { useCallback, useEffect, useState } from 'react';
import { listSchedules, type ScheduledPost } from '../services/firebase/scheduling';

export function useSchedules(userUid: string | undefined) {
  const [items, setItems] = useState<ScheduledPost[]>([]);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    try {
      setError('');
      setItems(await listSchedules());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível carregar os agendamentos.');
    }
  }, []);

  useEffect(() => {
    if (userUid) void reload();
  }, [userUid, reload]);

  return { items, error, setError, reload };
}

export type { ScheduledPost };
