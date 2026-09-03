import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { loginUser, registerUser, requestPasswordReset, resendVerification, type AccountType } from '../services/firebase/auth';
import { trackEvent } from '../services/firebase/analytics';

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
    default:
      return error instanceof Error ? error.message : 'Não foi possível concluir a solicitação.';
  }
}

export default function AuthPage({ path, go }: AuthPageProps) {
  const mode = useMemo(() => {
    if (path === '/cadastro') return 'register';
    if (path === '/recuperar-senha') return 'recover';
    if (path === '/redefinir-senha') return 'reset';
    if (path === '/verificar-conta') return 'verify';
    return 'login';
  }, [path]);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('individual');
  const [cpf, setCpf] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [legalName, setLegalName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      setBusy(true);
      if (mode === 'recover') {
        if (!email.trim()) return setError('Informe seu e-mail.');
        await requestPasswordReset(email);
        setMessage('Se o e-mail estiver cadastrado, enviaremos as instruções de redefinição.');
        return;
      }
      if (mode === 'reset') {
        setMessage('A redefinição de senha é concluída pelo link enviado ao seu e-mail.');
        return;
      }
      if (mode === 'verify') {
        await resendVerification();
        setMessage('Reenviamos o e-mail de verificação para sua caixa de entrada.');
        return;
      }
      if (!email.trim() || !password.trim()) return setError('Preencha e-mail e senha para continuar.');

      if (mode === 'register') {
        if (!name.trim()) return setError('Informe seu nome para continuar.');
        if (!acceptedTerms) return setError('É necessário aceitar os termos para criar a conta.');
        if (accountType === 'individual' && !cpf.trim()) return setError('Informe seu CPF.');
        if (accountType === 'business' && (!cnpj.trim() || !legalName.trim())) return setError('Informe CNPJ e razão social.');
        await registerUser({
          name, email, password, accountType, acceptedTerms,
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

      await loginUser(email, password);
      await trackEvent('login', { method: 'password' });
      go('/app');
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  const title = mode === 'register' ? 'Crie sua conta' : mode === 'recover' ? 'Recupere seu acesso' : mode === 'reset' ? 'Nova senha' : mode === 'verify' ? 'Verifique sua conta' : 'Bem-vindo de volta';
  const subtitle = mode === 'register' ? 'Entre para descobrir, criar e compartilhar.' : mode === 'recover' ? 'Digite seu e-mail e enviaremos as instruções.' : mode === 'reset' ? 'Defina uma nova senha para sua conta FLOW.' : mode === 'verify' ? 'Confirme seu e-mail para concluir a verificação.' : 'Continue de onde você parou.';

  return (
    <main className="flow-auth-page">
      <section className="flow-auth-showcase">
        <button className="flow-auth-logo" onClick={() => go('/')} aria-label="Voltar para o FLOW">
          <img src="/flow-logo.svg" alt="FLOW" />
        </button>
        <div className="flow-auth-showcase-copy">
          <span><Sparkles size={15} /> A NOVA GERAÇÃO SOCIAL</span>
          <h1>Seu mundo.<br /><em>Em movimento.</em></h1>
          <p>Uma experiência social para descobrir pessoas, vídeos, ideias e comunidades em um só lugar.</p>
          <div className="flow-auth-points">
            <div><ShieldCheck /> Segurança e controle</div>
            <div><LockKeyhole /> Privacidade desde o primeiro acesso</div>
          </div>
        </div>
        <small>FLOW · 2026</small>
      </section>

      <section className="flow-auth-content">
        <button className="flow-auth-back" onClick={() => go('/')}><ArrowLeft size={17} /> Voltar ao site</button>
        <div className="flow-auth-card">
          <img className="flow-auth-card-logo" src="/flow-logo.svg" alt="FLOW" />
          <div className="flow-auth-heading">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>

          <form onSubmit={submit}>
            {mode === 'register' && (
              <div className="flow-auth-account-type" role="group" aria-label="Tipo de conta">
                <button type="button" className={accountType === 'individual' ? 'active' : ''} onClick={() => setAccountType('individual')}>Pessoal</button>
                <button type="button" className={accountType === 'business' ? 'active' : ''} onClick={() => setAccountType('business')}>Empresarial</button>
              </div>
            )}
            {mode === 'register' && <label>Nome<input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" autoComplete="name" /></label>}
            {mode === 'register' && accountType === 'individual' && <label>CPF<input value={cpf} onChange={e => setCpf(e.target.value)} placeholder="000.000.000-00" inputMode="numeric" /></label>}
            {mode === 'register' && accountType === 'business' && <label>CNPJ<input value={cnpj} onChange={e => setCnpj(e.target.value)} placeholder="00.000.000/0000-00" inputMode="numeric" /></label>}
            {mode === 'register' && accountType === 'business' && <label>Razão social<input value={legalName} onChange={e => setLegalName(e.target.value)} placeholder="Nome empresarial" /></label>}
            {mode === 'register' && <label>Telefone<input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(00) 00000-0000" inputMode="tel" autoComplete="tel" /></label>}
            {mode === 'register' && <label>Data de nascimento<input value={birthDate} onChange={e => setBirthDate(e.target.value)} type="date" autoComplete="bday" /></label>}
            {mode !== 'reset' && mode !== 'verify' && <label>E-mail<div className="flow-auth-input-icon"><Mail size={17} /><input value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" type="email" autoComplete="email" /></div></label>}
            {mode === 'verify' && <label>E-mail<div className="flow-auth-input-icon"><Mail size={17} /><input value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" type="email" autoComplete="email" /></div></label>}
            {(mode === 'login' || mode === 'register') && <label>Senha<div className="flow-auth-password"><input value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /><button type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>}

            {mode === 'register' && (
              <label className="flow-auth-terms">
                <input type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} />
                <span>Li e aceito os <button type="button" onClick={() => go('/legal/termos')}>Termos</button> e a <button type="button" onClick={() => go('/legal/privacidade')}>Política de Privacidade</button>.</span>
              </label>
            )}

            {mode === 'login' && <div className="flow-auth-forgot"><button type="button" onClick={() => go('/recuperar-senha')}>Esqueci minha senha</button></div>}
            {error && <div className="flow-auth-message error" role="alert">{error}</div>}
            {message && <div className="flow-auth-message" role="status">{message}</div>}

            <button className="flow-auth-primary" type="submit" disabled={busy}>{busy ? 'Processando…' : mode === 'login' ? 'Entrar' : mode === 'register' ? 'Criar conta' : mode === 'recover' ? 'Enviar instruções' : mode === 'reset' ? 'Redefinir senha' : 'Reenviar verificação'} <ArrowRight size={17} /></button>
          </form>

          <div className="flow-auth-switch">
            {mode === 'login' ? <>Ainda não tem conta? <button onClick={() => go('/cadastro')}>Criar conta</button></> : mode === 'register' ? <>Já tem uma conta? <button onClick={() => go('/auth/login')}>Entrar</button></> : <button onClick={() => go('/auth/login')}>Voltar para o login</button>}
          </div>
          <small className="flow-auth-note">Autenticação segura via Firebase.</small>
        </div>
      </section>
    </main>
  );
}
