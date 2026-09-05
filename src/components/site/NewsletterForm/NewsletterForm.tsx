import { useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import { subscribeNewsletter } from '../../../services/firebase/newsletter';
import './NewsletterForm.css';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === 'busy') return;
    setState('busy');
    setMessage('');
    try {
      await subscribeNewsletter(email, consent);
      setState('done');
      setMessage('Inscrição confirmada. Bem-vindo(a) às novidades da Flow!');
      setEmail('');
      setConsent(false);
    } catch (cause) {
      setState('error');
      setMessage(cause instanceof Error ? cause.message : 'Não foi possível concluir a inscrição.');
    }
  };

  return (
    <form className="site-newsletter" onSubmit={submit} aria-label="Newsletter da Flow">
      <strong>Novidades da Flow</strong>
      <div className="site-newsletter-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu melhor e-mail"
          aria-label="E-mail para newsletter"
        />
        <button type="submit" disabled={state === 'busy'} aria-label="Inscrever">
          <Send size={18} />
        </button>
      </div>
      <label className="site-newsletter-consent">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
        <span>Aceito receber novidades da Flow por e-mail.</span>
      </label>
      {message && (
        <p className={`site-newsletter-msg is-${state}`} role={state === 'error' ? 'alert' : 'status'}>
          {state === 'done' && <CheckCircle2 size={15} />} {message}
        </p>
      )}
    </form>
  );
}
