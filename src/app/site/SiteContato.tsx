// FLOW — Fale conosco (formulário real → POST /api/v1/contact).
import { useState } from 'react';
import { apiRequest } from '../../services/api/client';
import SitePage from './SitePage';

const CATEGORIES = ['Dúvida', 'Problema técnico', 'Denúncia', 'Imprensa', 'Parcerias', 'Outro'];

export function SiteContato() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [protocol, setProtocol] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const input = {
    width: '100%', height: 44, padding: '0 14px', borderRadius: 10,
    border: '1px solid #CBD5E1', fontSize: 14, boxSizing: 'border-box' as const, marginBottom: 12,
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) return setError('Informe seu nome.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Informe um e-mail válido.');
    if (subject.trim().length < 3) return setError('Informe o assunto.');
    if (message.trim().length < 10) return setError('Descreva com pelo menos 10 caracteres.');
    setSending(true);
    void apiRequest<{ id: string }>({
      path: '/api/v1/contact',
      method: 'POST',
      body: { name: name.trim(), email: email.trim(), subject: subject.trim(), category, message: message.trim() },
    })
      .then((res) => setProtocol(res.id))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Não foi possível enviar.'))
      .finally(() => setSending(false));
  };

  return (
    <SitePage eyebrow="Fale conosco" title="Contato" description="Mensagens registradas com protocolo e triadas pela equipe.">
      {protocol ? (
        <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 32, textAlign: 'center', maxWidth: 560 }}>
          <h3 style={{ color: '#0F172A' }}>Mensagem enviada!</h3>
          <p style={{ color: '#64748B' }}>Protocolo:</p>
          <p style={{ fontWeight: 800 }}>{protocol}</p>
        </div>
      ) : (
        <form onSubmit={submit} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 28, maxWidth: 560 }}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" aria-label="Nome" style={input} />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" aria-label="E-mail" style={input} />
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Assunto" aria-label="Assunto" style={input} />
          <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Categoria" style={{ ...input, background: '#FFF' }}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Mensagem" aria-label="Mensagem" rows={5} style={{ ...input, height: 'auto', padding: 14, resize: 'vertical' as const }} />
          {error && <p role="alert" style={{ color: '#B91C1C', fontSize: 13 }}>{error}</p>}
          <button
            type="submit" disabled={sending}
            style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}
          >
            {sending ? 'Enviando…' : 'Enviar mensagem'}
          </button>
        </form>
      )}
    </SitePage>
  );
}
