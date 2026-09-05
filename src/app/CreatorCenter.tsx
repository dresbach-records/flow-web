// FLOW — CreatorCenter (FASE 1: sem mocks).
// Página orquestradora: métricas reais via services/firebase/creator.
// Sem views/renda simuladas: campos sem fonte exibem "—" (REGRA DE CONCLUSÃO FLOW).
import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, LayoutDashboard, Plus, Sparkles, Users, Video, Wallet } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { getCreatorStats, type CreatorStats } from '../services/firebase/creator';
import type { CreatorVideo } from '../components/creator/types';
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

const EMPTY_STATS: CreatorStats = {
  postsCount: 0,
  likesTotal: 0,
  commentsTotal: 0,
  sharesTotal: 0,
  followersCount: 0,
  posts: [],
};

export default function CreatorCenter() {
  const { user } = useAppContext();
  const [tab, setTab] = useState<CreatorTab>('overview');
  const [period, setPeriod] = useState<CreatorPeriod>('7');
  const [showCreate, setShowCreate] = useState(false);
  const [range, setRange] = useState<CreatorRange>('views');
  const [stats, setStats] = useState<CreatorStats>(EMPTY_STATS);

  useEffect(() => {
    if (!user?.uid) return;
    let cancelled = false;
    void getCreatorStats(user.uid)
      .then((s) => {
        if (!cancelled) setStats(s);
      })
      .catch(() => {
        if (!cancelled) setStats(EMPTY_STATS);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const totals: CreatorTotals = {
    views: '—',
    delta: '',
    followers: String(stats.followersCount),
    fdelta: '',
    income: 'R$ 0,00',
    likes: String(stats.likesTotal),
  };
  // Série real de curtidas por publicação (normalizada 0-100) para o range "likes".
  const chart = useMemo(() => {
    const likes = stats.posts.map((p) => p.likes);
    const max = Math.max(...likes, 1);
    return likes.map((v) => Math.round((v / max) * 100));
  }, [stats]);
  const videos: CreatorVideo[] = useMemo(
    () =>
      stats.posts.map((p) => ({
        title: p.title,
        views: '—',
        likes: String(p.likes),
        comments: String(p.comments),
        shares: String(p.shares),
        img: p.img,
        date: p.date,
        completion: '—',
      })),
    [stats],
  );
  const profileName = user?.displayName || 'Seu perfil FLOW';
  const profileHandle = user?.email ? `@${user.email.split('@')[0]}` : '@usuario';
  void period;

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
            <img src={user?.photoURL || '/logo.png'} alt={profileName} />
            <div>
              <h2>
                {profileName} <CheckCircle2 />
              </h2>
              <span>{profileHandle}</span>
              <p>{stats.postsCount} publicações · {stats.followersCount} seguidores · Perfil público</p>
            </div>
          </div>
          <div className="level">
            <b>{stats.likesTotal} curtidas</b>
            <span>Total nos seus posts</span>
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
            videos={videos}
          />
        )}
        {tab === 'posts' && (
          <CreatorPosts
            onPublish={() => go('/app/criar/post')}
            videos={videos}
            likesTotal={stats.likesTotal}
            commentsTotal={stats.commentsTotal}
            sharesTotal={stats.sharesTotal}
          />
        )}
        {tab === 'followers' && <CreatorFollowers period={period} count={stats.followersCount} />}
        {tab === 'income' && <CreatorIncome />}
        <CreatorTools />
      </main>
      {showCreate && <CreatorCreateModal onClose={() => setShowCreate(false)} onNavigate={go} />}
    </div>
  );
}
