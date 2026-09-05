import { describe, expect, it } from 'vitest';
import { hasErrors, validateContribuaInput } from './Contribua.validation';

const validInput = {
  name: 'Maria Souza',
  email: 'maria@example.com',
  github: 'mariasouza',
  linkedin: 'https://linkedin.com/in/mariasouza',
  areas: ['Frontend', 'Backend'],
  experienceLevel: 'Pleno',
  portfolio: 'https://maria.dev',
  availability: '5–10 horas por semana',
  howToContribute: 'Quero ajudar no desenvolvimento do feed e da API.',
  message: 'Tenho experiência com React e Node.',
};

describe('validateContribuaInput', () => {
  it('aceita um preenchimento válido', () => {
    const errors = validateContribuaInput(validInput);
    expect(errors).toEqual({});
    expect(hasErrors(errors)).toBe(false);
  });

  it('rejeita nome ausente ou curto demais', () => {
    expect(validateContribuaInput({ ...validInput, name: '' }).name).toBeTruthy();
    expect(validateContribuaInput({ ...validInput, name: 'A' }).name).toBeTruthy();
  });

  it('rejeita e-mail inválido', () => {
    expect(validateContribuaInput({ ...validInput, email: 'invalido' }).email).toBeTruthy();
    expect(validateContribuaInput({ ...validInput, email: '' }).email).toBeTruthy();
  });

  it('rejeita ausência de áreas de conhecimento', () => {
    const errors = validateContribuaInput({ ...validInput, areas: [] });
    expect(errors.areas).toBeTruthy();
  });

  it('rejeita área fora da lista permitida', () => {
    const errors = validateContribuaInput({ ...validInput, areas: ['Frontend', 'Marketing'] });
    expect(errors.areas).toBeTruthy();
  });

  it('rejeita nível de experiência inválido', () => {
    expect(validateContribuaInput({ ...validInput, experienceLevel: '' }).experienceLevel).toBeTruthy();
    expect(validateContribuaInput({ ...validInput, experienceLevel: 'God' }).experienceLevel).toBeTruthy();
  });

  it('rejeita disponibilidade inválida', () => {
    expect(validateContribuaInput({ ...validInput, availability: '' }).availability).toBeTruthy();
    expect(validateContribuaInput({ ...validInput, availability: 'Tempo integral' }).availability).toBeTruthy();
  });

  it('rejeita texto de contribuição curto ou ausente', () => {
    expect(validateContribuaInput({ ...validInput, howToContribute: '' }).howToContribute).toBeTruthy();
    expect(validateContribuaInput({ ...validInput, howToContribute: 'curto' }).howToContribute).toBeTruthy();
  });

  it('rejeita portfólio com URL inválida', () => {
    expect(validateContribuaInput({ ...validInput, portfolio: 'nao-e-url' }).portfolio).toBeTruthy();
  });

  it('aceita campos opcionais vazios (github, linkedin, portfolio, mensagem)', () => {
    const errors = validateContribuaInput({
      ...validInput,
      github: '',
      linkedin: '',
      portfolio: '',
      message: '',
    });
    expect(errors).toEqual({});
  });
});