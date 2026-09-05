// FLOW — Carreiras (vagas reais `job_posts` + candidaturas reais `job_applications`).
import React, { useCallback, useEffect, useState } from 'react';
import { navigate } from '../../hooks/useRouter';
import { useAppContext } from '../../contexts/AppContext';
import { getDocument, listDocuments, createDocument } from '../../services/firebase/firestore';
import { requireFirebaseAuth } from '../../services/firebase/config';
import SitePage from './SitePage';

interface Job {
  id: string;
  title: string;
  area: string;
  location: string;
  kind: string;
  description: string;
}

function toJob(id: string, d: Record<string, unknown>): Job {
  return {
    id,
    title: typeof d.title === 'string' ? d.title : 'Vaga',
    area: typeof d.area === 'string' ? d.area : 'Geral',
    location: typeof d.location === 'string' ? d.location : 'Remoto',
    kind: typeof d.kind === 'string' ? d.kind : 'CLT',
    description: typeof d.description === 'string' ? d.description : '',
  };
}

export function SiteCarreiras() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const docs = await listDocuments<Record<string, unknown>>('job_posts', { max: 50 });
      setJobs(docs.map((d) => toJob(d.id, d)));
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  return (
    <SitePage eyebrow="Carreiras" title="Trabalhe na FLOW" description="Vagas reais publicadas pela equipe. Sem vaga publicada, sem lista fictícia.">
      {loading && <p style={{ color: '#64748B' }}>Carregando vagas…</p>}
      {!loading && jobs.length === 0 && (
        <p style={{ color: '#64748B' }}>Nenhuma vaga aberta no momento. Volte em breve.</p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {jobs.map((j) => (
          <div key={j.id} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 22 }}>
            <h3 style={{ margin: '0 0 6px 0', color: '#0F172A' }}>{j.title}</h3>
            <p style={{ margin: '0 0 12px 0', fontSize: 13, color: '#64748B' }}>{j.area} · {j.location} · {j.kind}</p>
            <button type="button" onClick={() => navigate(`/carreiras/${j.id}`)} style={{ background: 'none', border: 'none', color: '#4F7FFF', fontWeight: 800, fontSize: 14, cursor: 'pointer', padding: 0 }}>
              Ver detalhes →
            </button>
          </div>
        ))}
      </div>
    </SitePage>
  );
}

export function SiteCarreiraDetalhe({ slug }: { slug: string }) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void getDocument<Record<string, unknown>>('job_posts', slug)
      .then((doc) => {
        if (!cancelled) setJob(doc ? toJob(doc.id, doc) : null);
      })
      .catch(() => {
        if (!cancelled) setJob(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return <SitePage eyebrow="Carreiras" title="Carregando…"><p style={{ color: '#64748B' }}>Carregando…</p></SitePage>;
  }
  if (!job) {
    return (
      <SitePage eyebrow="Carreiras" title="Vaga não encontrada">
        <p role="alert" style={{ color: '#B91C1C' }}>Esta vaga não existe ou foi encerrada.</p>
      </SitePage>
    );
  }
  return (
    <SitePage eyebrow={`${job.area} · ${job.location} · ${job.kind}`} title={job.title} description={job.description || undefined}>
      <button
        type="button" onClick={() => navigate(`/carreiras/${job.id}/candidatar`)}
        style={{ padding: '12px 28px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #4F7FFF 0%, #8B5CF6 50%, #D946EF 100%)', color: '#FFF', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}
      >
        Candidatar-se
      </button>
    </SitePage>
  );
}

export function SiteCarreiraCandidatura({ slug }: { slug: string }) {
  const { user } = useAppContext();
  const [job, setJob] = useState<Job | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pitch, setPitch] = useState('');
  const [sending, setSending] = useState(false);
  const [protocol, setProtocol] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getDocument<Record<string, unknown>>('job_posts', slug)
      .then((doc) => {
        if (!cancelled) setJob(doc ? toJob(doc.id, doc) : null);
      })
      .catch(() => {
        if (!cancelled) setJob(null);
      });
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (user) {
      if (user.displayName) setName(user.displayName);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!job) return;
    if (name.trim().length < 2) return setError('Informe seu nome.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Informe um e-mail válido.');
    if (pitch.trim().length < 20) return setError('Conte em ao menos 20 caracteres por que você.');
    let uid: string;
    try {
      const current = requireFirebaseAuth().currentUser;
      if (!current) {
        setError('Faça login para se candidatar.');
        return;
      }
      uid = current.uid;
    } catch {
      setError('Faça login para se candidatar.');
      return;
    }
    setSending(true);
    void createDocument('job_applications', {
      jobId: job.id,
      jobTitle: job.title,
      candidateId: uid,
      name: name.trim(),
      email: email.trim(),
      pitch: pitch.trim(),
      status: 'OPEN',
    })
      .then((id) => setProtocol(id))
      .catch(() => setError('Não foi possível enviar. Tente novamente.'))
      .finally(() => setSending(false));
  };

  if (!job) {
    return (
      <SitePage eyebrow="Carreiras" title="Vaga não encontrada">
        <p role="alert" style={{ color: '#B91C1C' }}>Esta vaga não existe ou foi encerrada.</p>
      </SitePage>
    );
  }

  const input = {
    width: '100%', height: 44, padding: '0 14px', borderRadius: 10,
    border: '1px solid #CBD5E1', fontSize: 14, boxSizing: 'border-box' as const, marginBottom: 12,
  };

  return (
    <SitePage eyebrow="Candidatura" title={`Candidatar-se: ${job.title}`} description="Sua candidatura é registrada com protocolo para triagem da equipe.">
      {protocol ? (
        <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 32, textAlign: 'center', maxWidth: 560 }}>
          <h3 style={{ color: '#0F172A' }}>Candidatura enviada!</h3>
          <p style={{ color: '#64748B' }}>Protocolo:</p>
          <p style={{ fontWeight: 800 }}>{protocol}</p>
        </div>
      ) : (
        <form onSubmit={submit} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 28, maxWidth: 560 }}>
          {!user && <p style={{ fontSize: 13, color: '#B91C1C' }}>Login obrigatório para candidatura. <button type="button" onClick={() => navigate('/login')} style={{ color: '#4F7FFF', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}>Entrar</button></p>}
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" aria-label="Nome completo" style={input} />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" aria-label="E-mail" style={input} />
          <textarea value={pitch} onChange={(e) => setPitch(e.target.value)} placeholder="Por que você? (mín. 20 caracteres)" aria-label="Apresentação" rows={5} style={{ ...input, height: 'auto', padding: 14, resize: 'vertical' as const }} />
          {error && <p role="alert" style={{ color: '#B91C1C', fontSize: 13 }}>{error}</p>}
          <button type="submit" disabled={sending} style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
            {sending ? 'Enviando…' : 'Enviar candidatura'}
          </button>
        </form>
      )}
    </SitePage>
  );
}
