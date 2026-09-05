// FLOW — Comunidade do app (detalhe real + participar + posts da comunidade).
import React, { useCallback, useEffect, useState } from 'react';
import { navigate } from '../../hooks/useRouter';
import { getCommunity, getMyMemberships, joinCommunity, leaveCommunity, type Community } from '../../services/firebase/communities';
import { listDocuments } from '../../services/firebase/firestore';
import type { RawRecord } from '../../components/social/types';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';

export default function CommunityDetail({ id }: { id: string }) {
  const [community, setCommunity] = useState<Community | null>(null);
  const [joined, setJoined] = useState(false);
  const [posts, setPosts] = useState<Array<{ id: string; title: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const found = await getCommunity(id);
      if (!found) {
        setError('Comunidade não encontrada.');
        return;
      }
      setCommunity(found);
      const mine = await getMyMemberships().catch(() => new Set<string>());
      setJoined(mine.has(found.id));
      const docs = await listDocuments<RawRecord>('posts', { field: 'communityId', value: found.id, max: 20 }).catch(() => []);
      setPosts(docs.map((p) => ({ id: p.id, title: ((p.text as string) || (p.caption as string) || 'Publicação').slice(0, 120) })));
    } catch {
      setError('Não foi possível carregar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void reload(); }, [reload]);

  if (loading) {
    return <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px' }}><LoadingState message="Carregando comunidade…" /></div>;
  }
  if (error || !community) {
    return (
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px' }}>
        <ErrorState description={error ?? 'Comunidade não encontrada.'} onRetry={() => reload()} />
      </div>
    );
  }

  const toggleJoin = () => {
    const was = joined;
    setJoined(!was);
    void (was ? leaveCommunity(community.id) : joinCommunity(community.id)).catch(() => setJoined(was));
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 20px 60px' }}>
      <button type="button" onClick={() => navigate('/app/comunidades')} style={{ background: 'none', border: 'none', color: '#4F7FFF', fontWeight: 800, cursor: 'pointer', marginBottom: 12 }}>
        ← Comunidades
      </button>
      <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <img src={community.imageUrl || '/logo.png'} alt="" style={{ width: 64, height: 64, borderRadius: 14, objectFit: 'cover' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: 22, color: '#0F172A' }}>{community.name}</h1>
            <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#64748B' }}>{(community.memberCount ?? 0).toLocaleString('pt-BR')} membros</p>
          </div>
        </div>
        {community.description && <p style={{ fontSize: 14, color: '#475569' }}>{community.description}</p>}
        <button
          type="button" onClick={toggleJoin}
          style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: joined ? '#F1F5F9' : '#2563EB', color: joined ? '#475569' : '#FFF', fontWeight: 800, cursor: 'pointer' }}
        >
          {joined ? 'Participando ✓' : 'Entrar'}
        </button>
      </div>
      <h2 style={{ fontSize: 17, color: '#0F172A' }}>Publicações da comunidade</h2>
      {posts.length === 0 ? (
        <EmptyState title="Sem publicações vinculadas" description="Posts com esta comunidade aparecem aqui." />
      ) : (
        posts.map((p) => (
          <button key={p.id} type="button" onClick={() => navigate(`/app/post/${p.id}`)} style={{ display: 'block', width: '100%', textAlign: 'left', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 14, marginBottom: 8, cursor: 'pointer', fontSize: 14, color: '#1E293B' }}>
            {p.title}
          </button>
        ))
      )}
    </div>
  );
}
