import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { Bell, Bookmark, Compass, Heart, Image as ImageIcon, Mail, Menu, MessageCircle, MoreHorizontal, Play, Plus, Search, Send, Settings, Shield, UserRound, Users, Video, X } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { getDocument, listDocuments, type WithId } from '../services/firebase/firestore';
import { logout } from '../services/firebase/auth';
import './social-feed.css';

type RawRecord = Record<string, unknown>;
type SocialPost = WithId<RawRecord> & { author?: RawRecord | null };
type SocialStory = WithId<RawRecord> & { author?: RawRecord | null };

type Profile = { uid: string; name: string; handle: string; avatar?: string; cover?: string; bio?: string };

const text = (value: unknown, fallback = '') => typeof value === 'string' ? value : fallback;
const number = (value: unknown) => typeof value === 'number' ? value : Number(value ?? 0) || 0;
const firstText = (obj: RawRecord | null | undefined, keys: string[], fallback = '') => {
  for (const key of keys) { const value = text(obj?.[key]); if (value) return value; }
  return fallback;
};
const firstImage = (obj: RawRecord | null | undefined, keys: string[]) => firstText(obj, keys);

function profileFromUser(user: { uid: string; displayName: string | null; email: string | null }): Profile {
  const name = user.displayName?.trim() || user.email?.split('@')[0] || 'Usuário';
  return { uid: user.uid, name, handle: `@${name.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '')}` };
}

export default function SocialFeed() {
  const { user, loading } = useAppContext();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [stories, setStories] = useState<SocialStory[]>([]);
  const [suggestions, setSuggestions] = useState<Profile[]>([]);
  const [active, setActive] = useState<'for-you' | 'following'>('for-you');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [liked, setLiked] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!loading && !user) {
      history.replaceState({}, '', '/auth/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [loading, user]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const load = async () => {
      const [postResult, storyResult, userResult] = await Promise.allSettled([
        listDocuments<RawRecord>('posts', { orderByField: 'createdAt', direction: 'desc', max: 40 }),
        listDocuments<RawRecord>('stories', { orderByField: 'createdAt', direction: 'desc', max: 20 }),
        listDocuments<RawRecord>('users', { max: 12 }),
      ]);
      if (cancelled) return;
      const loadedPosts = postResult.status === 'fulfilled' ? postResult.value : [];
      const loadedStories = storyResult.status === 'fulfilled' ? storyResult.value : [];
      const loadedUsers = userResult.status === 'fulfilled' ? userResult.value : [];
      const enrich = async (items: WithId<RawRecord>[]) => Promise.all(items.map(async item => {
        const authorId = firstText(item, ['authorId', 'userId', 'uid', 'authorUid']);
        const inlineAuthor = item.author && typeof item.author === 'object' ? item.author as RawRecord : null;
        if (inlineAuthor || !authorId) return { ...item, author: inlineAuthor };
        return { ...item, author: await getDocument<RawRecord>('users', authorId).catch(() => null) };
      }));
      const [enrichedPosts, enrichedStories] = await Promise.all([enrich(loadedPosts), enrich(loadedStories)]);
      if (cancelled) return;
      setPosts(enrichedPosts);
      setStories(enrichedStories);
      setSuggestions(loadedUsers.filter(item => item.id !== user.uid).map(item => ({
        uid: item.id,
        name: firstText(item, ['name', 'displayName'], 'Usuário'),
        handle: firstText(item, ['handle', 'username'], `@${item.id.slice(0, 8)}`),
        avatar: firstImage(item, ['avatarUrl', 'photoURL', 'avatar', 'photo']),
        bio: firstText(item, ['bio', 'description']),
      })));
    };
    void load();
    return () => { cancelled = true; };
  }, [user]);

  const visiblePosts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = posts.filter(post => {
      if (!normalizedSearch) return true;
      const caption = firstText(post, ['caption', 'text', 'content']).toLowerCase();
      const author = firstText(post.author, ['name', 'displayName', 'handle', 'username']).toLowerCase();
      return `${caption} ${author}`.includes(normalizedSearch);
    });
    return active === 'following' ? filtered.filter(post => Boolean(post.isFollowing || post.following)) : filtered;
  }, [posts, active, search]);

  const openProfile = async (uid: string, fallback?: RawRecord | null) => {
    if (!uid) return;
    setProfileLoading(true);
    const stored = await getDocument<RawRecord>('users', uid).catch(() => null);
    const source = stored ?? fallback ?? {};
    setSelectedProfile({
      uid,
      name: firstText(source, ['name', 'displayName'], uid === user?.uid ? (user.displayName || 'Usuário') : 'Usuário'),
      handle: firstText(source, ['handle', 'username'], uid === user?.uid ? profileFromUser(user).handle : `@${uid.slice(0, 8)}`),
      avatar: firstImage(source, ['avatarUrl', 'photoURL', 'avatar', 'photo']),
      cover: firstImage(source, ['coverUrl', 'cover', 'banner']),
      bio: firstText(source, ['bio', 'description']),
    });
    setProfileLoading(false);
  };

  if (loading || !user) return <div className="flow-social-loading">Carregando seu FLOW…</div>;
  const ownProfile = profileFromUser(user);

  return <div className="flow-social">
    <header className="flow-social-header">
      <button className="flow-mobile-trigger" aria-label="Abrir menu" onClick={() => setMobileMenu(true)}><Menu /></button>
      <button className="flow-brand" onClick={() => go('/app')}>flow<span>•</span></button>
      <label className="flow-search"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar no FLOW" /></label>
      <nav className="flow-header-nav" aria-label="Navegação principal"><button className="is-active" onClick={() => go('/app')}><Compass /></button><button onClick={() => go('/app/mensagens')}><Mail /></button><button onClick={() => go('/app/notificacoes')}><Bell /></button></nav>
      <button className="flow-user-trigger" onClick={() => openProfile(user.uid, { name: user.displayName })}>{user.displayName?.[0]?.toUpperCase() || <UserRound size={17} />}</button>
      <button className="flow-create-top" onClick={() => go('/app/criar')}><Plus size={18} /> Criar</button>
    </header>

    <div className="flow-social-shell">
      <aside className={`flow-social-sidebar ${mobileMenu ? 'is-open' : ''}`}>
        <div className="flow-sidebar-head"><button className="flow-brand" onClick={() => go('/app')}>flow<span>•</span></button><button className="flow-close-mobile" onClick={() => setMobileMenu(false)}><X /></button></div>
        <nav>
          <SidebarButton icon={<Compass />} label="For You" active={active === 'for-you'} onClick={() => { setActive('for-you'); setMobileMenu(false); }} />
          <SidebarButton icon={<Users />} label="Seguindo" active={active === 'following'} onClick={() => { setActive('following'); setMobileMenu(false); }} />
          <SidebarButton icon={<Compass />} label="Explorar" onClick={() => go('/app/explorar')} />
          <SidebarButton icon={<Play />} label="Shorts" onClick={() => go('/app/shorts')} />
          <SidebarButton icon={<Video />} label="Criar" onClick={() => go('/app/criar')} />
          <SidebarButton icon={<Mail />} label="Mensagens" onClick={() => go('/app/mensagens')} />
          <SidebarButton icon={<Users />} label="Comunidades" onClick={() => go('/app/comunidades')} />
          <SidebarButton icon={<UserRound />} label="Perfil" onClick={() => openProfile(user.uid, { name: user.displayName })} />
          <SidebarButton icon={<Bookmark />} label="Salvos" onClick={() => go('/app/salvos')} />
          <SidebarButton icon={<Settings />} label="Configurações" onClick={() => go('/app/configuracoes')} />
        </nav>
        <div className="flow-sidebar-bottom"><div className="flow-safety-note"><Shield size={18} /><div><strong>Seu espaço, suas regras.</strong><span>Controle privacidade, bloqueios e denúncias.</span></div></div><button onClick={() => void logout()}>Sair</button></div>
      </aside>
      {mobileMenu && <button className="flow-mobile-backdrop" aria-label="Fechar menu" onClick={() => setMobileMenu(false)} />}

      <main className="flow-feed-column">
        <div className="flow-feed-tabs"><button className={active === 'for-you' ? 'active' : ''} onClick={() => setActive('for-you')}>Para você</button><button className={active === 'following' ? 'active' : ''} onClick={() => setActive('following')}>Seguindo</button></div>
        <Composer profile={ownProfile} />
        <section className="flow-stories" aria-label="Stories">
          {stories.length > 0 ? stories.map(story => { const uid = firstText(story, ['authorId', 'userId', 'uid', 'authorUid']); const avatar = firstImage(story.author, ['avatarUrl', 'photoURL', 'avatar', 'photo']) || firstImage(story, ['avatarUrl', 'photoURL', 'avatar', 'photo']); return <button key={story.id} className="flow-story" onClick={() => uid && openProfile(uid, story.author)}><span className="flow-story-ring">{avatar ? <img src={avatar} alt="" /> : <UserRound size={21} />}</span><small>{firstText(story.author, ['name', 'displayName'], 'Story')}</small></button>; }) : <div className="flow-empty-inline">Stories publicados por pessoas que você segue aparecerão aqui.</div>}
        </section>
        <div className="flow-post-list">
          {visiblePosts.map(post => <PostCard key={post.id} post={post} liked={liked.has(post.id)} onLike={() => setLiked(prev => { const next = new Set(prev); next.has(post.id) ? next.delete(post.id) : next.add(post.id); return next; })} onProfile={() => openProfile(firstText(post, ['authorId', 'userId', 'uid', 'authorUid']), post.author)} />)}
          {visiblePosts.length === 0 && <div className="flow-empty-feed"><ImageIcon size={28} /><h3>Seu feed ainda está vazio</h3><p>Quando houver publicações reais disponíveis para sua conta, elas aparecerão aqui.</p></div>}
        </div>
      </main>

      <aside className="flow-social-right">
        <section className="flow-right-card"><div className="flow-right-title"><strong>Sugestões para você</strong><button onClick={() => go('/app/explorar')}>Ver todos</button></div>{suggestions.length === 0 ? <p className="flow-right-empty">Novas sugestões aparecerão conforme o ecossistema tiver usuários disponíveis.</p> : suggestions.slice(0, 5).map(profile => <Suggestion key={profile.uid} profile={profile} onClick={() => openProfile(profile.uid, profile)} />)}</section>
        <section className="flow-right-card flow-security-card"><Shield /><div><strong>FLOW Guardian</strong><p>Proteção e moderação fazem parte da experiência. Denuncie conteúdos que violem as diretrizes.</p></div><button onClick={() => go('/app/denunciar')}>Denunciar conteúdo</button></section>
      </aside>
    </div>
    {selectedProfile && <ProfilePanel profile={selectedProfile} loading={profileLoading} onClose={() => setSelectedProfile(null)} own={selectedProfile.uid === user.uid} />}
  </div>;
}

function SidebarButton({ icon, label, active, onClick }: { icon: ReactElement; label: string; active?: boolean; onClick: () => void }) { return <button className={`flow-sidebar-item ${active ? 'active' : ''}`} onClick={onClick}>{icon}<span>{label}</span></button>; }
function Composer({ profile }: { profile: Profile }) { return <section className="flow-composer" onClick={() => go('/app/criar')} role="button" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') go('/app/criar'); }}><div className="flow-avatar-small">{profile.name[0]?.toUpperCase()}</div><span>O que está acontecendo?</span><button><ImageIcon size={18} /> Imagem</button><button><Video size={18} /> Vídeo</button><button><Plus size={18} /> Mais</button></section>; }
function PostCard({ post, liked, onLike, onProfile }: { post: SocialPost; liked: boolean; onLike: () => void; onProfile: () => void }) {
  const authorId = firstText(post, ['authorId', 'userId', 'uid', 'authorUid']); const name = firstText(post.author, ['name', 'displayName'], 'Usuário'); const handle = firstText(post.author, ['handle', 'username'], authorId ? `@${authorId.slice(0, 8)}` : '@usuario'); const avatar = firstImage(post.author, ['avatarUrl', 'photoURL', 'avatar', 'photo']); const media = firstImage(post, ['imageUrl', 'mediaUrl', 'thumbnailUrl', 'image', 'photoUrl']); const caption = firstText(post, ['caption', 'text', 'content']); const likes = number(post.likes || post.likeCount); const comments = number(post.comments || post.commentCount); const shares = number(post.shares || post.shareCount);
  return <article className="flow-post-card"><header className="flow-post-head"><button className="flow-post-author" onClick={onProfile}><span className="flow-avatar">{avatar ? <img src={avatar} alt="" /> : <UserRound size={19} />}</span><span><strong>{name}</strong><small>{handle}</small></span></button><button className="flow-post-more" aria-label="Mais opções"><MoreHorizontal /></button></header>{caption && <p className="flow-post-caption">{caption}</p>}{media && <button className="flow-post-media" onClick={onProfile}><img src={media} alt="Publicação" />{post.video === true && <span className="flow-play"><Play fill="currentColor" /></span>}</button>}<footer className="flow-post-actions"><button className={liked ? 'liked' : ''} onClick={onLike}><Heart fill={liked ? 'currentColor' : 'none'} /><span>{likes + (liked ? 1 : 0)}</span></button><button><MessageCircle /><span>{comments}</span></button><button><Send /><span>{shares}</span></button><button className="save"><Bookmark /></button></footer></article>;
}
function Suggestion({ profile, onClick }: { profile: Profile; onClick: () => void }) { return <div className="flow-suggestion"><button className="flow-suggestion-user" onClick={onClick}><span className="flow-avatar">{profile.avatar ? <img src={profile.avatar} alt="" /> : <UserRound size={18} />}</span><span><strong>{profile.name}</strong><small>{profile.handle}</small></span></button><button className="flow-follow" onClick={() => undefined}>Seguir</button></div>; }
function ProfilePanel({ profile, loading, onClose, own }: { profile: Profile; loading: boolean; onClose: () => void; own: boolean }) { return <div className="flow-profile-overlay" role="dialog" aria-modal="true"><button className="flow-profile-backdrop" aria-label="Fechar perfil" onClick={onClose} /><section className="flow-profile-panel"><button className="flow-profile-close" onClick={onClose}><X /></button><div className="flow-profile-cover" style={profile.cover ? { backgroundImage: `url(${profile.cover})` } : undefined} /><div className="flow-profile-body"><div className="flow-profile-avatar">{profile.avatar ? <img src={profile.avatar} alt="" /> : <UserRound size={32} />}</div><div className="flow-profile-meta"><div><h2>{profile.name}</h2><span>{profile.handle}</span></div>{!own && <button className="flow-follow-primary">Seguir</button>}</div>{loading ? <p>Carregando perfil…</p> : <p>{profile.bio || 'Este perfil ainda não adicionou uma descrição pública.'}</p>}<div className="flow-profile-stats"><span><strong>—</strong> publicações</span><span><strong>—</strong> seguidores</span><span><strong>—</strong> seguindo</span></div></div></section></div>; }
function go(path: string) { history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo(0, 0); }
