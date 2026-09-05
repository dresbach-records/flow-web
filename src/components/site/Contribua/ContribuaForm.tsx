import { useMemo, useState } from 'react';
import {
  CONTRIBUTOR_AREAS,
  CONTRIBUTOR_AVAILABILITY,
  CONTRIBUTOR_EXPERIENCE,
  newSubmissionId,
  submitContributor,
} from '../../../services/contributors';
import { formValuesToContributorInput, hasErrors, validateContribuaInput, type ContribuaFormValues } from './Contribua.validation';

const INITIAL_VALUES: ContribuaFormValues = {
  name: '',
  email: '',
  github: '',
  linkedin: '',
  areas: [],
  experienceLevel: '',
  portfolio: '',
  availability: '',
  howToContribute: '',
  message: '',
};

export default function ContribuaForm() {
  // Chave de idempotência: evita submissões duplicadas no backend.
  const submissionId = useMemo(() => newSubmissionId(), []);

  const [values, setValues] = useState<ContribuaFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ReturnType<typeof validateContribuaInput>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const setField = <K extends keyof ContribuaFormValues>(key: K, value: ContribuaFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
    setStatus('idle');
  };

  const toggleArea = (area: string) => {
    setValues((prev) => ({
      ...prev,
      areas: prev.areas.includes(area) ? prev.areas.filter((a) => a !== area) : [...prev.areas, area],
    }));
    setErrors((prev) => (prev.areas ? { ...prev, areas: undefined } : prev));
    setStatus('idle');
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading' || status === 'success') return;
    setStatusMessage('');
    const nextErrors = validateContribuaInput(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      setStatus('error');
      setStatusMessage('Revise os campos destacados e tente novamente.');
      return;
    }
    setStatus('loading');
    void submitContributor(formValuesToContributorInput(values, submissionId))
      .then(() => {
        setStatus('success');
        setStatusMessage('Obrigado pelo interesse em contribuir com o Flow.');
      })
      .catch((cause: unknown) => {
        const message = cause instanceof Error ? cause.message : 'Não foi possível enviar. Tente novamente.';
        setStatus('error');
        setStatusMessage(
          message === 'CONTRIBUTOR_DUPLICATE'
            ? 'Esta manifestação já foi registrada. Em caso de dúvida, fale conosco.'
            : 'Não foi possível enviar sua manifestação. Tente novamente em instantes.',
        );
      });
  };

  if (status === 'success') {
    return (
      <div className="contribua-success" role="status">
        <h3>Obrigado pelo interesse em contribuir com o Flow.</h3>
        <p>
          Sua manifestação foi recebida e será analisada pela equipe do projeto.
          <br />
          Estamos construindo o Flow passo a passo — e talvez você possa fazer parte desse começo.
        </p>
      </div>
    );
  }

  const inputAria = (field: keyof ContribuaFormValues) => ({
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `${field}-error` : undefined,
  });

  return (
    <form className="contribua-form" onSubmit={submit} noValidate>
      <span className="contribua-section-eyebrow">Formulário de interesse</span>
      <h2>Quero contribuir com o Flow</h2>

      <div className="contribua-field">
        <label htmlFor="contribua-name">Nome</label>
        <input id="contribua-name" type="text" autoComplete="name" value={values.name} onChange={(e) => setField('name', e.target.value)} placeholder="Seu nome" {...inputAria('name')} />
        {errors.name && <p className="contribua-error" id="name-error">{errors.name}</p>}
      </div>

      <div className="contribua-field">
        <label htmlFor="contribua-email">E-mail</label>
        <input id="contribua-email" type="email" autoComplete="email" value={values.email} onChange={(e) => setField('email', e.target.value)} placeholder="voce@exemplo.com" {...inputAria('email')} />
        {errors.email && <p className="contribua-error" id="email-error">{errors.email}</p>}
      </div>

      <div className="contribua-field">
        <label htmlFor="contribua-github">GitHub</label>
        <input id="contribua-github" type="text" autoComplete="off" value={values.github} onChange={(e) => setField('github', e.target.value)} placeholder="usuário do GitHub (opcional)" {...inputAria('github')} />
        {errors.github && <p className="contribua-error" id="github-error">{errors.github}</p>}
      </div>

      <div className="contribua-field">
        <label htmlFor="contribua-linkedin">LinkedIn</label>
        <input id="contribua-linkedin" type="url" autoComplete="off" value={values.linkedin} onChange={(e) => setField('linkedin', e.target.value)} placeholder="https://linkedin.com/in/usuario (opcional)" {...inputAria('linkedin')} />
        {errors.linkedin && <p className="contribua-error" id="linkedin-error">{errors.linkedin}</p>}
      </div>

      <div className="contribua-field">
        <label id="contribua-areas-label">Área de conhecimento</label>
        <div className="contribua-chips" role="group" aria-labelledby="contribua-areas-label" aria-describedby={errors.areas ? 'areas-error' : undefined}>
          {CONTRIBUTOR_AREAS.map((area) => {
            const active = values.areas.includes(area);
            return (
              <button key={area} type="button" className={`contribua-chip${active ? ' is-active' : ''}`} aria-pressed={active} onClick={() => toggleArea(area)}>
                {area}
              </button>
            );
          })}
        </div>
        {errors.areas && <p className="contribua-error" id="areas-error">{errors.areas}</p>}
      </div>

      <div className="contribua-field">
        <label htmlFor="contribua-experience">Nível de experiência</label>
        <select id="contribua-experience" value={values.experienceLevel} onChange={(e) => setField('experienceLevel', e.target.value)} {...inputAria('experienceLevel')}>
          <option value="">Selecione…</option>
          {CONTRIBUTOR_EXPERIENCE.map((level) => <option key={level} value={level}>{level}</option>)}
        </select>
        {errors.experienceLevel && <p className="contribua-error" id="experienceLevel-error">{errors.experienceLevel}</p>}
      </div>

      <div className="contribua-field">
        <label htmlFor="contribua-portfolio">Portfólio</label>
        <input id="contribua-portfolio" type="url" autoComplete="off" value={values.portfolio} onChange={(e) => setField('portfolio', e.target.value)} placeholder="https://... (opcional)" {...inputAria('portfolio')} />
        {errors.portfolio && <p className="contribua-error" id="portfolio-error">{errors.portfolio}</p>}
      </div>

      <div className="contribua-field">
        <label htmlFor="contribua-availability">Disponibilidade aproximada</label>
        <select id="contribua-availability" value={values.availability} onChange={(e) => setField('availability', e.target.value)} {...inputAria('availability')}>
          <option value="">Selecione…</option>
          {CONTRIBUTOR_AVAILABILITY.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        {errors.availability && <p className="contribua-error" id="availability-error">{errors.availability}</p>}
      </div>

      <div className="contribua-field">
        <label htmlFor="contribua-how">Como gostaria de contribuir?</label>
        <textarea id="contribua-how" rows={4} value={values.howToContribute} onChange={(e) => setField('howToContribute', e.target.value)} placeholder="Conte em quais áreas e de que forma você gostaria de ajudar…" {...inputAria('howToContribute')} />
        {errors.howToContribute && <p className="contribua-error" id="howToContribute-error">{errors.howToContribute}</p>}
      </div>

      <div className="contribua-field">
        <label htmlFor="contribua-message">Mensagem</label>
        <textarea id="contribua-message" rows={4} value={values.message} onChange={(e) => setField('message', e.target.value)} placeholder="Algo mais que queira contar (opcional)" {...inputAria('message')} />
      </div>

      {status === 'error' && statusMessage && (
        <p className="contribua-form-status is-error" role="alert">{statusMessage}</p>
      )}

      <button type="submit" className="contribua-btn" disabled={status === 'loading'}>
        {status === 'loading' ? 'Enviando…' : 'Enviar manifestação'}
      </button>
    </form>
  );
}