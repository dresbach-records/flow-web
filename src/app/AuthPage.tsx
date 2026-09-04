import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Ban,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  EyeOff,
  HelpCircle,
  KeyRound,
  Laptop,
  LockKeyhole,
  Mail,
  Phone,
  RefreshCw,
  Send,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trash2,
  UserCheck,
} from 'lucide-react';
import {
  configure2FAMethod,
  get2FAStatus,
  getAccountRestrictionDetails,
  getBackupCodes,
  getLinkedAccounts,
  listActiveSessions,
  loginUser,
  loginWithGoogle,
  regenerateBackupCodes,
  registerUser,
  requestPasswordReset,
  resendVerification,
  submitAccountAppeal,
  terminateSession,
  verify2FACode,
  type AccountRestrictionInfo,
  type AccountType,
  type LinkedAccount,
  type SessionRecord,
  type TwoFactorMethod,
} from '../services/firebase/auth';
import { trackEvent } from '../services/firebase/analytics';
import { FlowLogo } from '../assets/flowAssets';

type AuthPageProps = { path: string; go: (path: string) => void };

function friendlyError(error: unknown): string {
  const code = typeof error === 'object' && error && 'code' in error ? String((error as { code: string }).code) : '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-mail ou senha inválidos.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado.';
    case 'auth/weak-password':
      return 'A senha precisa ter ao menos 6 caracteres.';
    case 'auth/invalid-email':
      return 'Informe um e-mail válido.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente em instantes.';
    case 'auth/popup-closed-by-user':
      return 'A janela de autenticação do Google foi fechada.';
    default:
      return error instanceof Error ? error.message : 'Não foi possível concluir a solicitação.';
  }
}

export default function AuthPage({ path, go }: AuthPageProps) {
  const mode = useMemo(() => {
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
  }, [path]);

  // Form Fields
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('individual');
  const [cpf, setCpf] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [legalName, setLegalName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [code, setCode] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<TwoFactorMethod>('app');

  // Appeal fields for restriction screens
  const [appealDetails, setAppealDetails] = useState('');
  const [appealSent, setAppealSent] = useState(false);
  const [appealTicket, setAppealTicket] = useState('');

  // Data states
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [restriction, setRestriction] = useState<AccountRestrictionInfo | null>(null);

  // Status & Feedback
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Load specific screen data on mount or path change
  useEffect(() => {
    setError('');
    setMessage('');

    if (mode === '2fa-backup') {
      void getBackupCodes().then((codes) => {
        if (codes.length > 0) setBackupCodes(codes);
        else void regenerateBackupCodes().then(setBackupCodes);
      });
    }

    if (mode === 'sessions') {
      void listActiveSessions().then(setSessions);
    }

    if (mode === 'account-center') {
      void getLinkedAccounts().then(setLinkedAccounts);
    }

    if (mode === 'account-blocked' || mode === 'account-deactivated' || mode === 'account-suspended') {
      const type = mode === 'account-blocked' ? 'bloqueada' : mode === 'account-suspended' ? 'suspensa' : 'desativada';
      void getAccountRestrictionDetails(type).then(setRestriction);
    }
  }, [mode]);

  // Main Submit Handler
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      setBusy(true);

      // 1. Login
      if (mode === 'login') {
        if (!email.trim() || !password.trim()) return setError('Preencha e-mail e senha para continuar.');
        await loginUser(email, password);
        await trackEvent('login', { method: 'password' });
        go('/app');
        return;
      }

      // 2. Cadastro
      if (mode === 'register') {
        if (!name.trim()) return setError('Informe seu nome para continuar.');
        if (!acceptedTerms) return setError('É necessário aceitar os termos para criar a conta.');
        if (accountType === 'individual' && !cpf.trim()) return setError('Informe seu CPF.');
        if (accountType === 'business' && (!cnpj.trim() || !legalName.trim())) return setError('Informe CNPJ e razão social.');
        if (!email.trim() || !password.trim()) return setError('Preencha e-mail e senha.');

        await registerUser({
          name,
          email,
          password,
          accountType,
          acceptedTerms,
          cpf: accountType === 'individual' ? cpf : undefined,
          cnpj: accountType === 'business' ? cnpj : undefined,
          legalName: accountType === 'business' ? legalName : undefined,
          phone: phone || undefined,
          birthDate: birthDate || undefined,
        });
        await trackEvent('sign_up', { method: 'password', account_type: accountType });
        go('/app');
        return;
      }

      // 3. Recuperar senha
      if (mode === 'recover') {
        if (!email.trim()) return setError('Informe seu e-mail.');
        await requestPasswordReset(email);
        setMessage('Se o e-mail estiver cadastrado, enviamos as instruções de recuperação.');
        return;
      }

      // 4. Redefinir senha
      if (mode === 'reset') {
        if (!password || password.length < 6) return setError('A nova senha deve ter no mínimo 6 caracteres.');
        if (password !== confirmPassword) return setError('As senhas digitadas não coincidem.');
        setMessage('Senha alterada com sucesso! Redirecionando para o login...');
        setTimeout(() => go('/login'), 1500);
        return;
      }

      // 5. Verificar e-mail
      if (mode === 'verify-email') {
        await resendVerification();
        setMessage('Código de confirmação reenviado para sua caixa de entrada.');
        return;
      }

      // 6. Verificar telefone
      if (mode === 'verify-phone') {
        if (!phone.trim()) return setError('Informe seu número de telefone com DDD.');
        setMessage(`Código SMS enviado com sucesso para ${phone}.`);
        setTimeout(() => go('/confirmacao'), 1000);
        return;
      }

      // 7. Código de confirmação
      if (mode === 'confirm-code') {
        if (code.trim().length < 6) return setError('Digite o código de verificação de 6 dígitos.');
        setMessage('Código validado com sucesso!');
        setTimeout(() => go('/app'), 1000);
        return;
      }

      // 8. Validação 2FA
      if (mode === '2fa-verify') {
        await verify2FACode(code);
        setMessage('Segundo fator validado com sucesso!');
        go('/app');
        return;
      }

      // 9. Escolher método 2FA
      if (mode === '2fa-method') {
        await configure2FAMethod(selectedMethod, selectedMethod === 'sms' ? phone : email);
        setMessage('Método 2FA configurado com sucesso!');
        setTimeout(() => go('/seguranca/2fa/backup'), 1000);
        return;
      }

      // 10. Recurso de Conta (Bloqueada / Suspensa / Desativada)
      if (mode === 'account-blocked' || mode === 'account-suspended' || mode === 'account-deactivated') {
        if (!appealDetails.trim()) return setError('Descreva sua justificativa detalhadamente para análise.');
        const ticket = await submitAccountAppeal({
          email: email.trim() || 'usuario@flow.com',
          reason: restriction?.title ?? 'Recurso',
          details: appealDetails,
        });
        setAppealTicket(ticket);
        setAppealSent(true);
        setMessage(`Recurso registrado com protocolo #${ticket}. Responderemos em até 48 horas úteis.`);
        return;
      }
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  // Google Login
  const submitGoogle = async () => {
    setError('');
    setMessage('');
    if (mode === 'register' && !acceptedTerms) {
      setError('É necessário aceitar os termos para criar a conta.');
      return;
    }
    try {
      setBusy(true);
      const user = await loginWithGoogle(accountType, mode === 'register' && acceptedTerms);
      if (user) {
        await trackEvent(mode === 'register' ? 'sign_up' : 'login', { method: 'google' });
        go('/app');
      }
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  // Copy backup codes
  const copyCodes = () => {
    void navigator.clipboard.writeText(backupCodes.join('\n'));
    setMessage('Códigos de backup copiados para a área de transferência!');
  };

  // Download backup codes
  const downloadCodes = () => {
    const text = `FLOW — Códigos de Backup de Segurança\nGerados em: ${new Date().toLocaleString('pt-BR')}\n\n` + backupCodes.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flow-codigos-backup-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage('Arquivo baixado com sucesso!');
  };

  // Session termination
  const handleTerminateSession = async (id: string) => {
    try {
      setBusy(true);
      await terminateSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      setMessage('Sessão encerrada com sucesso.');
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  // Screen titles & subtitles
  const { title, subtitle } = useMemo(() => {
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
  }, [mode]);

  return (
    <main className="flow-auth-page">
      {/* Showcase Lateral */}
      <section className="flow-auth-showcase">
        <button className="flow-auth-logo" onClick={() => go('/')} aria-label="Voltar para a FLOW">
          <FlowLogo alt="FLOW" />
        </button>
        <div className="flow-auth-showcase-copy">
          <span><Sparkles size={15} /> A NOVA GERAÇÃO SOCIAL</span>
          <h1>Seu mundo.<br /><em>Em movimento.</em></h1>
          <p>Uma experiência social feita para conectar criadores, comunidades, áudio e conteúdo autêntico.</p>
          <div className="flow-auth-points">
            <div><ShieldCheck size={18} /> Criptografia de ponta a ponta e segurança ativa</div>
            <div><LockKeyhole size={18} /> Proteção rigorosa de dados e privacidade LGPD</div>
          </div>
        </div>
        <small>FLOW Platform · Versão Oficial 2026</small>
      </section>

      {/* Conteúdo Principal do Card */}
      <section className="flow-auth-content">
        <button className="flow-auth-back" onClick={() => go('/')}>
          <ArrowLeft size={17} /> Voltar ao site
        </button>

        <div className="flow-auth-card">
          <FlowLogo className="flow-auth-card-logo" alt="FLOW" />

          <div className="flow-auth-heading">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>

          {/* Botão Google nos fluxos de Login e Cadastro */}
          {(mode === 'login' || mode === 'register') && (
            <button className="flow-auth-google" type="button" onClick={submitGoogle} disabled={busy}>
              <strong>G</strong> Continuar com o Google
            </button>
          )}

          {/* Formulário Dinâmico */}
          <form onSubmit={submit}>
            {/* 1 & 2: LOGIN / CADASTRO */}
            {mode === 'register' && (
              <div className="flow-auth-account-type" role="group" aria-label="Tipo de conta">
                <button type="button" className={accountType === 'individual' ? 'active' : ''} onClick={() => setAccountType('individual')}>
                  Pessoal
                </button>
                <button type="button" className={accountType === 'business' ? 'active' : ''} onClick={() => setAccountType('business')}>
                  Empresarial
                </button>
              </div>
            )}

            {mode === 'register' && (
              <label>
                Nome completo
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" autoComplete="name" required />
              </label>
            )}

            {mode === 'register' && accountType === 'individual' && (
              <label>
                CPF
                <input value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" inputMode="numeric" required />
              </label>
            )}

            {mode === 'register' && accountType === 'business' && (
              <>
                <label>
                  CNPJ
                  <input value={cnpj} onChange={(e) => setCnpj(e.target.value)} placeholder="00.000.000/0000-00" inputMode="numeric" required />
                </label>
                <label>
                  Razão Social
                  <input value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder="Nome empresarial registrado" required />
                </label>
              </>
            )}

            {mode === 'register' && (
              <label>
                Telefone
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000" inputMode="tel" autoComplete="tel" />
              </label>
            )}

            {mode === 'register' && (
              <label>
                Data de nascimento
                <input value={birthDate} onChange={(e) => setBirthDate(e.target.value)} type="date" autoComplete="bday" />
              </label>
            )}

            {(mode === 'login' || mode === 'register' || mode === 'recover' || mode === 'verify-email') && (
              <label>
                E-mail
                <div className="flow-auth-input-icon">
                  <Mail size={17} />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" type="email" autoComplete="email" required />
                </div>
              </label>
            )}

            {(mode === 'login' || mode === 'register' || mode === 'reset') && (
              <label>
                {mode === 'reset' ? 'Nova Senha' : 'Senha'}
                <div className="flow-auth-password">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}>
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </label>
            )}

            {mode === 'reset' && (
              <label>
                Confirmar Nova Senha
                <div className="flow-auth-password">
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    required
                  />
                </div>
              </label>
            )}

            {/* 6: VERIFICAR TELEFONE */}
            {mode === 'verify-phone' && (
              <label>
                Número de Celular com DDD
                <div className="flow-auth-input-icon">
                  <Phone size={17} />
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 98765-4321" type="tel" required />
                </div>
              </label>
            )}

            {/* 7 & 8: CÓDIGO DE CONFIRMAÇÃO / 2FA */}
            {(mode === 'confirm-code' || mode === '2fa-verify') && (
              <label>
                Código de 6 dígitos
                <div className="flow-auth-input-icon">
                  <KeyRound size={17} />
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    maxLength={6}
                    style={{ letterSpacing: '4px', fontSize: '18px', textAlign: 'center', fontWeight: 'bold' }}
                    required
                  />
                </div>
              </label>
            )}

            {/* 9: ESCOLHER MÉTODO 2FA */}
            {mode === '2fa-method' && (
              <div className="flow-auth-methods-group" style={{ display: 'grid', gap: '10px', margin: '14px 0' }}>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('app')}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: selectedMethod === 'app' ? '2px solid var(--flow-primary, #137A7F)' : '1px solid #ddd',
                    background: selectedMethod === 'app' ? 'rgba(19, 122, 127, 0.08)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <Smartphone size={20} color="var(--flow-primary, #137A7F)" />
                  <div style={{ textAlign: 'left' }}>
                    <strong>Aplicativo Autenticador (Recomendado)</strong>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>Google Authenticator, Microsoft Authenticator ou 1Password</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('sms')}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: selectedMethod === 'sms' ? '2px solid var(--flow-primary, #137A7F)' : '1px solid #ddd',
                    background: selectedMethod === 'sms' ? 'rgba(19, 122, 127, 0.08)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <Phone size={20} color="var(--flow-primary, #137A7F)" />
                  <div style={{ textAlign: 'left' }}>
                    <strong>Mensagem de Texto (SMS)</strong>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>Receber código numérico diretamente no seu celular</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('email')}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: selectedMethod === 'email' ? '2px solid var(--flow-primary, #137A7F)' : '1px solid #ddd',
                    background: selectedMethod === 'email' ? 'rgba(19, 122, 127, 0.08)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <Mail size={20} color="var(--flow-primary, #137A7F)" />
                  <div style={{ textAlign: 'left' }}>
                    <strong>Código por E-mail</strong>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>Receber chave temporária no seu e-mail cadastrado</div>
                  </div>
                </button>
              </div>
            )}

            {/* 10: CÓDIGOS DE BACKUP */}
            {mode === '2fa-backup' && (
              <div style={{ margin: '14px 0' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    background: '#f9f9f7',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid #e2e2da',
                    fontFamily: 'monospace',
                    fontSize: '15px',
                    fontWeight: 600,
                  }}
                >
                  {backupCodes.map((c, idx) => (
                    <div key={idx} style={{ padding: '6px', background: '#fff', borderRadius: '6px', textAlign: 'center' }}>
                      {c}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button type="button" onClick={copyCodes} style={{ flex: 1, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                    <Copy size={16} /> Copiar
                  </button>
                  <button type="button" onClick={downloadCodes} style={{ flex: 1, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                    <Download size={16} /> Baixar
                  </button>
                  <button
                    type="button"
                    onClick={() => void regenerateBackupCodes().then(setBackupCodes)}
                    style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    title="Regerar códigos"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* 11: SESSÕES E DISPOSITIVOS */}
            {mode === 'sessions' && (
              <div style={{ margin: '14px 0', display: 'grid', gap: '10px' }}>
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid #e0e0da',
                      background: s.current ? 'rgba(19, 122, 127, 0.05)' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {s.device.includes('iPhone') || s.device.includes('Mobile') ? <Smartphone size={22} /> : <Laptop size={22} />}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>
                          {s.device} {s.current && <span style={{ color: 'var(--flow-primary, #137A7F)', fontSize: '12px' }}>(Esta sessão)</span>}
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.75 }}>
                          {s.browser} · {s.location} · {s.lastActive}
                        </div>
                      </div>
                    </div>
                    {!s.current && (
                      <button
                        type="button"
                        onClick={() => handleTerminateSession(s.id)}
                        style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', padding: '6px' }}
                        title="Encerrar sessão"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 12, 13, 14: CONTA BLOQUEADA, DESATIVADA OU SUSPENSA */}
            {(mode === 'account-blocked' || mode === 'account-deactivated' || mode === 'account-suspended') && (
              <div style={{ margin: '14px 0' }}>
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: mode === 'account-suspended' ? '#fff5f5' : '#fff9f0',
                    border: mode === 'account-suspended' ? '1px solid #feb2b2' : '1px solid #feebc8',
                    color: mode === 'account-suspended' ? '#c53030' : '#c05621',
                    marginBottom: '14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', marginBottom: '6px' }}>
                    {mode === 'account-suspended' ? <Ban size={20} /> : <AlertTriangle size={20} />}
                    {restriction?.title}
                  </div>
                  <div style={{ fontSize: '13px', lineHeight: 1.5 }}>{restriction?.reason}</div>
                  <div style={{ fontSize: '11px', marginTop: '8px', opacity: 0.8 }}>Data do registro: {restriction?.date}</div>
                </div>

                {!appealSent ? (
                  <label>
                    Justificativa do Recurso
                    <textarea
                      value={appealDetails}
                      onChange={(e) => setAppealDetails(e.target.value)}
                      placeholder="Explique os fatos ou solicite a reavaliação desta decisão..."
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        fontFamily: 'inherit',
                        fontSize: '13px',
                      }}
                      required
                    />
                  </label>
                ) : (
                  <div style={{ padding: '14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#166534', fontSize: '13px' }}>
                    <CheckCircle2 size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                    Recurso enviado sob o protocolo <strong>#{appealTicket}</strong>. Aguarde a análise da equipe de segurança.
                  </div>
                )}
              </div>
            )}

            {/* 15: CENTRAL DE CONTAS */}
            {mode === 'account-center' && (
              <div style={{ margin: '14px 0', display: 'grid', gap: '10px' }}>
                {linkedAccounts.map((account, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      border: '1px solid #e0e0da',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <UserCheck size={20} color="var(--flow-primary, #137A7F)" />
                      <div>
                        <strong>{account.providerName}</strong>
                        {account.email && <div style={{ fontSize: '12px', opacity: 0.75 }}>{account.email}</div>}
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', background: '#eef2f6' }}>
                      {account.linkedAt}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Checkbox Termos para Cadastro */}
            {mode === 'register' && (
              <label className="flow-auth-terms">
                <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} required />
                <span>
                  Li e aceito os <button type="button" onClick={() => go('/legal/termos')}>Termos de Uso</button> e a{' '}
                  <button type="button" onClick={() => go('/legal/privacidade')}>Política de Privacidade</button>.
                </span>
              </label>
            )}

            {/* Link Esqueci a Senha */}
            {mode === 'login' && (
              <div className="flow-auth-forgot">
                <button type="button" onClick={() => go('/recuperar-senha')}>
                  Esqueci minha senha
                </button>
              </div>
            )}

            {/* Mensagens de Feedback */}
            {error && <div className="flow-auth-message error" role="alert">{error}</div>}
            {message && <div className="flow-auth-message" role="status">{message}</div>}

            {/* Botão de Ação Primário */}
            <button className="flow-auth-primary" type="submit" disabled={busy}>
              {busy ? (
                'Processando…'
              ) : mode === 'login' ? (
                <>Entrar <ArrowRight size={17} /></>
              ) : mode === 'register' ? (
                <>Criar conta <ArrowRight size={17} /></>
              ) : mode === 'recover' ? (
                <>Enviar instruções <Send size={17} /></>
              ) : mode === 'reset' ? (
                <>Salvar nova senha <LockKeyhole size={17} /></>
              ) : mode === 'verify-email' ? (
                <>Reenviar verificação <RefreshCw size={17} /></>
              ) : mode === 'verify-phone' ? (
                <>Enviar código SMS <Phone size={17} /></>
              ) : mode === 'confirm-code' || mode === '2fa-verify' ? (
                <>Confirmar código <CheckCircle2 size={17} /></>
              ) : mode === '2fa-method' ? (
                <>Confirmar método <ArrowRight size={17} /></>
              ) : mode === '2fa-backup' ? (
                <>Concluir configuração <CheckCircle2 size={17} /></>
              ) : mode === 'account-blocked' || mode === 'account-suspended' || mode === 'account-deactivated' ? (
                appealSent ? 'Recurso em análise' : <>Enviar recurso <Send size={17} /></>
              ) : (
                <>Continuar <ArrowRight size={17} /></>
              )}
            </button>
          </form>

          {/* Links de Alternância e Navegação entre Telas */}
          <div className="flow-auth-switch">
            {mode === 'login' ? (
              <>
                Ainda não tem conta? <button onClick={() => go('/cadastro')}>Criar conta</button>
              </>
            ) : mode === 'register' ? (
              <>
                Já tem uma conta? <button onClick={() => go('/login')}>Entrar</button>
              </>
            ) : mode === '2fa-verify' ? (
              <>
                Problemas com o app? <button onClick={() => go('/seguranca/2fa/backup')}>Usar código de backup</button>
              </>
            ) : mode === 'account-blocked' || mode === 'account-suspended' || mode === 'account-deactivated' ? (
              <>
                Precisa de suporte? <button onClick={() => go('/ajuda')}>Central de Ajuda</button>
              </>
            ) : (
              <button onClick={() => go('/login')}>Voltar para o login</button>
            )}
          </div>

          <small className="flow-auth-note">Autenticação e segurança geridas via Firebase & Flow Shield.</small>
        </div>
      </section>
    </main>
  );
}
