// FLOW — Schedule domain helpers (FASE 3).
// Extraídos de src/app/ScheduleCenter.tsx sem alterar o comportamento.
import type { ScheduleStatus } from '../../services/firebase/scheduling';

export type ScheduleView = 'month' | 'list';

export type ScheduleFilter = 'ALL' | ScheduleStatus;

export const statusLabels: Record<ScheduleStatus, string> = {
  DRAFT: 'Rascunho',
  SCHEDULED: 'Agendada',
  PUBLISHING: 'Publicando',
  PUBLISHED: 'Publicada',
  FAILED: 'Falhou',
  CANCELLED: 'Cancelada',
};

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);

export const formatTime = (date: Date) =>
  new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(date);
