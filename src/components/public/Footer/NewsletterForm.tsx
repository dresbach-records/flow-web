import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export interface NewsletterFormProps {
  onSuccess?: (email: string) => void;
}

export const NewsletterForm: React.FC<NewsletterFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    // Real submission simulation / storage
    setTimeout(() => {
      try {
        const list = JSON.parse(localStorage.getItem('flow_newsletter_subscribers') || '[]');
        if (!list.includes(email)) {
          list.push(email);
          localStorage.setItem('flow_newsletter_subscribers', JSON.stringify(list));
        }
      } catch (err) {
        console.warn('Newsletter storage issue:', err);
      }
      setLoading(false);
      setSubscribed(true);
      onSuccess?.(email);
    }, 450);
  };

  if (subscribed) {
    return (
      <div className="flow-newsletter-success">
        <CheckCircle2 size={18} color="#10B981" />
        <span>Obrigado! Seu e-mail foi cadastrado com sucesso.</span>
      </div>
    );
  }

  return (
    <form className="flow-newsletter-form" onSubmit={handleSubmit}>
      <p className="flow-newsletter-desc">
        Receba novidades, atualizações de recursos e histórias inspiradoras da comunidade.
      </p>

      <div className="flow-newsletter-input-group">
        <input
          type="email"
          placeholder="Seu melhor e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flow-newsletter-input"
          aria-label="Endereço de e-mail para newsletter"
        />
        <button
          type="submit"
          className="flow-newsletter-btn"
          disabled={loading || !email.includes('@')}
          aria-label="Assinar newsletter"
        >
          <Send size={16} />
        </button>
      </div>

      <span className="flow-newsletter-legal">
        Ao se inscrever, você concorda com nossa Política de Privacidade. Cancele a qualquer momento.
      </span>
    </form>
  );
};

export default NewsletterForm;
