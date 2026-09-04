import React, { useState } from 'react';
import {
  Heart,
  HeartHandshake,
  Shield,
  FileText,
  MessageCircle,
  Share2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Settings,
  Trash2,
  Upload,
  User,
  Users,
  ChevronRight,
  ChevronDown,
  Camera,
  Video,
  Paperclip,
  Eye,
  Info,
  Lock,
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';
import './memorial.css';

interface MemorialProps {
  path?: string;
  go?: (to: string) => void;
  initialScreen?: number;
}

const SCREENS = [
  { id: 351, name: 'Início', route: '/memorial' },
  { id: 352, name: 'Perfil Público', route: '/memorial/carlos.eduardo' },
  { id: 353, name: 'Homenagens', route: '/memorial/homenagens' },
  { id: 354, name: 'Criar Homenagem', route: '/memorial/homenagem/criar' },
  { id: 355, name: 'Solicitar Memorial', route: '/memorial/solicitar' },
  { id: 356, name: 'Verificação', route: '/memorial/verificacao' },
  { id: 357, name: 'Acompanhamento', route: '/memorial/acompanhamento' },
  { id: 358, name: 'Configurações de Legado', route: '/configuracoes/memorial' },
  { id: 359, name: 'Representante', route: '/memorial/representante' },
  { id: 360, name: 'Administração', route: '/memorial/administracao' },
  { id: 361, name: 'Denunciar', route: '/memorial/denunciar' },
  { id: 362, name: 'Solicitar Remoção', route: '/memorial/remocao' },
  { id: 363, name: 'Confirmação', route: '/memorial/confirmacao' },
  { id: 364, name: 'Ajuda e FAQ', route: '/memorial/ajuda' },
  { id: 365, name: 'Mensagem Final', route: '/memorial/mensagem-final' },
];

export default function MemorialModule({ path = '/memorial', go = () => {}, initialScreen }: MemorialProps) {
  // Determine screen from route path or initialScreen
  const getScreenFromPath = (p: string) => {
    if (initialScreen) return initialScreen;
    if (p.includes('/homenagem/criar')) return 354;
    if (p.includes('/homenagens')) return 353;
    if (p.includes('/verificacao')) return 356;
    if (p.includes('/acompanhamento')) return 357;
    if (p.includes('/solicitar')) return 355;
    if (p.includes('/configuracoes/memorial') || p.includes('/legado')) return 358;
    if (p.includes('/representante')) return 359;
    if (p.includes('/administracao')) return 360;
    if (p.includes('/denunciar')) return 361;
    if (p.includes('/remocao')) return 362;
    if (p.includes('/confirmacao')) return 363;
    if (p.includes('/ajuda')) return 364;
    if (p.includes('/mensagem-final') || p.includes('/sobre')) return 365;
    if (p.includes('/carlos') || p.includes('/perfil')) return 352;
    return 351;
  };

  const [activeScreen, setActiveScreen] = useState<number>(() => getScreenFromPath(path));

  const navigateTo = (screenId: number, targetRoute?: string) => {
    setActiveScreen(screenId);
    const target = targetRoute || SCREENS.find((s) => s.id === screenId)?.route || '/memorial';
    go(target);
  };

  return (
    <div className="memorial-container">
      {/* Catalog navigation switcher */}
      <div className="memorial-catalog-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="memorial-catalog-badge">
            <Sparkles size={14} /> FLOW_CATALOGO_15MEMORIAL
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>
            Telas 351–365 · Memorial do Usuário
          </span>
        </div>

        <div className="memorial-screen-pills">
          {SCREENS.map((s) => (
            <button
              key={s.id}
              className={`memorial-screen-pill ${activeScreen === s.id ? 'active' : ''}`}
              onClick={() => navigateTo(s.id, s.route)}
              title={`Tela #${s.id} — ${s.name}`}
            >
              #{s.id} {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Screen stage */}
      <div className="memorial-stage">
        <div className="memorial-view-wrapper">
          {activeScreen === 351 && <Screen351Home onNavigate={navigateTo} />}
          {activeScreen === 352 && <Screen352Profile onNavigate={navigateTo} />}
          {activeScreen === 353 && <Screen353Tributes onNavigate={navigateTo} />}
          {activeScreen === 354 && <Screen354CreateTribute onNavigate={navigateTo} />}
          {activeScreen === 355 && <Screen355Request onNavigate={navigateTo} />}
          {activeScreen === 356 && <Screen356Verification onNavigate={navigateTo} />}
          {activeScreen === 357 && <Screen357Tracking onNavigate={navigateTo} />}
          {activeScreen === 358 && <Screen358LegacySettings onNavigate={navigateTo} />}
          {activeScreen === 359 && <Screen359Representative onNavigate={navigateTo} />}
          {activeScreen === 360 && <Screen360Admin onNavigate={navigateTo} />}
          {activeScreen === 361 && <Screen361Report onNavigate={navigateTo} />}
          {activeScreen === 362 && <Screen362Removal onNavigate={navigateTo} />}
          {activeScreen === 363 && <Screen363Confirmation onNavigate={navigateTo} />}
          {activeScreen === 364 && <Screen364Help onNavigate={navigateTo} />}
          {activeScreen === 365 && <Screen365FinalMessage onNavigate={navigateTo} />}
        </div>
      </div>
    </div>
  );
}

// ── TELA 351: MEMORIAL DO USUÁRIO (INÍCIO) ───────────────────────────
function Screen351Home({ onNavigate }: { onNavigate: (id: number) => void }) {
  return (
    <div className="m351-hero">
      <div className="m351-icon-badge">
        <HeartHandshake size={32} />
      </div>
      <h1 className="m351-title">Memorial do Usuário</h1>
      <div className="m351-subtitle">Preserve memórias. Mantenha histórias vivas.</div>
      <p className="m351-desc">
        O Memorial da Flow é um espaço para homenagear pessoas que fizeram parte da nossa comunidade.
      </p>

      <div className="m351-grid">
        <div className="m351-feature-card">
          <div className="m351-feature-icon"><Heart size={20} /></div>
          <span className="m351-feature-text">Mantém o perfil como homenagem</span>
        </div>
        <div className="m351-feature-card">
          <div className="m351-feature-icon"><Camera size={20} /></div>
          <span className="m351-feature-text">Preserva publicações autorizadas</span>
        </div>
        <div className="m351-feature-card">
          <div className="m351-feature-icon"><MessageCircle size={20} /></div>
          <span className="m351-feature-text">Permite mensagens de amigos e familiares</span>
        </div>
        <div className="m351-feature-card">
          <div className="m351-feature-icon"><Award size={20} /></div>
          <span className="m351-feature-text">Mantém viva a história de quem fez parte da Flow</span>
        </div>
      </div>

      <div className="m351-actions">
        <button className="m-btn-secondary" onClick={() => onNavigate(364)}>Saiba mais</button>
        <button className="m-btn-primary" onClick={() => onNavigate(355)}>
          Solicitar memorial <ArrowRight size={18} />
        </button>
      </div>

      <div className="m351-quote">
        "Algumas pessoas nunca se vão, elas apenas vivem para sempre nas nossas memórias."
      </div>
    </div>
  );
}

// ── TELA 352: PERFIL MEMORIAL (PÚBLICO) ──────────────────────────────
function Screen352Profile({ onNavigate }: { onNavigate: (id: number) => void }) {
  const [activeTab, setActiveTab] = useState('Publicações');

  return (
    <div>
      <div className="m352-cover" />
      <div className="m352-header">
        <div className="m352-avatar-wrap">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
            alt="Carlos Eduardo"
            className="m352-avatar"
          />
        </div>
        <div className="m352-seal">
          <Heart size={14} fill="currentColor" /> Em memória de
        </div>
        <h2 className="m352-name">Carlos Eduardo</h2>
        <div className="m352-dates">★ 12/03/1965 &nbsp; † 20/06/2026</div>
        <div className="m352-quote">"Viverá para sempre em nossos corações."</div>

        <div className="m352-tabs">
          {['Publicações', 'Fotos', 'Vídeos', 'Homenagens', 'Sobre'].map((tab) => (
            <button
              key={tab}
              className={`m352-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'Homenagens') onNavigate(353);
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="m352-body-layout">
        <div className="m352-feed">
          <div className="m352-pinned-post">
            <div className="m352-author-row">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                alt="Avatar"
                style={{ width: 44, height: 44, borderRadius: '50%' }}
              />
              <div>
                <strong style={{ display: 'block', fontSize: 15, color: '#0F172A' }}>Carlos Eduardo</strong>
                <small style={{ color: '#64748B' }}>10/05/2026 09:12</small>
              </div>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: 15, color: '#334155', lineHeight: 1.5 }}>
              Gratidão por tudo que vivi aqui. Cada momento com vocês fez toda a diferença na minha jornada. ❤️
            </p>
            <img
              src="https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=800&q=80"
              alt="Paisagem de gratidão"
              style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 12, marginBottom: 14 }}
            />
            <div style={{ display: 'flex', gap: 24, fontSize: 14, color: '#64748B', fontWeight: 600 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Heart size={16} fill="#EF4444" color="#EF4444" /> 1.2K
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <MessageCircle size={16} /> 326
              </span>
            </div>
          </div>
        </div>

        <div className="m352-sidebar-cards">
          <div className="m352-side-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <strong style={{ fontSize: 15, color: '#0F172A' }}>Homenagens</strong>
              <small style={{ color: '#8B5CF6', fontWeight: 700 }}>1,2k mensagens</small>
            </div>
            <button
              className="m-btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '10px 16px' }}
              onClick={() => onNavigate(354)}
            >
              Deixar homenagem
            </button>
          </div>

          <div className="m352-side-card">
            <strong style={{ fontSize: 15, color: '#0F172A', display: 'block', marginBottom: 8 }}>
              Amigos
            </strong>
            <small style={{ color: '#64748B', display: 'block', marginBottom: 12 }}>318 amigos mútuos</small>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/60?img=${i + 20}`}
                  alt="Amigo"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    border: '2px solid #FFFFFF',
                    marginLeft: i > 1 ? -8 : 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TELA 353: HOMENAGENS ─────────────────────────────────────────────
function Screen353Tributes({ onNavigate }: { onNavigate: (id: number) => void }) {
  const tributes = [
    {
      id: 1,
      author: 'Mariana Silva',
      date: '20/06/2026',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
      text: 'Você sempre será lembrado pela sua alegria e generosidade. Saudades eternas! ❤️🕊️',
      likes: 254,
    },
    {
      id: 2,
      author: 'João Pereira',
      date: '19/06/2026',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
      text: 'Obrigado por todos os momentos. Você fez a diferença na vida de muitos de nós.',
      likes: 126,
    },
    {
      id: 3,
      author: 'Fernanda Lima',
      date: '18/06/2026',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
      text: 'Que sua luz continue inspirando a todos nós. ✨',
      likes: 96,
    },
    {
      id: 4,
      author: 'Ricardo Alves',
      date: '17/06/2026',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80',
      text: 'Amigo para sempre! 🤝🕊️',
      likes: 78,
    },
  ];

  return (
    <div className="m353-wrap">
      <div className="m353-header">
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>Homenagens</h2>
          <p style={{ margin: 0, color: '#64748B', fontSize: 14 }}>
            Deixe aqui sua mensagem, foto ou vídeo em memória de Carlos Eduardo.
          </p>
        </div>
        <button className="m-btn-primary" onClick={() => onNavigate(354)}>
          Escrever homenagem
        </button>
      </div>

      <div className="m353-list">
        {tributes.map((t) => (
          <div key={t.id} className="m353-card">
            <div className="m353-author-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={t.avatar} alt={t.author} style={{ width: 42, height: 42, borderRadius: '50%' }} />
                <div>
                  <strong style={{ fontSize: 15, color: '#0F172A', display: 'block' }}>{t.author}</strong>
                  <small style={{ color: '#94A3B8' }}>{t.date}</small>
                </div>
              </div>
              <button
                style={{
                  border: 'none',
                  background: 'rgba(239, 68, 68, 0.08)',
                  color: '#EF4444',
                  padding: '6px 12px',
                  borderRadius: 9999,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Heart size={14} fill="currentColor" /> {t.likes}
              </button>
            </div>
            <p style={{ margin: 0, fontSize: 15, color: '#334155', lineHeight: 1.6 }}>{t.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TELA 354: CRIAR HOMENAGEM ────────────────────────────────────────
function Screen354CreateTribute({ onNavigate }: { onNavigate: (id: number) => void }) {
  const [msg, setMsg] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [sent, setSent] = useState(false);

  return (
    <div className="m354-form">
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>Criar homenagem</h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>Compartilhe uma mensagem especial.</p>

      {sent ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <CheckCircle2 size={48} color="#10B981" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Homenagem enviada com sucesso!</h3>
          <p style={{ color: '#64748B', marginBottom: 24 }}>Sua mensagem já está disponível no mural memorial.</p>
          <button className="m-btn-primary" onClick={() => onNavigate(353)}>Ver homenagens</button>
        </div>
      ) : (
        <>
          <div className="m-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Sua mensagem</label>
              <small style={{ color: '#94A3B8' }}>{msg.length}/500</small>
            </div>
            <textarea
              className="m-textarea"
              placeholder="Escreva aqui sua homenagem..."
              maxLength={500}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
          </div>

          <div className="m-form-group">
            <label>Adicionar mídia (opcional)</label>
            <div className="m-media-buttons">
              <button className="m-media-btn" type="button"><Camera size={18} /> Foto</button>
              <button className="m-media-btn" type="button"><Video size={18} /> Vídeo</button>
              <button className="m-media-btn" type="button"><Paperclip size={18} /> Arquivo</button>
            </div>
          </div>

          <div className="m-form-group">
            <label>Privacidade</label>
            <select
              className="m-select"
              style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 14 }}
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
            >
              <option value="public">Pública (visível para todos)</option>
              <option value="friends">Apenas amigos conectados</option>
            </select>
          </div>

          <button
            className="m-btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
            onClick={() => {
              if (msg.trim()) setSent(true);
            }}
          >
            Publicar homenagem
          </button>
        </>
      )}
    </div>
  );
}

// ── TELA 355: SOLICITAR MEMORIAL (ETAPAS) ─────────────────────────────
function Screen355Request({ onNavigate }: { onNavigate: (id: number) => void }) {
  return (
    <div style={{ padding: '44px 36px', maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 8px', color: '#0F172A' }}>
        Solicitar transformação em Memorial
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>
        Solicite a transformação da conta de um membro falecido em um perfil memorial.
      </p>

      <div className="m355-steps">
        <div className="m355-step-card">
          <div className="m355-step-num">1</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1E293B' }}>Preencha o formulário</span>
        </div>
        <div className="m355-step-card">
          <div className="m355-step-num">2</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1E293B' }}>Envie a documentação comprobatória</span>
        </div>
        <div className="m355-step-card">
          <div className="m355-step-num">3</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1E293B' }}>Nossa equipe analisará a solicitação</span>
        </div>
        <div className="m355-step-card">
          <div className="m355-step-num">4</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1E293B' }}>Você será informado sobre o resultado</span>
        </div>
      </div>

      <button
        className="m-btn-primary"
        style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: 16 }}
        onClick={() => onNavigate(356)}
      >
        Iniciar solicitação
      </button>

      <div style={{ marginTop: 24, fontSize: 13, color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Shield size={16} /> A conta só será transformada em memorial depois da análise e aprovação da nossa equipe.
      </div>
    </div>
  );
}

// ── TELA 356: VERIFICAÇÃO DA SOLICITAÇÃO ─────────────────────────────
function Screen356Verification({ onNavigate }: { onNavigate: (id: number) => void }) {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [date, setDate] = useState('');

  return (
    <div style={{ padding: '40px 36px', maxWidth: 680, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
        Verificação da solicitação
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>
        Para garantir a segurança, precisamos de algumas informações.
      </p>

      <div className="m-form-group">
        <label>Nome do solicitante</label>
        <input
          type="text"
          className="m-input"
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #CBD5E1' }}
        />
      </div>

      <div className="m-form-group">
        <label>Relação com o usuário falecido</label>
        <select
          className="m-select"
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #CBD5E1' }}
        >
          <option value="">Selecione...</option>
          <option value="parent">Familiar de 1º grau (Cônjuge, Filho, Pai/Mãe)</option>
          <option value="relative">Outro familiar</option>
          <option value="legal">Representante legal / inventariante</option>
          <option value="friend">Amigo próximo</option>
        </select>
      </div>

      <div className="m-form-group">
        <label>Data do falecimento</label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="m-input"
            placeholder="DD / MM / AAAA"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #CBD5E1' }}
          />
          <Calendar size={18} color="#94A3B8" style={{ position: 'absolute', right: 12, top: 14 }} />
        </div>
      </div>

      <div className="m-form-group">
        <label>Documentação comprobatória</label>
        <div style={{ border: '2px dashed #CBD5E1', borderRadius: 14, padding: '24px 16px', textAlign: 'center', background: '#F8FAFC' }}>
          <Upload size={28} color="#8B5CF6" style={{ marginBottom: 8 }} />
          <p style={{ margin: '0 0 12px', fontSize: 14, color: '#475569' }}>
            Certidão de óbito, notícia, obituário ou documento oficial.
          </p>
          <button className="m-btn-secondary" type="button" style={{ padding: '8px 18px', fontSize: 13 }}>
            Selecionar arquivo
          </button>
        </div>
      </div>

      <button
        className="m-btn-primary"
        style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}
        onClick={() => onNavigate(357)}
      >
        Enviar para análise
      </button>
    </div>
  );
}

// ── TELA 357: ACOMPANHAMENTO DA SOLICITAÇÃO ──────────────────────────
function Screen357Tracking({ onNavigate }: { onNavigate: (id: number) => void }) {
  return (
    <div style={{ padding: '40px 36px', maxWidth: 680, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
        Acompanhamento da Solicitação
      </h2>
      <p style={{ margin: '0 0 32px', color: '#64748B', fontSize: 15 }}>
        Veja o status da sua solicitação.
      </p>

      <div className="m357-timeline">
        <div className="m357-step-item">
          <div className="m357-line" />
          <div className="m357-icon completed"><CheckCircle2 size={20} /></div>
          <div>
            <strong style={{ fontSize: 15, color: '#0F172A', display: 'block' }}>Solicitação enviada</strong>
            <small style={{ color: '#64748B' }}>20/06/2026 14:32</small>
          </div>
        </div>

        <div className="m357-step-item">
          <div className="m357-line" />
          <div className="m357-icon completed"><CheckCircle2 size={20} /></div>
          <div>
            <strong style={{ fontSize: 15, color: '#0F172A', display: 'block' }}>Documentação recebida</strong>
            <small style={{ color: '#64748B' }}>20/06/2026 14:35</small>
          </div>
        </div>

        <div className="m357-step-item">
          <div className="m357-line" />
          <div className="m357-icon current"><Clock size={20} /></div>
          <div>
            <strong style={{ fontSize: 15, color: '#3B82F6', display: 'block' }}>Em análise</strong>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#475569' }}>
              Nossa equipe está analisando os documentos. Prazo médio: até 3 dias úteis.
            </p>
          </div>
        </div>

        <div className="m357-step-item">
          <div className="m357-line" />
          <div className="m357-icon pending"><Clock size={20} /></div>
          <div>
            <strong style={{ fontSize: 15, color: '#94A3B8', display: 'block' }}>Aguardando aprovação</strong>
          </div>
        </div>

        <div className="m357-step-item">
          <div className="m357-icon pending"><CheckCircle2 size={20} /></div>
          <div>
            <strong style={{ fontSize: 15, color: '#94A3B8', display: 'block' }}>Conclusão</strong>
          </div>
        </div>
      </div>

      <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Info size={20} color="#0284C7" />
        <span style={{ fontSize: 14, color: '#0369A1' }}>
          Você será notificado por e-mail e na Flow sobre o resultado da análise.
        </span>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="m-btn-secondary" onClick={() => onNavigate(351)}>Voltar ao início</button>
        <button className="m-btn-primary" onClick={() => onNavigate(363)}>Simular aprovação</button>
      </div>
    </div>
  );
}

// ── TELA 358: CONFIGURAÇÕES DE LEGADO (EM VIDA) ──────────────────────
function Screen358LegacySettings({ onNavigate }: { onNavigate: (id: number) => void }) {
  const [switches, setSwitches] = useState({
    memorialize: true,
    contact: true,
    posts: true,
    media: true,
    clearDMs: true,
    purgeAfterTime: false,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof typeof switches) => {
    setSwitches((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ padding: '40px 36px', maxWidth: 720, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
        Configurações de Legado
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>
        Defina o que deve acontecer com sua conta no futuro.
      </p>

      <div className="m358-switches">
        <div className="m358-switch-row">
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>Desejo que minha conta seja memorializada</span>
          <label className="m-switch">
            <input type="checkbox" checked={switches.memorialize} onChange={() => toggle('memorialize')} />
            <span className="m-slider" />
          </label>
        </div>

        <div className="m358-switch-row">
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>Indicar um contato de legado</span>
          <label className="m-switch">
            <input type="checkbox" checked={switches.contact} onChange={() => toggle('contact')} />
            <span className="m-slider" />
          </label>
        </div>

        <div className="m358-switch-row">
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>Permitir que minhas publicações permaneçam</span>
          <label className="m-switch">
            <input type="checkbox" checked={switches.posts} onChange={() => toggle('posts')} />
            <span className="m-slider" />
          </label>
        </div>

        <div className="m358-switch-row">
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>Permitir fotos e vídeos</span>
          <label className="m-switch">
            <input type="checkbox" checked={switches.media} onChange={() => toggle('media')} />
            <span className="m-slider" />
          </label>
        </div>

        <div className="m358-switch-row">
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>Remover minhas mensagens privadas</span>
          <label className="m-switch">
            <input type="checkbox" checked={switches.clearDMs} onChange={() => toggle('clearDMs')} />
            <span className="m-slider" />
          </label>
        </div>

        <div className="m358-switch-row">
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>Remover meus dados após determinado período</span>
          <label className="m-switch">
            <input type="checkbox" checked={switches.purgeAfterTime} onChange={() => toggle('purgeAfterTime')} />
            <span className="m-slider" />
          </label>
        </div>
      </div>

      <div className="m-form-group" style={{ marginBottom: 28 }}>
        <label>Contato de legado</label>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            type="text"
            className="m-input"
            placeholder="Nome e e-mail do contato"
            defaultValue="Mariana Silva (mariana.silva@email.com)"
            style={{ flex: 1, padding: '12px 14px', borderRadius: 10, border: '1px solid #CBD5E1' }}
          />
          <button className="m-btn-primary" type="button" style={{ padding: '10px 20px' }}>Adicionar</button>
        </div>
      </div>

      <button
        className="m-btn-primary"
        style={{ width: '100%', justifyContent: 'center' }}
        onClick={() => {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        }}
      >
        {saved ? 'Configurações salvas!' : 'Salvar configurações'}
      </button>
    </div>
  );
}

// ── TELA 359: REPRESENTANTE / CONTATO DE LEGADO ───────────────────────
function Screen359Representative({ onNavigate }: { onNavigate: (id: number) => void }) {
  return (
    <div style={{ padding: '40px 36px', maxWidth: 680, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
        Meu papel como representante
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>
        Você foi indicado como contato de legado de Carlos Eduardo.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', background: '#F8FAFC', borderRadius: 14, border: '1px solid #E2E8F0', marginBottom: 28 }}>
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
          alt="Mariana Silva"
          style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
        />
        <div>
          <strong style={{ fontSize: 17, color: '#0F172A', display: 'block' }}>Mariana Silva</strong>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Contato de legado
          </span>
          <small style={{ color: '#64748B', display: 'block' }}>mariana.silva@email.com</small>
        </div>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 14 }}>Permissões</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {[
          'Solicitar transformação em memorial',
          'Gerenciar homenagens',
          'Manter publicações autorizadas',
          'Solicitar remoção de conteúdo',
          'Receber comunicados da Flow',
        ].map((perm) => (
          <div key={perm} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: '#334155' }}>
            <CheckCircle2 size={20} color="#10B981" />
            <span>{perm}</span>
          </div>
        ))}
      </div>

      <button className="m-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onNavigate(364)}>
        Ver orientações
      </button>
    </div>
  );
}

// ── TELA 360: ADMINISTRAÇÃO DO MEMORIAL ──────────────────────────────
function Screen360Admin({ onNavigate }: { onNavigate: (id: number) => void }) {
  const modules = [
    { title: 'Gerenciar homenagens', icon: <MessageCircle size={20} color="#8B5CF6" />, target: 353 },
    { title: 'Aprovar publicações', icon: <Shield size={20} color="#3B82F6" />, target: 352 },
    { title: 'Gerenciar fotos e vídeos', icon: <Camera size={20} color="#EC4899" />, target: 352 },
    { title: 'Configurar privacidade', icon: <Settings size={20} color="#F59E0B" />, target: 358 },
    { title: 'Solicitar remoção de conteúdo', icon: <Trash2 size={20} color="#EF4444" />, target: 362 },
    { title: 'Visualizar relatórios', icon: <FileText size={20} color="#10B981" />, target: 357 },
  ];

  return (
    <div style={{ padding: '40px 36px', maxWidth: 780, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
        Administração do Memorial
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>
        Gerencie o perfil memorial de Carlos Eduardo.
      </p>

      <div className="m360-grid">
        {modules.map((m) => (
          <div key={m.title} className="m360-card" onClick={() => onNavigate(m.target)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {m.icon}
              </div>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>{m.title}</span>
            </div>
            <ChevronRight size={18} color="#94A3B8" />
          </div>
        ))}
      </div>

      <button className="m-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onNavigate(352)}>
        Acessar painel
      </button>
    </div>
  );
}

// ── TELA 361: DENUNCIAR MEMORIAL ─────────────────────────────────────
function Screen361Report({ onNavigate }: { onNavigate: (id: number) => void }) {
  const [done, setDone] = useState(false);

  return (
    <div style={{ padding: '40px 36px', maxWidth: 680, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
        Denunciar memorial
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>
        Ajude-nos a manter um ambiente seguro e respeitoso.
      </p>

      {done ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <CheckCircle2 size={48} color="#10B981" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Denúncia recebida</h3>
          <p style={{ color: '#64748B', marginBottom: 24 }}>Nossa equipe de moderação irá avaliar as evidências apresentadas.</p>
          <button className="m-btn-primary" onClick={() => onNavigate(351)}>Voltar ao Memorial</button>
        </div>
      ) : (
        <>
          <div className="m-form-group">
            <label>Motivo da denúncia</label>
            <select className="m-select" style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #CBD5E1' }}>
              <option value="">Selecione o motivo...</option>
              <option value="fake">Perfil falso ou falsa memorialização</option>
              <option value="hate">Conteúdo ofensivo ou desrespeitoso</option>
              <option value="privacy">Violação de privacidade da família</option>
              <option value="other">Outro motivo</option>
            </select>
          </div>

          <div className="m-form-group">
            <label>Descrição (opcional)</label>
            <textarea className="m-textarea" placeholder="Descreva o motivo da denúncia..." style={{ minHeight: 110 }} />
          </div>

          <div className="m-form-group">
            <label>Adicionar evidências (opcional)</label>
            <div className="m-media-buttons">
              <button className="m-media-btn" type="button"><Camera size={18} /> Foto</button>
              <button className="m-media-btn" type="button"><Video size={18} /> Vídeo</button>
              <button className="m-media-btn" type="button"><Paperclip size={18} /> Arquivo</button>
            </div>
          </div>

          <button className="m-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} onClick={() => setDone(true)}>
            Enviar denúncia
          </button>
        </>
      )}
    </div>
  );
}

// ── TELA 362: SOLICITAR REMOÇÃO ──────────────────────────────────────
function Screen362Removal({ onNavigate }: { onNavigate: (id: number) => void }) {
  const [done, setDone] = useState(false);

  return (
    <div style={{ padding: '40px 36px', maxWidth: 680, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
        Solicitar remoção do memorial
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>
        Se você acredita que este memorial deve ser removido, solicite uma análise.
      </p>

      {done ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <CheckCircle2 size={48} color="#10B981" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Solicitação enviada</h3>
          <p style={{ color: '#64748B', marginBottom: 24 }}>A análise jurídica será realizada com prioridade.</p>
          <button className="m-btn-primary" onClick={() => onNavigate(351)}>Voltar ao Memorial</button>
        </div>
      ) : (
        <>
          <div className="m-form-group">
            <label>Motivo da solicitação</label>
            <select className="m-select" style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #CBD5E1' }}>
              <option value="">Selecione o motivo...</option>
              <option value="family">Decisão expressa da família imediata</option>
              <option value="will">Vontade prévia do titular antes do falecimento</option>
              <option value="court">Ordem judicial ou determinação legal</option>
            </select>
          </div>

          <div className="m-form-group">
            <label>Descrição</label>
            <textarea className="m-textarea" placeholder="Explique o motivo da solicitação..." style={{ minHeight: 120 }} />
          </div>

          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <AlertTriangle size={20} color="#EF4444" />
            <span style={{ fontSize: 14, color: '#B91C1C', fontWeight: 600 }}>
              Todas as solicitações serão analisadas pela nossa equipe.
            </span>
          </div>

          <button className="m-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setDone(true)}>
            Enviar solicitação
          </button>
        </>
      )}
    </div>
  );
}

// ── TELA 363: CONFIRMAÇÃO DA MEMORIALIZAÇÃO ──────────────────────────
function Screen363Confirmation({ onNavigate }: { onNavigate: (id: number) => void }) {
  return (
    <div style={{ padding: '60px 36px', maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#10B981', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)' }}>
        <CheckCircle2 size={42} />
      </div>

      <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 10px', color: '#0F172A' }}>
        Conta transformada em Memorial
      </h2>
      <p style={{ fontSize: 16, fontWeight: 600, color: '#475569', margin: '0 0 18px' }}>
        O perfil de Carlos Eduardo agora é um memorial.
      </p>
      <p style={{ fontSize: 15, color: '#64748B', maxWidth: 460, margin: '0 auto 36px', lineHeight: 1.6 }}>
        Suas memórias continuarão vivas na Flow. Agradecemos por fazer parte dessa história.
      </p>

      <button className="m-btn-primary" style={{ padding: '14px 36px', fontSize: 16 }} onClick={() => onNavigate(352)}>
        Ver memorial
      </button>
    </div>
  );
}

// ── TELA 364: AJUDA E ORIENTAÇÕES ────────────────────────────────────
function Screen364Help({ onNavigate }: { onNavigate: (id: number) => void }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'O que é o Memorial da Flow?',
      a: 'O Memorial da Flow é um recurso permanente projetado para homenagear membros falecidos da nossa comunidade, congelando seu perfil e preservando suas publicações autorizadas como legado afetivo.',
    },
    {
      q: 'Quem pode solicitar?',
      a: 'Familiares de primeiro grau (cônjuge, filhos, pais), herdeiros legais ou representantes indicados pelo próprio usuário em vida.',
    },
    {
      q: 'Quais documentos são necessários?',
      a: 'Certidão de óbito emitida em cartório oficial, obituário idôneo ou documento legal expedido por autoridade competente.',
    },
    {
      q: 'O que acontece com os dados do usuário?',
      a: 'As credenciais de login são desativadas definitivamente. Se configurado previamente pelo titular, conversas privadas são removidas e apenas postagens públicas selecionadas são mantidas.',
    },
    {
      q: 'É possível remover o memorial?',
      a: 'Sim. Familiares imediatos ou representantes legais podem solicitar a exclusão integral do memorial por meio do canal dedicado de solicitação de remoção.',
    },
    {
      q: 'Como indicar um contato de legado?',
      a: 'Nas Configurações de Legado (/configuracoes/memorial), o titular pode selecionar qualquer amigo ou familiar e registrá-lo como seu representante pós-vida.',
    },
  ];

  return (
    <div style={{ padding: '40px 36px', maxWidth: 740, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
        Ajuda sobre o Memorial
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>
        Tire suas dúvidas sobre o processo de memorialização.
      </p>

      <div className="m364-faq-list">
        {faqs.map((f, i) => (
          <div key={f.q} className="m364-faq-item">
            <div className="m364-faq-question" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileText size={18} color="#8B5CF6" /> {f.q}
              </span>
              <ChevronDown
                size={18}
                color="#94A3B8"
                style={{ transform: openIdx === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
              />
            </div>
            {openIdx === i && <div className="m364-faq-answer">{f.a}</div>}
          </div>
        ))}
      </div>

      <button className="m-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onNavigate(351)}>
        Falar com o suporte
      </button>
    </div>
  );
}

// ── TELA 365: MENSAGEM FINAL (CINEMATOGRÁFICA) ───────────────────────
function Screen365FinalMessage({ onNavigate }: { onNavigate: (id: number) => void }) {
  return (
    <div className="m365-hero">
      <h2 className="m365-headline">Mais que uma rede. Uma lembrança que permanece.</h2>
      
      <img
        src="/flow-assets-svg/brand/flow-logo.svg"
        alt="FLOW"
        style={{ height: 44, marginBottom: 24, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))' }}
      />

      <p className="m365-text">
        Na Flow, acreditamos que boas histórias nunca terminam. Elas continuam inspirando pessoas, mesmo quando a presença física se vai.
      </p>

      <div className="m365-heart">💜</div>

      <button className="m-btn-primary" style={{ padding: '14px 36px', fontSize: 16 }} onClick={() => onNavigate(351)}>
        Conheça o Memorial
      </button>
    </div>
  );
}
