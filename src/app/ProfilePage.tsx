import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ArrowLeft, Bell, Bookmark, Compass, Edit3, Heart, Mail, Menu, MessageCircle, MoreHorizontal, Play, Plus, Search, Settings, Shield, UserRound, Users, Video, X } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { getDocument, listDocuments, type WithId } from '../services/firebase/firestore';
import { logout } from '../services/firebase/auth';
import './profile-page.css';

type RecordData = Record<string, unknown>;
type Profile = { uid: string; name: string; handle: string; avatar?: string; cover?: string; bio?: string; location?: string; website?: string; followers?: number; following?: number };
type Post = WithId<RecordData> & { author?: RecordData | null };
const text = (value: unknown, fallback = '') => typeof value === 'string' ? value : fallback;
const number = (value: unknown) => typeof value === 'number' ? value : Number(value ?? 0) || 0;
const firstText = (obj: RecordData | null | undefined, keys: string[], fallback = '') => { for (const key of keys) { const value = text(obj?.[key]); if (value) return value; } return fallback; };
const image = (obj: RecordData | null | undefined, keys: string[]) => firstText(obj, keys);
function navigate(path: string) { history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0, behavior: 'auto' }); }
function profileFromAuth(user: { uid: string; displayName: string | null; email: string | null }): Profile { const name = user.displayName?.trim() || user.email?.split('@')[0] || 'Usuário'; return { uid: user.uid, name, handle: `@${name.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '')}` }; }

export default function ProfilePage({ uid: routeUid }: { uid?: string }) {
  const { user, loading } = useAppContext();
  const uid = routeUid || user?.uid || '';
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [tab, setTab] = useState<'posts' | 'media' | 'likes'>('posts');
  const [search, setSearch] = useState('');
  const own = uid === user?.uid;

  useEffect(() => { if (!loading && !user) navigate('/auth/login'); }, [loading, user]);
  useEffect(() => {
    if (!uid || !user) return;
    let cancelled = false;
    setLoadingProfile(true);
    const load = async () => {
      const [userResult, postResult] = await Promise.allSettled([
        getDocument<RecordData>('users', uid),
        listDocuments<RecordData>('posts', { field: 'authorId', value: uid, orderByField: 'createdAt', direction: 'desc', max: 60 }),
      ]);
      if (cancelled) return;
      const stored = userResult.status === 'fulfilled' ? userResult.value : null;
      const source = stored ?? (own ? { name: user.displayName, displayName: user.displayName, email: user.email } : null);
      if (!source) { setProfile(null); setPosts([]); setLoadingProfile(false); return; }
      setProfile({ uid, name: firstText(source, ['name', 'displayName'], own ? profileFromAuth(user).name : 'Usuário'), handle: firstText(source, ['handle', 'username'], own ? profileFromAuth(user).handle : `@${uid.slice(0, 8)}`), avatar: image(source, ['avatarUrl', 'photoURL', 'avatar', 'photo']), cover: image(source, ['coverUrl', 'cover', 'banner']), bio: firstText(source, ['bio', 'description']), location: firstText(source, ['location', 'city']), website: firstText(source, ['website', 'websiteUrl']), followers: number(source.followers ?? source.followersCount), following: number(source.following ?? source.followingCount) });
      setPosts(postResult.status === 'fulfilled' ? postResult.value.map(post => ({ ...post, author: source })) : []);
      setLoadingProfile(false);
    };
    void load();
    return () => { cancelled = true; };
  }, [uid, user, own]);

  const visiblePosts = useMemo(() => {
    if (tab === 'media') return posts.filter(post => Boolean(image(post, ['imageUrl', 'mediaUrl', 'thumbnailUrl', 'image', 'photoUrl'])));
    if (tab === 'likes') return posts.filter(post => Boolean(post.likedByCurrentUser));
    return posts;
  }, [posts, tab]);
  if (loading || !user) return <div className="flow-profile-loading">Carregando seu FLOW…</div>;
  if (loadingProfile) return <div className="flow-profile-loading">Carregando perfil…</div>;
  if (!profile) return <div className="flow-profile-loading"><div><h2>Perfil não encontrado</h2><button className="flow-profile-action" onClick={() => navigate('/app')}>Voltar ao FLOW</button></div></div>;

  return <div className="flow-profile-page">
    <header className="flow-social-header"><button className="flow-mobile-trigger" aria-label="Abrir menu" onClick={() => setMobileMenu(true)}><Menu /></button><button className="flow-brand" onClick={() => navigate('/app')}>flow<span>•</span></button><label className="flow-search"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar no FLOW" /></label><nav className="flow-header-nav" aria-label="Navegação principal"><button onClick={() => navigate('/app')}><Compass /></button><button onClick={() => navigate('/app/mensagens')}><Mail /></button><button onClick={() => navigate('/app/notificacoes')}><Bell /></button></nav><button className="flow-user-trigger" onClick={() => navigate(`/app/perfil/${user.uid}`)}>{user.displayName?.[0]?.toUpperCase() || <UserRound size={17} />}</button><button className="flow-create-top" onClick={() => navigate('/app/criar')}><Plus size={18} /> Criar</button></header>
    <div className="flow-profile-shell">
      <aside className={`flow-social-sidebar ${mobileMenu ? 'is-open' : ''}`}><div className="flow-sidebar-head"><button className="flow-brand" onClick={() => navigate('/app')}>flow<span>•</span></button><button className="flow-close-mobile" onClick={() => setMobileMenu(false)}><X /></button></div><nav><SidebarItem icon={<Compass />} label="For You" onClick={() => navigate('/app')} /><SidebarItem icon={<Users />} label="Seguindo" onClick={() => navigate('/app/seguindo')} /><SidebarItem icon={<Compass />} label="Explorar" onClick={() => navigate('/app/explorar')} /><SidebarItem icon={<Play />} label="Shorts" onClick={() => navigate('/app/shorts')} /><SidebarItem icon={<Video />} label="Criar" onClick={() => navigate('/app/criar')} /><SidebarItem icon={<Mail />} label="Mensagens" onClick={() => navigate('/app/mensagens')} /><SidebarItem icon={<Bell />} label="Notificações" onClick={() => navigate('/app/notificacoes')} /><SidebarItem icon={<Users />} label="Comunidades" onClick={() => navigate('/app/comunidades')} /><SidebarItem icon={<UserRound />} label="Perfil" active={own} onClick={() => navigate(`/app/perfil/${user.uid}`)} /><SidebarItem icon={<Bookmark />} label="Salvos" onClick={() => navigate('/app/salvos')} /><SidebarItem icon={<Settings />} label="Configurações" onClick={() => navigate('/app/configuracoes')} /></nav><div className="flow-sidebar-bottom"><div className="flow-safety-note"><Shield size={18} /><div><strong>Seu espaço, suas regras.</strong><span>Privacidade, bloqueios e denúncias.</span></div></div><button onClick={() => void logout()}>Sair</button></div></aside>
      {mobileMenu && <button className="flow-mobile-backdrop" aria-label="Fechar menu" onClick={() => setMobileMenu(false)} />}
      <main className="flow-profile-main"><button className="flow-profile-back" onClick={() => navigate('/app')}><ArrowLeft size={17} /> Voltar ao feed</button>
        <section className="flow-profile-card"><div className="flow-profile-cover-page">{profile.cover && <img src={profile.cover} alt="" />}</div><div className="flow-profile-header-content"><div className="flow-profile-avatar-page">{profile.avatar ? <img src={profile.avatar} alt={profile.name} /> : <UserRound size={40} />}</div><div className="flow-profile-actions">{own ? <button className="flow-profile-outline"><Edit3 size={16} /> Editar perfil</button> : <button className="flow-profile-primary">Seguir</button>}<button className="flow-profile-icon" aria-label="Mais opções"><MoreHorizontal /></button></div><h1>{profile.name}</h1><div className="flow-profile-handle">{profile.handle}</div>{profile.bio && <p className="flow-profile-bio">{profile.bio}</p>}<div className="flow-profile-details">{profile.location && <span>⌖ {profile.location}</span>}{profile.website && <span>↗ {profile.website}</span>}</div><div className="flow-profile-stats-page"><span><strong>{posts.length}</strong> publicações</span>{profile.followers !== undefined && <span><strong>{profile.followers}</strong> seguidores</span>}{profile.following !== undefined && <span><strong>{profile.following}</strong> seguindo</span>}</div></div><nav className="flow-profile-tabs" aria-label="Conteúdo do perfil"><button className={tab === 'posts' ? 'active' : ''} onClick={() => setTab('posts')}>Publicações</button><button className={tab === 'media' ? 'active' : ''} onClick={() => setTab('media')}>Mídia</button>{own && <button className={tab === 'likes' ? 'active' : ''} onClick={() => setTab('likes')}><Heart size={15} /> Curtidas</button>}</nav></section>
        <section className="flow-profile-posts">{visiblePosts.length === 0 ? <div className="flow-profile-empty"><MessageCircle size={28} /><h2>Nenhuma publicação</h2><p>As publicações reais deste perfil aparecerão aqui quando forem criadas.</p></div> : visiblePosts.map(post => <ProfilePost key={post.id} post={post} />)}</section>
      </main>
    </div>
  </div>;
}
function SidebarItem({ icon, label, active, onClick }: { icon: ReactNode; label: string; active?: boolean; onClick: () => void }) { return <button className={`flow-sidebar-item ${active ? 'active' : ''}`} onClick={onClick}>{icon}<span>{label}</span></button>; }
function ProfilePost({ post }: { post: Post }) { const media = image(post, ['imageUrl', 'mediaUrl', 'thumbnailUrl', 'image', 'photoUrl']); const avatar = image(post.author, ['avatarUrl', 'photoURL', 'avatar', 'photo']); const caption = firstText(post, ['caption', 'text', 'content']); return <article className="flow-profile-post"><header><span className="flow-post-author"><span className="flow-avatar">{avatar ? <img src={avatar} alt="" /> : <UserRound size={19} />}</span><span><strong>{firstText(post.author, ['name', 'displayName'], 'Usuário')}</strong><small>{firstText(post.author, ['handle', 'username'])}</small></span></span><MoreHorizontal size={19} /></header>{caption && <p>{caption}</p>}{media && <div className="flow-profile-post-media"><img src={media} alt="Publicação" /></div>}<footer><span><Heart size={18} /> {number(post.likes || post.likeCount)}</span><span><MessageCircle size={18} /> {number(post.comments || post.commentCount)}</span><span><SendIcon /> {number(post.shares || post.shareCount)}</span></footer></article>; }
function SendIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>; }
