import { apiRequest } from './api/client';

export const CONTRIBUTOR_AREAS = [
  'Frontend', 'Backend', 'Full Stack', 'IA', 'Banco de Dados', 'DevOps / Cloud',
  'Segurança', 'UI/UX', 'QA / Testes', 'PWA / Mobile', 'Dados / Analytics',
  'Arquitetura', 'Produto', 'Documentação', 'Outro',
] as const;

export const CONTRIBUTOR_EXPERIENCE = ['Iniciante', 'Júnior', 'Pleno', 'Sênior', 'Especialista'] as const;

export const CONTRIBUTOR_AVAILABILITY = [
  'Eventualmente', 'Algumas horas por semana', '5–10 horas por semana',
  '10–20 horas por semana', 'Mais de 20 horas por semana',
] as const;

export type ContributorArea = (typeof CONTRIBUTOR_AREAS)[number];

export type ContributorInput = {
  submissionId: string;
  name: string;
  email: string;
  github?: string;
  linkedin?: string;
  areas: ContributorArea[];
  experienceLevel: string;
  portfolio?: string;
  availability: string;
  howToContribute: string;
  message?: string;
};

export type ContributorResult = { id: string };

/** Manifestação de interesse real → POST /api/v1/contributors (backend persiste em Firestore). */
export async function submitContributor(input: ContributorInput): Promise<ContributorResult> {
  return apiRequest<ContributorResult>({ path: '/api/v1/contributors', method: 'POST', body: input });
}

/** Chave de idempotência de submissão (evita duplicidade no backend). */
export function newSubmissionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `contrib-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}