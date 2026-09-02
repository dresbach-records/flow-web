import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react';

type AuthPageProps = { path: string; go: (path: string) => void };

const demoEmail = 'demo@flow.social';
const demoPassword = 'flow123';

export default function AuthPage({ path, go }: AuthPageProps) {
  const mode = useMemo(() => {
    if (path === '/cadastro') return 'register';
    if (path === '/recuperar-senha') return 'recover';
    if (path === '/redefinir-senha') return 'reset';
    if (path === '/verificar-conta') return 'verify';
    return 'login';
  }, [path]);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(mode === 'login' ? demoEmail : '');
  const [password, setPassword] = useState(mode === 'login' ? demoPassword : '');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (mode === 'recover') {
      setMessage('Se o e-mail estiver cadastrado, enviaremos as instruções para redefinição.');
      return;
    }
    if (mode === 'reset') {
      setMessage('Senha redefinida no modo de demonstração. Você já pode entrar no FLOW.');
      return;
    }
    if (mode === 'verify') {
      setMessage('Código de verificação aceito no modo de demonstração.');
      return;
    }
    if (mode === 'register' && !name.trim()) {
      setMessage('Informe seu nome para continuar.');
      return;
    }
    if (!email.trim() || !password.trim()) {
      setMessage('Preencha e-mail e senha para continuar.');
      return;
    }
    localStorage.setItem('flow.auth', '1');
    localStorage.setItem('flow.user.email', email.trim());
    go('/app');
  };

  const title = mode === 'register' ? 'Crie sua conta' : mode === 'recover' ? 'Recupere seu acesso' : mode === 'reset' ? 'Nova senha' : mode === 'verify' ? 'Verifique sua conta' : 'Bem-vindo de volta';
  const subtitle = mode === 'register' ? 'Entre para descobrir, criar e compartilhar.' : mode === 'recover' ? 'Digite seu e-mail e enviaremos as instruções.' : mode === 'reset' ? 'Defina uma nova senha para sua conta FLOW.' : mode === 'verify' ? 'Confirme seu código para concluir a verificação.' : 'Continue de onde você parou.';

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
            {mode === 'register' && <label>Nome<input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" autoComplete="name" /></label>}
            {mode !== 'reset' && mode !== 'verify' && <label>E-mail<div className="flow-auth-input-icon"><Mail size={17} /><input value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" type="email" autoComplete="email" /></div></label>}
            {mode === 'verify' && <label>Código de verificação<input placeholder="000000" inputMode="numeric" maxLength={6} /></label>}
            {(mode === 'login' || mode === 'register' || mode === 'reset') && <label>{mode === 'reset' ? 'Nova senha' : 'Senha'}<div className="flow-auth-password"><input value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /><button type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>}
            {mode === 'reset' && <label>Confirmar senha<input placeholder="••••••••" type="password" autoComplete="new-password" /></label>}

            {mode === 'login' && <div className="flow-auth-forgot"><button type="button" onClick={() => go('/recuperar-senha')}>Esqueci minha senha</button></div>}
            {message && <div className="flow-auth-message" role="status">{message}</div>}

            <button className="flow-auth-primary" type="submit">{mode === 'login' ? 'Entrar' : mode === 'register' ? 'Criar conta' : mode === 'recover' ? 'Enviar instruções' : mode === 'reset' ? 'Redefinir senha' : 'Verificar conta'} <ArrowRight size={17} /></button>
          </form>

          {mode === 'login' && <button className="flow-auth-demo" onClick={() => { localStorage.setItem('flow.auth', '1'); go('/app'); }}>Entrar em modo demonstração</button>}

          <div className="flow-auth-switch">
            {mode === 'login' ? <>Ainda não tem conta? <button onClick={() => go('/cadastro')}>Criar conta</button></> : mode === 'register' ? <>Já tem uma conta? <button onClick={() => go('/auth/login')}>Entrar</button></> : <button onClick={() => go('/auth/login')}>Voltar para o login</button>}
          </div>
          <small className="flow-auth-note">Modo de demonstração local · pronto para integração com autenticação por API.</small>
        </div>
      </section>
    </main>
  );
}
