// FLOW — Stories do app (leitura + criação + exclusão real).
import React, { useCallback, useEffect, useState } from 'react';
import { listStories, deleteStory } from '../../services/firebase/stories';
import { requireFirebaseAuth } from '../../services/firebase/config';
import StoriesRail from '../../components/social/StoriesRail';
import StoriesComposer from '../../components/social/StoriesComposer';
import type { StoryItem } from '../../components/social/types';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';

function ownUid(): string {
  try {
    return requireFirebaseAuth().currentUser?.uid ?? '';
  } catch {
    return '';
  }
}

export default function StoriesPage() {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const uid = ownUid();

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setStories(await listStories(30));
    } catch {
      setError('Não foi possível carregar os stories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  const remove = (id: string) => {
    const previous = stories;
    setStories((prev) => prev.filter((s) => s.id !== id));
    void deleteStory(id).catch(() => setStories(previous));
  };

  const mine = stories.filter((s) => s.authorId && s.authorId === uid);

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 20px 60px' }}>
      <h1 style={{ margin: '0 0 6px 0', fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Stories</h1>
      <p style={{ margin: '0 0 18px 0', fontSize: 14, color: '#64748B' }}>
        Stories reais da sua rede, com expiração de 24 horas.
      </p>
      <StoriesComposer onPublished={() => reload()} />
      {loading && <LoadingState message="Carregando stories…" />}
      {!loading && error && <ErrorState description={error} onRetry={() => reload()} />}
      {!loading && !error && stories.length === 0 && (
        <EmptyState title="Nenhum story" description="Quando houver stories, eles aparecem aqui." />
      )}
      {!loading && !error && stories.length > 0 && <StoriesRail stories={stories} />}
      {!loading && !error && mine.length > 0 && (
        <section style={{ marginTop: 20 }}>
          <h2 style={{ fontSize: 16, color: '#0F172A' }}>Meus stories</h2>
          {mine.map((s) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '10px 14px', marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: '#0F172A' }}>{s.name}</span>
              <button
                type="button"
                onClick={() => remove(s.id)}
                style={{ background: 'none', border: 'none', color: '#B91C1C', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >
                Excluir
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
