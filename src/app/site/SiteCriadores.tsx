// FLOW — páginas públicas de criadores (diretório real `creator_profiles`).
import React, { useCallback, useEffect, useState } from 'react';
import { navigate } from '../../hooks/useRouter';
import { useAppContext } from '../../contexts/AppContext';
import {
  activateCreatorProfile,
  getCreatorByHandle,
  listCreators,
  type CreatorProfile,
} from '../../services/firebase/creators';
import { toggleFollow } from '../../services/firebase/social';
import { createDocument } from '../../services/firebase/firestore';
import { requireFirebaseAuth } from '../../services/firebase/config';
import SitePage from './SitePage';

export function SiteCriadores() {
  const { user } = useAppContext();
  const [items, setItems] = useState<CreatorProfile[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [activating, setActivating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await listCreators());
    } catch {
      setError('Não foi possível carregar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  const activate = () => {
    setFormError(null);
    setActivating(true);
    void activateCreatorProfile({ displayName: name || user?.displayName || '', bio })
      .then(() => reload())
      .catch((err: unknown) => setFormError(err instanceof Error ? err.message : 'Não foi possível ativar.'))
      .finally(() => setActivating(false));
  };

  const filtered = items.filter((c) =>
    !query.trim() ||
    c.displayName.toLowerCase().includes(query.toLowerCase()) ||
    c.handle.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <SitePage eyebrow="Criadores" title="Diretório de criadores" description="Perfis públicos reais. Ative o modo criador para aparecer aqui.">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar criadores..."
        aria-label="Buscar criadores"
        style={{ width: '100%', maxWidth: 480, height: 44, padding: '0 18px', borderRadius: 999, border: '1px solid #E2E8F0', fontSize: 14, marginBottom: 20, boxSizing: 'border-box' }}
      />
      {loading && <p style={{ color: '#64748B' }}>Carregando…</p>}
      {!loading && error && <p role="alert" style={{ color: '#B91C1C' }}>{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p style={{ color: '#64748B' }}>Nenhum criador cadastrado ainda. Seja o primeiro abaixo.</p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 32 }}>
        {filtered.map((c) => (
          <div key={c.uid} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 22, textAlign: 'center' }}>
            <img src={c.avatar} alt="" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', marginBottom: 10 }} />
            <h3 style={{ margin: '0 0 2px 0', color: '#0F172A' }}>{c.displayName}</h3>
            <p style={{ margin: '0 0 8px 0', fontSize: 13, color: '#64748B' }}>{c.handle}</p>
            {c.bio && <p style={{ margin: '0 0 12px 0', fontSize: 13, color: '#475569' }}>{c.bio}</p>}
            <button
              type="button"
              onClick={() => navigate(`/criadores/${c.handle.replace(/^@/, '')}`)}
              style={{ background: 'none', border: 'none', color: '#4F7FFF', fontWeight: 800, fontSize: 14, cursor: 'pointer', padding: 0 }}
            >
              Ver perfil →
            </button>
          </div>
        ))}
      </div>
      <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 24, maxWidth: 560 }}>
        <h3 style={{ margin: '0 0 6px 0', color: '#0F172A' }}>Ativar modo criador</h3>
        <p style={{ margin: '0 0 14px 0', fontSize: 13, color: '#64748B' }}>Requer login. Seu perfil público entra no diretório.</p>
        {!user && <p style={{ fontSize: 13, color: '#B91C1C' }}>Faça login para ativar. <button type="button" onClick={() => navigate('/login')} style={{ color: '#4F7FFF', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}>Entrar</button></p>}
        {user && (
          <>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome de exibição"
              aria-label="Nome de exibição"
              style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 10, border: '1px solid #CBD5E1', marginBottom: 10, boxSizing: 'border-box' }}
            />
            <input
              type="text" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Biografia curta (opcional)"
              aria-label="Biografia"
              style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 10, border: '1px solid #CBD5E1', marginBottom: 10, boxSizing: 'border-box' }}
            />
            {formError && <p role="alert" style={{ color: '#B91C1C', fontSize: 13 }}>{formError}</p>}
            <button
              type="button" onClick={activate} disabled={activating}
              style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 800, cursor: 'pointer' }}
            >
              {activating ? 'Ativando…' : 'Ativar modo criador'}
            </button>
          </>
        )}
      </div>
    </SitePage>
  );
}

export function SiteCriadorPerfil({ username }: { username: string }) {
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void getCreatorByHandle(username)
      .then((found) => {
        if (cancelled) return;
        if (!found) setError('Criador não encontrado.');
        else setProfile(found);
      })
      .catch(() => {
        if (!cancelled) setError('Não foi possível carregar.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [username]);

  const follow = () => {
    if (!profile) return;
    setNotice(null);
    const was = following;
    setFollowing(!was);
    void toggleFollow(profile.uid, was).catch((err: unknown) => {
      setFollowing(was);
      setNotice(err instanceof Error ? err.message : 'Falha. Faça login para seguir.');
    });
  };

  const share = () => {
    if (navigator.clipboard) void navigator.clipboard.writeText(window.location.href).catch(() => undefined);
  };

  const message = () => navigate('/app/mensagens');

  const report = () => {
    try {
      const uid = requireFirebaseAuth().currentUser?.uid;
      if (!uid || !profile) {
        setNotice('Faça login para denunciar.');
        return;
      }
      void createDocument('reports', {
        reporterId: uid, status: 'OPEN', category: 'Perfil de criador',
        description: `Denúncia do criador ${profile.displayName} (${profile.handle})`, url: window.location.href,
      })
        .then(() => setNotice('Denúncia registrada. Obrigado.'))
        .catch(() => setNotice('Não foi possível registrar.'));
    } catch {
      setNotice('Faça login para denunciar.');
    }
  };

  if (loading) {
    return <SitePage eyebrow="Criador" title="Carregando…"><p style={{ color: '#64748B' }}>Carregando…</p></SitePage>;
  }
  if (error || !profile) {
    return (
      <SitePage eyebrow="Criador" title="Não encontrado">
        <p role="alert" style={{ color: '#B91C1C' }}>{error ?? 'Criador não encontrado.'}</p>
      </SitePage>
    );
  }

  return (
    <SitePage eyebrow="Criador" title={profile.displayName} description={profile.bio || undefined}>
      <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 28, maxWidth: 560, textAlign: 'center' }}>
        <img src={profile.avatar} alt="" style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', marginBottom: 12 }} />
        <p style={{ margin: '0 0 16px 0', color: '#64748B' }}>{profile.handle}</p>
        {notice && <p role={notice.startsWith('Denúncia') ? 'status' : 'alert'} style={{ fontSize: 13, color: notice.startsWith('Denúncia') ? '#065F46' : '#B91C1C' }}>{notice}</p>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button type="button" onClick={follow} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: following ? '#F1F5F9' : '#2563EB', color: following ? '#475569' : '#FFF', fontWeight: 800, cursor: 'pointer' }}>
            {following ? 'Seguindo' : 'Seguir'}
          </button>
          <button type="button" onClick={share} style={{ padding: '10px 24px', borderRadius: 10, border: '1px solid #CBD5E1', background: '#FFF', fontWeight: 700, cursor: 'pointer' }}>
            Compartilhar
          </button>
          <button type="button" onClick={message} style={{ padding: '10px 24px', borderRadius: 10, border: '1px solid #CBD5E1', background: '#FFF', fontWeight: 700, cursor: 'pointer' }}>
            Mensagem
          </button>
          <button type="button" onClick={report} style={{ padding: '10px 24px', borderRadius: 10, border: '1px solid #FECACA', background: '#FFF', color: '#B91C1C', fontWeight: 700, cursor: 'pointer' }}>
            Denunciar
          </button>
        </div>
      </div>
    </SitePage>
  );
}
