// FLOW — ProfilePage (FASE 3).
// Página orquestradora: monta ProfileHeader/ProfileTabs/ProfilePostCard e
// conecta dados via useProfile. Antes: helpers + JSX monolítico no arquivo.
// Depois: composição de componentes reutilizáveis, mesmo Firebase e mesma UI.
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { image, useProfile } from '../hooks/useProfile';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import LoadingState from '../components/ui/LoadingState';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfilePostCard from '../components/profile/ProfilePostCard';
import ProfileTabs, { type ProfileTab } from '../components/profile/ProfileTabs';
import './profile-page.css';

function navigate(path: string) {
  history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'auto' });
}

export default function ProfilePage({ uid: routeUid }: { uid?: string }) {
  const { user, loading } = useAppContext();
  const uid = routeUid || user?.uid || '';
  const own = uid === user?.uid;
  const { profile, posts, loadingProfile } = useProfile(uid, user, own);
  const [tab, setTab] = useState<ProfileTab>('posts');

  useEffect(() => {
    if (!loading && !user) navigate('/auth/login');
  }, [loading, user]);

  const visiblePosts = useMemo(() => {
    if (tab === 'media') return posts.filter((post) => Boolean(image(post, ['imageUrl', 'mediaUrl', 'thumbnailUrl', 'image', 'photoUrl'])));
    if (tab === 'likes') return posts.filter((post) => Boolean(post.likedByCurrentUser));
    return posts;
  }, [posts, tab]);

  if (loading || !user) return <LoadingState message="Carregando seu FLOW…" />;
  if (loadingProfile) return <LoadingState message="Carregando perfil…" />;
  if (!profile)
    return (
      <ErrorState
        title="Perfil não encontrado"
        onRetry={() => navigate('/app')}
        retryLabel="Voltar ao FLOW"
      />
    );

  return (
    <div className="flow-profile-page">
      <div className="flow-profile-shell">
        <main className="flow-profile-main">
          <button className="flow-profile-back" onClick={() => navigate('/app')}>
            <ArrowLeft size={17} /> Voltar ao feed
          </button>
          <ProfileHeader
            profile={profile}
            postsCount={posts.length}
            own={own}
            tabs={<ProfileTabs tab={tab} onChange={setTab} own={own} />}
          />
          <section className="flow-profile-posts">
            {visiblePosts.length === 0 ? (
              <EmptyState
                icon={<MessageCircle size={28} />}
                title="Nenhuma publicação"
                description="As publicações reais deste perfil aparecerão aqui quando forem criadas."
              />
            ) : (
              visiblePosts.map((post) => <ProfilePostCard key={post.id} post={post} />)
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
