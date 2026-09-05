import { CONTRIBUTOR_AREAS, CONTRIBUTOR_AVAILABILITY, CONTRIBUTOR_EXPERIENCE } from '../../../services/contributors';

export type ContribuaFormValues = {
  name: string;
  email: string;
  github: string;
  linkedin: string;
  areas: string[];
  experienceLevel: string;
  portfolio: string;
  availability: string;
  howToContribute: string;
  message: string;
};

export type ContribuaFormErrors = Partial<Record<keyof ContribuaFormValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/[^\s]+$/i;

/** Validação pura e testável do formulário "Contribua com o Flow". */
export function validateContribuaInput(values: ContribuaFormValues): ContribuaFormErrors {
  const errors: ContribuaFormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Informe seu nome.';
  } else if (values.name.trim().length < 2) {
    errors.name = 'O nome deve ter ao menos 2 caracteres.';
  }

  if (!values.email.trim()) {
    errors.email = 'Informe seu e-mail.';
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = 'Informe um e-mail válido.';
  }

  if (values.github.trim() && !/^[a-zA-Z0-9-_.]+$/.test(values.github.trim())) {
    errors.github = 'Informe um usuário do GitHub válido (sem @).';
  }

  if (values.linkedin.trim() && !/^https?:\/\/[^\s]+$/i.test(values.linkedin.trim())) {
    errors.linkedin = 'Informe a URL do seu LinkedIn (ex.: https://linkedin.com/in/usuario).';
  }

  if (values.areas.length === 0) {
    errors.areas = 'Selecione ao menos uma área de conhecimento.';
  }

  if (!values.experienceLevel) {
    errors.experienceLevel = 'Selecione seu nível de experiência.';
  } else if (!(CONTRIBUTOR_EXPERIENCE as readonly string[]).includes(values.experienceLevel)) {
    errors.experienceLevel = 'Selecione um nível de experiência válido.';
  }

  if (values.portfolio.trim() && !URL_RE.test(values.portfolio.trim())) {
    errors.portfolio = 'Informe uma URL válida (ex.: https://...).';
  }

  if (!values.availability) {
    errors.availability = 'Selecione sua disponibilidade aproximada.';
  } else if (!(CONTRIBUTOR_AVAILABILITY as readonly string[]).includes(values.availability)) {
    errors.availability = 'Selecione uma disponibilidade válida.';
  }

  if (!values.howToContribute.trim()) {
    errors.howToContribute = 'Conte como gostaria de contribuir.';
  } else if (values.howToContribute.trim().length < 10) {
    errors.howToContribute = 'Descreva com ao menos 10 caracteres.';
  }

  if (values.areas.length > 0) {
    for (const area of values.areas) {
      if (!(CONTRIBUTOR_AREAS as readonly string[]).includes(area)) {
        errors.areas = 'Área de conhecimento inválida.';
        break;
      }
    }
  }

  return errors;
}

export function hasErrors(errors: ContribuaFormErrors): boolean {
  return Object.values(errors).some(Boolean);
}

export function formValuesToContributorInput(values: ContribuaFormValues, submissionId: string) {
  return {
    submissionId,
    name: values.name.trim(),
    email: values.email.trim(),
    github: values.github.trim() || undefined,
    linkedin: values.linkedin.trim() || undefined,
    areas: values.areas as (typeof CONTRIBUTOR_AREAS)[number][],
    experienceLevel: values.experienceLevel,
    portfolio: values.portfolio.trim() || undefined,
    availability: values.availability,
    howToContribute: values.howToContribute.trim(),
    message: values.message.trim() || undefined,
  };
}