// FLOW — CommunitiesModule (FASE 1: sem mocks).
// Comunidades 100% Firestore via services/firebase/communities.
// Vazio/erro honestos (REGRA DE CONCLUSÃO FLOW).
import React, { useCallback, useEffect, useState } from 'react';
import { Users, Plus, Check, Search, Globe } from 'lucide-react';
import {
  getMyMemberships,
  joinCommunity,
  leaveCommunity,
  listCommunities,
  createCommunity,
  type Community,
} from '../../services/firebase/communities';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import LoadingState from '../../components/ui/LoadingState';

export default function CommunitiesModule() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<'all' | 'my'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [createBusy, setCreateBusy] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [items, mine] = await Promise.all([listCommunities(24), getMyMemberships()]);
      setCommunities(items);
      setJoined(mine);
    } catch {
      setError('Não foi possível carregar as comunidades. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const toggleJoin = (id: string) => {
    const isJoined = joined.has(id);
    setJoinError(null);
    setJoined((prev) => {
      const next = new Set(prev);
      if (isJoined) next.delete(id);
      else next.add(id);
      return next;
    });
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, memberCount: (c.memberCount ?? 0) + (isJoined ? -1 : 1) } : c,
      ),
    );
    // Otimista com reversão real (sem falso sucesso).
    void (isJoined ? leaveCommunity(id) : joinCommunity(id)).catch(() => {
      setJoined((prev) => {
        const next = new Set(prev);
        if (isJoined) next.add(id);
        else next.delete(id);
        return next;
      });
      setCommunities((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, memberCount: (c.memberCount ?? 0) + (isJoined ? 1 : -1) } : c,
        ),
      );
      setJoinError('Não foi possível atualizar sua participação. Tente novamente.');
    });
  };

  const filtered = communities.filter((c) => {
    const matchesTab = tab === 'all' || joined.has(c.id);
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      (c.description ?? '').toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', padding: '24px 20px 60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Users size={26} color="#2563EB" />
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Comunidades</h1>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: '#64748B' }}>
            Participe de grupos temáticos com interesses afins aos seus.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setCreating((v) => !v);
            setCreateError(null);
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 18px',
            borderRadius: 12,
            border: 'none',
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            color: '#FFFFFF',
            fontSize: 13.5,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          <span>{creating ? 'Fechar' : 'Criar Comunidade'}</span>
        </button>
      </div>

      {creating && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (createBusy) return;
            setCreateError(null);
            setCreateBusy(true);
            void createCommunity({ name: newName, description: newDescription })
              .then(() => {
                setNewName('');
                setNewDescription('');
                setCreating(false);
                return reload();
              })
              .catch((err: unknown) => setCreateError(err instanceof Error ? err.message : 'Não foi possível criar.'))
              .finally(() => setCreateBusy(false));
          }}
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 20, marginBottom: 24, maxWidth: 560 }}
        >
          <h2 style={{ margin: '0 0 12px 0', fontSize: 17, color: '#0F172A' }}>Nova comunidade</h2>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nome (mín. 3 caracteres)"
            aria-label="Nome da comunidade"
            maxLength={80}
            style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 14, marginBottom: 10, boxSizing: 'border-box' }}
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Descrição (opcional)"
            aria-label="Descrição da comunidade"
            rows={3}
            maxLength={500}
            style={{ width: '100%', padding: 14, borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 14, marginBottom: 10, boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }}
          />
          {createError && <p role="alert" style={{ margin: '0 0 10px 0', fontSize: 13, color: '#B91C1C' }}>{createError}</p>}
          <button
            type="submit"
            disabled={createBusy}
            style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#2563EB', color: '#FFFFFF', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}
          >
            {createBusy ? 'Criando…' : 'Criar comunidade'}
          </button>
        </form>
      )}

      {/* Search & Tabs */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 14, top: 12 }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome ou descrição..."
            style={{
              width: '100%',
              height: 40,
              padding: '0 16px 0 40px',
              borderRadius: 999,
              border: '1px solid #E2E8F0',
              background: '#FFFFFF',
              fontSize: 13.5,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => setTab('all')}
            style={{
              padding: '8px 18px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              border: tab === 'all' ? '1px solid #2563EB' : '1px solid #E2E8F0',
              background: tab === 'all' ? '#EFF6FF' : '#FFFFFF',
              color: tab === 'all' ? '#2563EB' : '#475569'
            }}
          >
            Explorar todas
          </button>
          <button
            type="button"
            onClick={() => setTab('my')}
            style={{
              padding: '8px 18px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              border: tab === 'my' ? '1px solid #2563EB' : '1px solid #E2E8F0',
              background: tab === 'my' ? '#EFF6FF' : '#FFFFFF',
              color: tab === 'my' ? '#2563EB' : '#475569'
            }}
          >
            Minhas comunidades ({joined.size})
          </button>
        </div>
      </div>

      {joinError && (
        <p role="alert" style={{ margin: '0 0 16px 0', fontSize: 13, color: '#DC2626' }}>{joinError}</p>
      )}

      {loading && <LoadingState message="Carregando comunidades…" />}
      {!loading && error && <ErrorState description={error} onRetry={() => reload()} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          title={tab === 'my' ? 'Você ainda não participa de comunidades' : 'Nenhuma comunidade encontrada'}
          description="As comunidades reais aparecem aqui. Nada é simulado."
        />
      )}

      {/* Grid */}
      {!loading && !error && filtered.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 20
        }}>
          {filtered.map(com => {
            const isJoined = joined.has(com.id);
            const avatar = com.imageUrl || '/logo.png';
            return (
              <div
                key={com.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 16,
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  boxShadow: '0 1px 4px rgba(15,23,42,0.04)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Banner */}
                <div style={{ height: 100, width: '100%', position: 'relative', background: 'linear-gradient(135deg, #4F7FFF 0%, #8B5CF6 50%, #D946EF 100%)' }}>
                  {com.imageUrl && (
                    <img src={com.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                  <span style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'rgba(15,23,42,0.7)',
                    color: '#fff',
                    padding: '3px 8px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 600
                  }}>
                    Comunidade
                  </span>
                </div>

                {/* Avatar and Body */}
                <div style={{ padding: '0 16px 16px', position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: -24, marginBottom: 12 }}>
                    <img
                      src={avatar}
                      alt={com.name}
                      style={{ width: 52, height: 52, borderRadius: 14, border: '3px solid #FFFFFF', objectFit: 'cover', background: '#F1F5F9' }}
                    />
                    <button
                      type="button"
                      onClick={() => toggleJoin(com.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 999,
                        border: isJoined ? '1px solid #CBD5E1' : 'none',
                        background: isJoined ? '#F8FAFC' : '#2563EB',
                        color: isJoined ? '#475569' : '#FFFFFF',
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      {isJoined ? (
                        <>
                          <Check size={14} />
                          <span>Participando</span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} />
                          <span>Entrar</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h3 style={{ margin: '0 0 6px 0', fontSize: 16, fontWeight: 700, color: '#0F172A' }}>
                    {com.name}
                  </h3>
                  {com.description && (
                    <p style={{ margin: '0 0 14px 0', fontSize: 13, color: '#64748B', lineHeight: 1.45, flex: 1 }}>
                      {com.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, color: '#94A3B8', borderTop: '1px solid #F1F5F9', paddingTop: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Users size={14} />
                      <span>{(com.memberCount ?? 0).toLocaleString('pt-BR')} membros</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Globe size={14} />
                      <span>Pública</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
