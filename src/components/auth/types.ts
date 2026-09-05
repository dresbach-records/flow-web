// FLOW — Auth domain types (FASE 3).
// Modo de tela + resolução por rota + títulos, extraídos de
// src/app/AuthPage.tsx sem alterar o comportamento. Lógica Firebase intacta.

export type AuthMode =
  | 'login'
  | 'register'
  | 'recover'
  | 'reset'
  | 'verify-email'
  | 'verify-phone'
  | 'confirm-code'
  | '2fa-verify'
  | '2fa-method'
  | '2fa-backup'
  | 'sessions'
  | 'account-blocked'
  | 'account-deactivated'
  | 'account-suspended'
  | 'account-center';

export function resolveAuthMode(path: string): AuthMode {
  if (path === '/cadastro') return 'register';
  if (path === '/recuperar-senha') return 'recover';
  if (path === '/redefinir-senha') return 'reset';
  if (path === '/verificar-email' || path === '/verificar-conta') return 'verify-email';
  if (path === '/verificar-telefone') return 'verify-phone';
  if (path === '/confirmacao') return 'confirm-code';
  if (path === '/seguranca/2fa') return '2fa-verify';
  if (path === '/seguranca/2fa/metodo') return '2fa-method';
  if (path === '/seguranca/2fa/backup') return '2fa-backup';
  if (path === '/seguranca/sessoes') return 'sessions';
  if (path === '/conta/bloqueada') return 'account-blocked';
  if (path === '/conta/desativada') return 'account-deactivated';
  if (path === '/conta/suspensa') return 'account-suspended';
  if (path === '/central-contas') return 'account-center';
  return 'login';
}

export function authTitle(mode: AuthMode): { title: string; subtitle: string } {
  switch (mode) {
    case 'register':
      return { title: 'Crie sua conta', subtitle: 'Entre para descobrir, criar e compartilhar.' };
    case 'recover':
      return { title: 'Recupere seu acesso', subtitle: 'Digite seu e-mail para receber as instruções.' };
    case 'reset':
      return { title: 'Nova senha', subtitle: 'Defina uma senha forte para sua conta FLOW.' };
    case 'verify-email':
      return { title: 'Verifique seu e-mail', subtitle: 'Confirme seu endereço de e-mail para ativar sua conta.' };
    case 'verify-phone':
      return { title: 'Verifique seu telefone', subtitle: 'Enviaremos um código SMS de confirmação.' };
    case 'confirm-code':
      return { title: 'Código de confirmação', subtitle: 'Digite o código de 6 dígitos que enviamos para você.' };
    case '2fa-verify':
      return { title: 'Autenticação em duas etapas', subtitle: 'Insira o código do seu aplicativo autenticador.' };
    case '2fa-method':
      return { title: 'Escolha o método 2FA', subtitle: 'Aumente a segurança do seu acesso com segundo fator.' };
    case '2fa-backup':
      return { title: 'Códigos de backup', subtitle: 'Guarde esses códigos em um local seguro para emergências.' };
    case 'sessions':
      return { title: 'Sessões e dispositivos', subtitle: 'Gerencie onde sua conta FLOW está conectada.' };
    case 'account-blocked':
      return { title: 'Conta bloqueada', subtitle: 'Por segurança, o acesso temporário foi bloqueado.' };
    case 'account-deactivated':
      return { title: 'Conta desativada', subtitle: 'Sua conta encontra-se atualmente desativada.' };
    case 'account-suspended':
      return { title: 'Conta suspensa', subtitle: 'Acesso suspenso conforme as diretrizes da comunidade.' };
    case 'account-center':
      return { title: 'Central de Contas', subtitle: 'Gerencie provedores e métodos de acesso vinculados.' };
    default:
      return { title: 'Bem-vindo de volta', subtitle: 'Continue de onde você parou.' };
  }
}
