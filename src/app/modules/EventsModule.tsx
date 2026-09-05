// FLOW — Eventos (backend real: criar, listar, RSVP, cancelar).
import React, { useCallback, useEffect, useState } from 'react';
import { navigate } from '../../hooks/useRouter';
import { useAppContext } from '../../contexts/AppContext';
import {
  cancelEvent,
  countRsvps,
  createEvent,
  getEvent,
  getMyRsvp,
  listEvents,
  removeRsvp,
  setRsvp,
  type FlowEvent,
  type RsvpStatus,
} from '../../services/firebase/events';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

export function EventsModule() {
  const [events, setEvents] = useState<FlowEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setEvents(await listEvents());
    } catch {
      setError('Não foi possível carregar os eventos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 20px 60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Eventos</h1>
        <button
          type="button"
          onClick={() => navigate('/app/eventos/criar')}
          style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 800, cursor: 'pointer' }}
        >
          Criar evento
        </button>
      </div>
      <p style={{ margin: '0 0 18px 0', fontSize: 14, color: '#64748B' }}>Encontros reais com presença confirmada.</p>
      {loading && <LoadingState message="Carregando eventos…" />}
      {!loading && error && <ErrorState description={error} onRetry={() => reload()} />}
      {!loading && !error && events.length === 0 && (
        <EmptyState title="Nenhum evento" description="Crie o primeiro evento da comunidade." />
      )}
      {!loading && !error && events.map((e) => (
        <button
          key={e.id}
          type="button"
          onClick={() => navigate(`/app/eventos/${e.id}`)}
          style={{ display: 'block', width: '100%', textAlign: 'left', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 18, marginBottom: 10, cursor: 'pointer' }}
        >
          <strong style={{ display: 'block', fontSize: 16, color: '#0F172A' }}>{e.title}</strong>
          <span style={{ fontSize: 13, color: '#64748B' }}>{formatDate(e.startsAt)} · {e.online ? 'Online' : e.location || 'Local a definir'}</span>
        </button>
      ))}
    </div>
  );
}

export function EventDetail({ id }: { id: string }) {
  const { user } = useAppContext();
  const [event, setEvent] = useState<FlowEvent | null>(null);
  const [rsvp, setRsvpState] = useState<RsvpStatus | null>(null);
  const [going, setGoing] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const found = await getEvent(id);
      if (!found || found.status === 'CANCELLED') {
        setError(found ? 'Evento cancelado.' : 'Evento não encontrado.');
        return;
      }
      setEvent(found);
      const [mine, count] = await Promise.all([
        getMyRsvp(id).catch(() => null),
        countRsvps(id, 'going').catch(() => 0),
      ]);
      setRsvpState(mine);
      setGoing(count);
    } catch {
      setError('Não foi possível carregar.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void reload(); }, [reload]);

  if (loading) {
    return <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 20px' }}><LoadingState message="Carregando evento…" /></div>;
  }
  if (error || !event) {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 20px' }}>
        <ErrorState description={error ?? 'Evento não encontrado.'} onRetry={() => reload()} />
      </div>
    );
  }

  const isOwner = event.ownerId !== '' && event.ownerId === user?.uid;

  const doRsvp = (status: RsvpStatus) => {
    setNotice(null);
    const previous = rsvp;
    setRsvpState(status);
    void setRsvp(id, status)
      .then(() => reload())
      .catch((err: unknown) => {
        setRsvpState(previous);
        setNotice(err instanceof Error ? err.message : 'Falha. Faça login.');
      });
  };

  const leave = () => {
    setNotice(null);
    const previous = rsvp;
    setRsvpState(null);
    void removeRsvp(id)
      .then(() => reload())
      .catch(() => setRsvpState(previous));
  };

  const cancel = () => {
    setNotice(null);
    void cancelEvent(id)
      .then(() => reload())
      .catch(() => setNotice('Falha ao cancelar.'));
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 20px 60px' }}>
      <button type="button" onClick={() => navigate('/app/eventos')} style={{ background: 'none', border: 'none', color: '#4F7FFF', fontWeight: 800, cursor: 'pointer', marginBottom: 12 }}>
        ← Eventos
      </button>
      <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 24 }}>
        <h1 style={{ margin: '0 0 6px 0', fontSize: 22, color: '#0F172A' }}>{event.title}</h1>
        <p style={{ margin: '0 0 12px 0', fontSize: 14, color: '#64748B' }}>
          {formatDate(event.startsAt)} · {event.online ? 'Online' : event.location || 'Local a definir'} · {going} vão
        </p>
        {event.description && <p style={{ fontSize: 15, color: '#1E293B', lineHeight: 1.6 }}>{event.description}</p>}
        {notice && <p role="alert" style={{ color: '#B91C1C', fontSize: 13 }}>{notice}</p>}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          {rsvp ? (
            <>
              <span style={{ padding: '9px 18px', borderRadius: 10, background: '#ECFDF5', color: '#065F46', fontWeight: 800, fontSize: 13.5 }}>
                {rsvp === 'going' ? 'Você vai ✓' : 'Interessado ✓'}
              </span>
              <button type="button" onClick={leave} style={btn()}>Sair</button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => doRsvp('going')} style={btnPrimary()}>Vou</button>
              <button type="button" onClick={() => doRsvp('interested')} style={btn()}>Interessado</button>
            </>
          )}
          {isOwner && <button type="button" onClick={cancel} style={btnDanger()}>Cancelar evento</button>}
        </div>
      </div>
    </div>
  );
}

export function EventCreate() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [online, setOnline] = useState(false);
  const [startsAt, setStartsAt] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const input = {
    width: '100%', height: 44, padding: '0 14px', borderRadius: 10,
    border: '1px solid #CBD5E1', fontSize: 14, boxSizing: 'border-box' as const, marginBottom: 12,
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    void createEvent({ title, description, location, online, startsAt })
      .then((eventId) => navigate(`/app/eventos/${eventId}`))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Não foi possível criar.');
        setSending(false);
      });
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 20px 60px' }}>
      <h1 style={{ margin: '0 0 6px 0', fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Criar evento</h1>
      <p style={{ margin: '0 0 18px 0', fontSize: 14, color: '#64748B' }}>Presencial ou online, com confirmações reais.</p>
      <form onSubmit={submit} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 24 }}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" aria-label="Título" style={input} maxLength={120} />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição (opcional)" aria-label="Descrição" rows={4} style={{ ...input, height: 'auto', padding: 14, resize: 'vertical' as const }} maxLength={2000} />
        <input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} aria-label="Data e hora" style={input} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginBottom: 12 }}>
          <input type="checkbox" checked={online} onChange={(e) => setOnline(e.target.checked)} /> Evento online
        </label>
        {!online && (
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Local" aria-label="Local" style={input} maxLength={160} />
        )}
        {error && <p role="alert" style={{ color: '#B91C1C', fontSize: 13 }}>{error}</p>}
        <button type="submit" disabled={sending} style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
          {sending ? 'Criando…' : 'Criar evento'}
        </button>
      </form>
    </div>
  );
}

function btn(): React.CSSProperties {
  return { padding: '9px 18px', borderRadius: 10, border: '1px solid #CBD5E1', background: '#FFF', fontWeight: 700, fontSize: 13.5, cursor: 'pointer' };
}

function btnPrimary(): React.CSSProperties {
  return { padding: '9px 18px', borderRadius: 10, border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 800, fontSize: 13.5, cursor: 'pointer' };
}

function btnDanger(): React.CSSProperties {
  return { padding: '9px 18px', borderRadius: 10, border: '1px solid #FECACA', background: '#FFF', color: '#B91C1C', fontWeight: 700, fontSize: 13.5, cursor: 'pointer' };
}
