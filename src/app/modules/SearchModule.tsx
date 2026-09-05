// FLOW — Pesquisa global real (posts + comunidades + criadores).
import React, { useState } from 'react';
import { navigate } from '../../hooks/useRouter';
import { listDocuments } from '../../services/firebase/firestore';
import { extractHashtags } from '../../services/firebase/social';
import { listCommunities } from '../../services/firebase/communities';
import { listCreators } from '../../services/firebase/creators';
import type { RawRecord } from '../../components/social/types';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';

export default function SearchModule() {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Array<{ id: string; title: string }>>([]);
  const [communities, setCommunities] = useState<Array<{ id: string; name: string }>>([]);
  const [creators, setCreators] = useState<Array<{ uid: string; displayName: string; handle: string }>>([]);

  const search = () => {
    const raw = query.trim();
    if (!raw) return;
    const q = raw.toLowerCase();
    // #hashtag → filtra posts pela tag exata (busca real, não filtro decorativo).
    const tagFilter = raw.startsWith('#') ? raw.toLowerCase() : null;
    setLoading(true);
    setError(null);
    setSearched(true);
    void Promise.all([
      listDocuments<RawRecord>('posts', { orderByField: 'createdAt', direction: 'desc', max: 30 }).catch(() => []),
      listCommunities(30).catch(() => []),
      listCreators(30).catch(() => []),
    ])
      .then(([postDocs, communityDocs, creatorDocs]) => {
        setPosts(
          postDocs
            .filter((p) => {
              const text = ((p.text as string) || (p.caption as string) || '').toLowerCase();
              if (tagFilter) {
                const tags = Array.isArray(p.hashtags)
                  ? (p.hashtags as unknown[]).filter((t): t is string => typeof t === 'string').map((t) => t.toLowerCase())
                  : extractHashtags(text);
                return tags.includes(tagFilter);
              }
              return text.includes(q);
            })
            .map((p) => ({ id: p.id, title: ((p.text as string) || (p.caption as string) || 'Publicação').slice(0, 120) })),
        );
        setCommunities(
          communityDocs
            .filter((c) => c.name.toLowerCase().includes(q) || (c.description ?? '').toLowerCase().includes(q))
            .map((c) => ({ id: c.id, name: c.name })),
        );
        setCreators(
          creatorDocs
            .filter((c) => c.displayName.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q))
            .map((c) => ({ uid: c.uid, displayName: c.displayName, handle: c.handle })),
        );
      })
      .catch(() => setError('Não foi possível pesquisar. Tente novamente.'))
      .finally(() => setLoading(false));
  };

  const hasResults = posts.length + communities.length + creators.length > 0;

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 20px 60px' }}>
      <h1 style={{ margin: '0 0 6px 0', fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Pesquisa</h1>
      <p style={{ margin: '0 0 18px 0', fontSize: 14, color: '#64748B' }}>Busque publicações, comunidades e criadores reais.</p>
      <form
        onSubmit={(e) => { e.preventDefault(); search(); }}
        style={{ display: 'flex', gap: 10, marginBottom: 24 }}
      >
        <input
          type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar na FLOW..." aria-label="Pesquisar na FLOW"
          style={{ flex: 1, height: 44, padding: '0 18px', borderRadius: 999, border: '1px solid #E2E8F0', fontSize: 14 }}
        />
        <button
          type="submit" disabled={loading}
          style={{ padding: '0 26px', borderRadius: 999, border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 800, cursor: 'pointer' }}
        >
          {loading ? '…' : 'Buscar'}
        </button>
      </form>
      {loading && <LoadingState message="Pesquisando…" />}
      {!loading && error && <p role="alert" style={{ color: '#B91C1C' }}>{error}</p>}
      {!loading && !error && searched && !hasResults && (
        <EmptyState title="Nada encontrado" description="Tente outro termo." />
      )}
      {!loading && !error && hasResults && (
        <>
          {posts.length > 0 && (
            <section style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, color: '#0F172A' }}>Publicações ({posts.length})</h2>
              {posts.map((p) => (
                <button key={p.id} type="button" onClick={() => navigate(`/app/post/${p.id}`)} style={{ display: 'block', width: '100%', textAlign: 'left', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 14, marginBottom: 8, cursor: 'pointer', fontSize: 14, color: '#1E293B' }}>
                  {p.title}
                </button>
              ))}
            </section>
          )}
          {communities.length > 0 && (
            <section style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, color: '#0F172A' }}>Comunidades ({communities.length})</h2>
              {communities.map((c) => (
                <button key={c.id} type="button" onClick={() => navigate(`/app/comunidades/${c.id}`)} style={{ display: 'block', width: '100%', textAlign: 'left', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 14, marginBottom: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                  {c.name}
                </button>
              ))}
            </section>
          )}
          {creators.length > 0 && (
            <section>
              <h2 style={{ fontSize: 16, color: '#0F172A' }}>Criadores ({creators.length})</h2>
              {creators.map((c) => (
                <button key={c.uid} type="button" onClick={() => navigate(`/criadores/${c.handle.replace(/^@/, '')}`)} style={{ display: 'block', width: '100%', textAlign: 'left', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 14, marginBottom: 8, cursor: 'pointer', fontSize: 14, color: '#0F172A' }}>
                  <strong>{c.displayName}</strong> <span style={{ color: '#64748B' }}>{c.handle}</span>
                </button>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
