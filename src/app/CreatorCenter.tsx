// FLOW — CreatorCenter (FASE 3).
// Página orquestradora: monta componentes creator e conecta estado local.
// Antes: 52 linhas densas com 7 componentes internos + `any`.
// Depois: composição de componentes tipados, mesma UI e mesmos dados.
import { useMemo, useState } from 'react';
import { CheckCircle2, LayoutDashboard, Plus, Sparkles, Users, Video, Wallet } from 'lucide-react';
import CreatorCreateModal from '../components/creator/CreatorCreateModal';
import CreatorFollowers from '../components/creator/CreatorFollowers';
import CreatorIncome from '../components/creator/CreatorIncome';
import CreatorOverview from '../components/creator/CreatorOverview';
import CreatorPosts from '../components/creator/CreatorPosts';
import CreatorTools from '../components/creator/CreatorTools';
import type { CreatorPeriod, CreatorRange, CreatorTab, CreatorTotals } from '../components/creator/types';
import './creator.css';

const go = (p: string) => {
  history.pushState({}, '', p);
  dispatchEvent(new PopStateEvent('popstate'));
  scrollTo(0, 0);
};

export default function CreatorCenter() {
  const [tab, setTab] = useState<CreatorTab>('overview');
  const [period, setPeriod] = useState<CreatorPeriod>('7');
  const [showCreate, setShowCreate] = useState(false);
  const [range, setRange] = useState<CreatorRange>('views');
  const totals: CreatorTotals =
    period === '7'
      ? { views: '26,4 mil', delta: '+314', followers: '117', fdelta: '+4', income: 'R$ 0,00' }
      : { views: '84,7 mil', delta: '+1.284', followers: '128', fdelta: '+11', income: 'R$ 0,00' };
  const chart = useMemo(
    () => (period === '7' ? [32, 45, 39, 61, 54, 72, 88] : [24, 32, 29, 45, 42, 54, 49, 66, 61, 72, 68, 84]),
    [period],
  );

  return (
    <div className="creator-shell">
      <main className="creator-main">
        <section className="creator-heading">
          <div>
            <span className="eyebrow">
              <Sparkles /> FLOW CREATOR
            </span>
            <h1>Central do Criador</h1>
            <p>Entenda seu desempenho, cresça sua comunidade e descubra novas oportunidades.</p>
          </div>
          <button className="create-btn" onClick={() => setShowCreate(true)}>
            <Plus /> Criar publicação
          </button>
        </section>
        <section className="creator-profile">
          <div className="creator-user">
            <img src="https://i.pravatar.cc/120?img=68" alt="" />
            <div>
              <h2>
                Seu perfil FLOW <CheckCircle2 />
              </h2>
              <span>@flow.creator</span>
              <p>11 direitos de criador · Perfil público</p>
            </div>
          </div>
          <div className="level">
            <b>Prata</b>
            <span>11 Direitos</span>
            <div>
              <i style={{ width: '58%' }} />
            </div>
          </div>
        </section>
        <nav className="creator-tabs">
          <button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>
            <LayoutDashboard />
            Visão geral
          </button>
          <button className={tab === 'posts' ? 'active' : ''} onClick={() => setTab('posts')}>
            <Video />
            Publicações
          </button>
          <button className={tab === 'followers' ? 'active' : ''} onClick={() => setTab('followers')}>
            <Users />
            Seguidores
          </button>
          <button className={tab === 'income' ? 'active' : ''} onClick={() => setTab('income')}>
            <Wallet />
            Renda
          </button>
        </nav>
        {tab === 'overview' && (
          <CreatorOverview
            totals={totals}
            period={period}
            onPeriodChange={setPeriod}
            chart={chart}
            range={range}
            onRangeChange={setRange}
            onSeeAll={() => go('/app/criador/publicacoes')}
          />
        )}
        {tab === 'posts' && <CreatorPosts onPublish={() => go('/app/criar/post')} />}
        {tab === 'followers' && <CreatorFollowers period={period} />}
        {tab === 'income' && <CreatorIncome />}
        <CreatorTools />
      </main>
      {showCreate && <CreatorCreateModal onClose={() => setShowCreate(false)} onNavigate={go} />}
    </div>
  );
}
