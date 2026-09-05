// FLOW — MemorialModule (FASE 3).
// Página orquestradora: catálogo das telas 351–365 + palco de exibição.
// Antes: 1070 linhas com 15 telas internas.
// Depois: composição de src/app/memorial/screens/*, mesma UI e navegação.
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import {
  Screen351Home,
  Screen352Profile,
  Screen353Tributes,
  Screen354CreateTribute,
  Screen355Request,
  Screen356Verification,
  Screen357Tracking,
  Screen358LegacySettings,
  Screen359Representative,
  Screen360Admin,
  Screen361Report,
  Screen362Removal,
  Screen363Confirmation,
  Screen364Help,
  Screen365FinalMessage,
} from './screens';
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
