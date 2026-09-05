import { firestore } from '../infrastructure/database.js';

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

type ContributorInput = {
  submissionId?: unknown;
  name?: unknown;
  email?: unknown;
  github?: unknown;
  linkedin?: unknown;
  areas?: unknown;
  experienceLevel?: unknown;
  portfolio?: unknown;
  availability?: unknown;
  howToContribute?: unknown;
  message?: unknown;
};

function asTrimmedString(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function createContributor(input: ContributorInput) {
  const submissionId = asTrimmedString(input?.submissionId, 64);
  if (!/^[A-Za-z0-9-]{16,64}$/.test(submissionId)) throw new Error('CONTRIBUTOR_INVALID_SUBMISSION_ID');

  const name = asTrimmedString(input?.name, 120);
  if (name.length < 2) throw new Error('CONTRIBUTOR_INVALID_NAME');

  const email = asTrimmedString(input?.email, 160);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('CONTRIBUTOR_INVALID_EMAIL');

  const github = asTrimmedString(input?.github, 200);
  const linkedin = asTrimmedString(input?.linkedin, 200);
  const portfolio = asTrimmedString(input?.portfolio, 200);

  const rawAreas = Array.isArray(input?.areas) ? input.areas.filter((a): a is string => typeof a === 'string') : [];
  const areas = [...new Set(rawAreas.map((a) => a.trim()).filter(Boolean))].slice(0, 15);
  if (areas.length === 0) throw new Error('CONTRIBUTOR_INVALID_AREAS');
  for (const area of areas) {
    if (!(CONTRIBUTOR_AREAS as readonly string[]).includes(area)) throw new Error('CONTRIBUTOR_INVALID_AREA');
  }

  const experienceLevel = asTrimmedString(input?.experienceLevel, 40);
  if (!(CONTRIBUTOR_EXPERIENCE as readonly string[]).includes(experienceLevel)) {
    throw new Error('CONTRIBUTOR_INVALID_EXPERIENCE');
  }

  const availability = asTrimmedString(input?.availability, 60);
  if (!(CONTRIBUTOR_AVAILABILITY as readonly string[]).includes(availability)) {
    throw new Error('CONTRIBUTOR_INVALID_AVAILABILITY');
  }

  const howToContribute = asTrimmedString(input?.howToContribute, 2000);
  if (howToContribute.length < 10) throw new Error('CONTRIBUTOR_INVALID_HOW');

  const message = asTrimmedString(input?.message, 5000);

  const ref = firestore().collection('contributors').doc(submissionId);
  const existing = await ref.get();
  if (existing.exists) throw new Error('CONTRIBUTOR_DUPLICATE');

  const now = new Date();
  const record = {
    name,
    email,
    github: github || null,
    linkedin: linkedin || null,
    areas,
    experienceLevel,
    portfolio: portfolio || null,
    availability,
    howToContribute,
    message: message || null,
    status: 'PENDING',
    createdAt: now,
    updatedAt: now,
  };
  await ref.set(record);
  return { id: submissionId, ...record };
}