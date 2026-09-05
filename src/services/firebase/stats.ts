// FLOW — Platform stats service (dados reais).
// Lê o documento agregado `stats/platform` (mantido por backend/admin).
// Sem documento = sem dados: a UI exibe estado honesto, nunca números falsos.
import { doc, getDoc } from 'firebase/firestore';
import { requireFirestore } from './config';

export interface PlatformStats {
  users: number;
  communities: number;
  posts: number;
  creators: number;
}

function num(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/** Retorna `null` quando ainda não há backend para o indicador. */
export async function getPlatformStats(): Promise<PlatformStats | null> {
  const snapshot = await getDoc(doc(requireFirestore(), 'stats', 'platform'));
  if (!snapshot.exists()) return null;
  const data = snapshot.data() as Record<string, unknown>;
  const users = num(data.users);
  const communities = num(data.communities);
  const posts = num(data.posts);
  const creators = num(data.creators);
  if (users === null || communities === null || posts === null || creators === null) return null;
  return { users, communities, posts, creators };
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}
