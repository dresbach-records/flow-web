// FLOW — Screen359Representative (FASE 5: dados reais).
// Exibe o usuário logado como solicitante + suas solicitações reais de memorial.
// Sem persona fictícia.
import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { MemorialScreenProps } from './types';
import { useAppContext } from '../../../contexts/AppContext';
import { listMyMemorialRequests, type MemorialRequest } from '../../../services/firebase/memorial';

const PERMISSIONS = [
  'Solicitar transformação em memorial',
  'Gerenciar homenagens',
  'Manter publicações autorizadas',
  'Solicitar remoção de conteúdo',
  'Receber comunicados da Flow',
];

export default function Screen359Representative({ onNavigate }: MemorialScreenProps) {
  const { user } = useAppContext();
  const [requests, setRequests] = useState<MemorialRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void listMyMemorialRequests()
      .then((items) => {
        if (!cancelled) setRequests(items);
      })
      .catch(() => {
        if (!cancelled) setRequests([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ padding: '40px 36px', maxWidth: 680, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
        Meu papel como representante
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>
        Suas solicitações de memorial e o que o papel permite.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', background: '#F8FAFC', borderRadius: 14, border: '1px solid #E2E8F0', marginBottom: 28 }}>
        <img
          src={user?.photoURL || '/logo.png'}
          alt={user?.displayName || 'Usuário'}
          style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
        />
        <div>
          <strong style={{ fontSize: 17, color: '#0F172A', display: 'block' }}>
            {user?.displayName || 'Usuário'}
          </strong>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Solicitante
          </span>
          <small style={{ color: '#64748B', display: 'block' }}>{user?.email || ''}</small>
        </div>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 14 }}>Permissões do papel</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {PERMISSIONS.map((perm) => (
          <div key={perm} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: '#334155' }}>
            <CheckCircle2 size={20} color="#10B981" />
            <span>{perm}</span>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 14 }}>Minhas solicitações</h3>
      {loading && <p style={{ color: '#64748B', fontSize: 14 }}>Carregando…</p>}
      {!loading && requests.length === 0 && (
        <p style={{ color: '#64748B', fontSize: 14, marginBottom: 28 }}>
          Nenhuma solicitação enviada ainda.
        </p>
      )}
      {!loading &&
        requests.map((r) => (
          <div key={r.id} style={{ padding: '12px 16px', background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', marginBottom: 10, fontSize: 14 }}>
            <strong style={{ color: '#0F172A' }}>{r.id}</strong>
            <span style={{ color: '#64748B' }}> · {r.status === 'APPROVED' ? 'Aprovada' : r.status === 'REJECTED' ? 'Recusada' : 'Em análise'}</span>
          </div>
        ))}

      <button className="m-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onNavigate(364)}>
        Ver orientações
      </button>
    </div>
  );
}
