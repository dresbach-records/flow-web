// FLOW — páginas públicas de comunidades (dados reais, leitura pública).
import React, { useCallback, useEffect, useState } from 'react';
import { navigate } from '../../hooks/useRouter';
import { getCommunity, joinCommunity, leaveCommunity, listCommunities, getMyMemberships, type Community } from '../../services/firebase/communities';
import { listDocuments } from '../../services/firebase/firestore';
import { createDocument } from '../../services/firebase/firestore';
import { requireFirebaseAuth } from '../../services/firebase/config';
import SitePage from './SitePage';

export function SiteComunidades() {
  const [items, setItems] = useState<Community[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await listCommunities(24));
    } catch {
      setError('Não foi possível carregar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  const filtered = items.filter((c) =>
    !query.trim() ||
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    (c.description ?? '').toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <SitePage eyebrow="Comunidades" title="Descubra comunidades" description="Grupos temáticos reais da FLOW. Entre para participar.">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar comunidades..."
        aria-label="Buscar comunidades"
        style={{ width: '100%', maxWidth: 480, height: 44, padding: '0 18px', borderRadius: 999, border: '1px solid #E2E8F0', fontSize: 14, marginBottom: 20, boxSizing: 'border-box' }}
      />
      {loading && <p style={{ color: '#64748B' }}>Carregando…</p>}
      {!loading && error && <p role="alert" style={{ color: '#B91C1C' }}>{error} <button type="button" onClick={() => reload()}>Tentar novamente</button></p>}
      {!loading && !error && filtered.length === 0 && (
        <p style={{ color: '#64748B' }}>Nenhuma comunidade ainda. Volte em breve.</p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map((c) => (
          <div key={c.id} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 22 }}>
            <h3 style={{ margin: '0 0 6px 0', color: '#0F172A' }}>{c.name}</h3>
            {c.description && <p style={{ margin: '0 0 8px 0', fontSize: 14, color: '#475569' }}>{c.description}</p>}
            <p style={{ margin: '0 0 12px 0', fontSize: 12, color: '#94A3B8' }}>{(c.memberCount ?? 0).toLocaleString('pt-BR')} membros</p>
            <button
              type="button"
              onClick={() => navigate(`/comunidades/${c.id}`)}
              style={{ background: 'none', border: 'none', color: '#4F7FFF', fontWeight: 800, fontSize: 14, cursor: 'pointer', padding: 0 }}
            >
              Ver comunidade →
            </button>
          </div>
        ))}
      </div>
    </SitePage>
  );
}

export function SiteComunidadeDetalhe({ slug }: { slug: string }) {
  const [community, setCommunity] = useState<Community | null>(null);
  const [joined, setJoined] = useState(false);
  const [members, setMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const found = await getCommunity(slug);
      if (!found) {
        setError('Comunidade não encontrada.');
        return;
      }
      setCommunity(found);
      const docs = await listDocuments(`communities/${found.id}/members`, { max: 50 }).catch(() => []);
      setMembers(docs.map((d) => d.id));
      const mine = await getMyMemberships().catch(() => new Set<string>());
      setJoined(mine.has(found.id));
    } catch {
      setError('Não foi possível carregar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { void reload(); }, [reload]);

  const toggleJoin = () => {
    if (!community) return;
    setActionError(null);
    const wasJoined = joined;
    setJoined(!wasJoined);
    void (wasJoined ? leaveCommunity(community.id) : joinCommunity(community.id)).catch((err: unknown) => {
      setJoined(wasJoined);
      setActionError(err instanceof Error ? err.message : 'Falha. Faça login para participar.');
    });
  };

  const share = () => {
    if (navigator.clipboard) void navigator.clipboard.writeText(window.location.href).catch(() => undefined);
  };

  const report = () => {
    try {
      const uid = requireFirebaseAuth().currentUser?.uid;
      if (!uid || !community) {
        setActionError('Faça login para denunciar.');
        return;
      }
      void createDocument('reports', {
        reporterId: uid, status: 'OPEN', category: 'Comunidade',
        description: `Denúncia da comunidade ${community.name} (${community.id})`, url: window.location.href,
      })
        .then(() => setActionError('Denúncia registrada. Obrigado.'))
        .catch(() => setActionError('Não foi possível registrar.'));
    } catch {
      setActionError('Faça login para denunciar.');
    }
  };

  if (loading) {
    return <SitePage eyebrow="Comunidade" title="Carregando…"><p style={{ color: '#64748B' }}>Carregando…</p></SitePage>;
  }
  if (error || !community) {
    return (
      <SitePage eyebrow="Comunidade" title="Não encontrada">
        <p role="alert" style={{ color: '#B91C1C' }}>{error ?? 'Comunidade não encontrada.'}</p>
      </SitePage>
    );
  }

  return (
    <SitePage eyebrow="Comunidade" title={community.name} description={community.description}>
      <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <img src={community.imageUrl || '/logo.png'} alt="" style={{ width: 64, height: 64, borderRadius: 16, objectFit: 'cover' }} />
          <div>
            <p style={{ margin: 0, fontSize: 14, color: '#475569' }}><strong>{(community.memberCount ?? 0).toLocaleString('pt-BR')}</strong> membros</p>
            <p style={{ margin: 0, fontSize: 12, color: '#94A3B8' }}>Regras: respeito, sem spam, sem conteúdo ilegal.</p>
          </div>
        </div>
        {actionError && <p role={actionError.startsWith('Denúncia') ? 'status' : 'alert'} style={{ color: actionError.startsWith('Denúncia') ? '#065F46' : '#B91C1C', fontSize: 13 }}>{actionError}</p>}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button type="button" onClick={toggleJoin} style={{ padding: '10px 22px', borderRadius: 10, border: 'none', background: joined ? '#F1F5F9' : '#2563EB', color: joined ? '#475569' : '#FFF', fontWeight: 800, cursor: 'pointer' }}>
            {joined ? 'Sair' : 'Entrar'}
          </button>
          <button type="button" onClick={share} style={{ padding: '10px 22px', borderRadius: 10, border: '1px solid #CBD5E1', background: '#FFF', fontWeight: 700, cursor: 'pointer' }}>
            Compartilhar
          </button>
          <button type="button" onClick={report} style={{ padding: '10px 22px', borderRadius: 10, border: '1px solid #FECACA', background: '#FFF', color: '#B91C1C', fontWeight: 700, cursor: 'pointer' }}>
            Denunciar
          </button>
        </div>
      </div>
      <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 24 }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#0F172A' }}>Membros recentes ({members.length})</h3>
        {members.length === 0 ? (
          <p style={{ margin: 0, fontSize: 14, color: '#64748B' }}>Nenhum membro visível ainda.</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#475569' }}>
            {members.slice(0, 20).map((m) => <li key={m}>{m}</li>)}
          </ul>
        )}
      </div>
    </SitePage>
  );
}
