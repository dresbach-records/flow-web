import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { FlowIcon, FlowLogo } from '../assets/flowAssets';
import { useAppContext } from '../contexts/AppContext';
import { getDocument, listDocuments, type WithId } from '../services/firebase/firestore';
import { logout } from '../services/firebase/auth';
import { addComment, createPost, hasLiked, listComments, toggleFollow, toggleLike, toggleSaved, uploadPostMedia, type CommentRecord } from '../services/firebase/social';
import './social-feed.css';
import './social-reference.css';

type RawRecord = Record<string, unknown>;
type SocialPost = WithId<RawRecord> & { author?: RawRecord | null };
type SocialStory = WithId<RawRecord> & { author?: RawRecord | null };

type Profile = { uid: string; name: string; handle: string; avatar?: string; cover?: string; bio?: string };
type IconProps = { size?: number; className?: string; fill?: string };
const icon = (name: Parameters<typeof FlowIcon>[0]['name']) => (props: IconProps) => <FlowIcon name={name} size={props.size ?? 20} className={props.className} />;
const Bell = icon('bell'); const Bookmark = icon('bookmark'); const Compass = icon('compass'); const Heart = icon('heart'); const ImageIcon = icon('image'); const Mail = icon('mail'); const Menu = icon('menu'); const MessageCircle = icon('comment'); const MoreHorizontal = icon('more'); const Play = icon('play'); const Plus = icon('plus'); const Search = icon('search'); const Send = icon('send'); const Settings = icon('settings'); const Shield = icon('shield'); const UserRound = icon('user'); const Users = icon('users'); const Video = icon('video'); const X = icon('close');

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

export default function SocialFeed({ path = '/app' }: { path?: string }) {
  const { user, loading } = useAppContext();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [stories, setStories] = useState<SocialStory[]>([]);
  const [suggestions, setSuggestions] = useState<Profile[]>([]);
  const [active, setActive] = useState<'for-you' | 'following'>(path === '/app/seguindo' ? 'following' : 'for-you');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [commentsPost, setCommentsPost] = useState<SocialPost | null>(null);
  const screen = path.split('/')[2] || 'for-you';

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
      const likedIds = await Promise.all(enrichedPosts.map(async post => (await hasLiked(post.id)) ? post.id : null));
      if (cancelled) return;
      setLiked(new Set(likedIds.filter((id): id is string => Boolean(id))));
      const loadedSuggestions = loadedUsers.filter(item => item.id !== user.uid).map(item => ({
        uid: item.id,
        name: firstText(item, ['name', 'displayName'], 'Usuário'),
        handle: firstText(item, ['handle', 'username'], `@${item.id.slice(0, 8)}`),
        avatar: firstImage(item, ['avatarUrl', 'photoURL', 'avatar', 'photo']),
        bio: firstText(item, ['bio', 'description']),
      }));
      setSuggestions(loadedSuggestions);
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

  const handleLike = async (postId: string) => {
    const wasLiked = liked.has(postId);
    setLiked(current => { const next = new Set(current); wasLiked ? next.delete(postId) : next.add(postId); return next; });
    try { await toggleLike(postId, wasLiked); } catch { setLiked(current => { const next = new Set(current); wasLiked ? next.add(postId) : next.delete(postId); return next; }); }
  };
  const handleFollow = async (uid: string) => { const wasFollowing = followed.has(uid); setFollowed(current => { const next = new Set(current); wasFollowing ? next.delete(uid) : next.add(uid); return next; }); try { await toggleFollow(uid, wasFollowing); } catch { setFollowed(current => { const next = new Set(current); wasFollowing ? next.add(uid) : next.delete(uid); return next; }); } };
  const handleSave = async (postId: string) => { const wasSaved = saved.has(postId); setSaved(current => { const next = new Set(current); wasSaved ? next.delete(postId) : next.add(postId); return next; }); try { await toggleSaved(postId, wasSaved); } catch { setSaved(current => { const next = new Set(current); wasSaved ? next.add(postId) : next.delete(postId); return next; }); } };

  if (loading || !user) return <div className="flow-social-loading">Carregando seu FLOW…</div>;
  const ownProfile = profileFromUser(user);

  return <div className="flow-social">
    <header className="flow-social-header">
      <button className="flow-mobile-trigger" aria-label="Abrir menu" onClick={() => setMobileMenu(true)}><Menu /></button>
      <button className="flow-brand" onClick={() => go('/app')}><FlowLogo alt="FLOW" /></button>
      <label className="flow-search"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar no FLOW" /></label>
      <nav className="flow-header-nav" aria-label="Navegação principal"><button className="is-active" onClick={() => go('/app')}><Compass /></button><button onClick={() => go('/app/mensagens')}><Mail /></button><button onClick={() => go('/app/notificacoes')}><Bell /></button></nav>
      <button className="flow-user-trigger" onClick={() => openProfile(user.uid, { name: user.displayName, photoURL: user.photoURL })}>{user.photoURL ? <img src={user.photoURL} alt="" /> : user.displayName?.[0]?.toUpperCase() || <UserRound size={17} />}</button>
      <button className="flow-create-top" onClick={() => go('/app/criar')}><Plus size={18} /> Criar</button>
    </header>

    <div className="flow-social-shell">
      <aside className={`flow-social-sidebar ${mobileMenu ? 'is-open' : ''}`}>
        <div className="flow-sidebar-head"><button className="flow-brand" onClick={() => go('/app')}><FlowLogo alt="FLOW" /></button><button className="flow-close-mobile" onClick={() => setMobileMenu(false)}><X /></button></div>
        <nav>
          <SidebarButton icon={<Compass />} label="For You" active={(screen === 'for-you' || screen === 'app') && active === 'for-you'} onClick={() => { setActive('for-you'); go('/app'); setMobileMenu(false); }} />
          <SidebarButton icon={<Users />} label="Seguindo" active={screen === 'seguindo' || (screen === 'for-you' && active === 'following')} onClick={() => { setActive('following'); go('/app/seguindo'); setMobileMenu(false); }} />
          <SidebarButton icon={<Compass />} label="Explorar" active={screen === 'explorar'} onClick={() => go('/app/explorar')} />
          <SidebarButton icon={<Play />} label="Shorts" active={screen === 'shorts'} onClick={() => go('/app/shorts')} />
          <SidebarButton icon={<Video />} label="Criar" onClick={() => go('/app/criar')} />
          <SidebarButton icon={<Mail />} label="Mensagens" active={screen === 'mensagens'} onClick={() => go('/app/mensagens')} />
          <SidebarButton icon={<Users />} label="Comunidades" active={screen === 'comunidades'} onClick={() => go('/app/comunidades')} />
          <SidebarButton icon={<UserRound />} label="Perfil" active={screen === 'perfil'} onClick={() => openProfile(user.uid, { name: user.displayName, photoURL: user.photoURL })} />
          <SidebarButton icon={<Bookmark />} label="Salvos" onClick={() => go('/app/salvos')} />
          <SidebarButton icon={<Settings />} label="Configurações" onClick={() => go('/app/configuracoes')} />
        </nav>
        <div className="flow-sidebar-bottom"><button className="flow-theme-toggle" type="button" onClick={() => { const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next; localStorage.setItem('flow.theme', next); }}><FlowIcon name="moon" size={18} /> Modo escuro <i /></button><small className="flow-sidebar-copy">© 2026 FLOW<br /><span>Seu mundo. Em movimento.</span></small><button onClick={() => void logout()}><FlowIcon name="logout" size={17} /> Sair</button></div>
      </aside>
      {mobileMenu && <button className="flow-mobile-backdrop" aria-label="Fechar menu" onClick={() => setMobileMenu(false)} />}

      <main className="flow-feed-column">
        {screen === 'for-you' || screen === 'seguindo' ? <><div className="flow-feed-tabs"><button className={active === 'for-you' ? 'active' : ''} onClick={() => setActive('for-you')}>Para você</button><button className={active === 'following' ? 'active' : ''} onClick={() => setActive('following')}>Seguindo</button></div>
        <Composer profile={ownProfile} />
        <section className="flow-stories" aria-label="Stories">
          {stories.length > 0 ? stories.map(story => { const uid = firstText(story, ['authorId', 'userId', 'uid', 'authorUid']); const avatar = firstImage(story.author, ['avatarUrl', 'photoURL', 'avatar', 'photo']) || firstImage(story, ['avatarUrl', 'photoURL', 'avatar', 'photo']); return <button key={story.id} className="flow-story" onClick={() => uid && openProfile(uid, story.author)}><span className="flow-story-ring">{avatar ? <img src={avatar} alt="" /> : <UserRound size={21} />}</span><small>{firstText(story.author, ['name', 'displayName'], 'Story')}</small></button>; }) : <div className="flow-empty-inline">Stories publicados por pessoas que você segue aparecerão aqui.</div>}
        </section>
        <div className="flow-post-list">
          {visiblePosts.map(post => <PostCard key={post.id} post={post} liked={liked.has(post.id)} saved={saved.has(post.id)} onLike={() => void handleLike(post.id)} onSave={() => void handleSave(post.id)} onComments={() => setCommentsPost(post)} onShare={() => void sharePost(post.id)} onProfile={() => openProfile(firstText(post, ['authorId', 'userId', 'uid', 'authorUid']), post.author)} />)}
          {visiblePosts.length === 0 && <div className="flow-empty-feed"><ImageIcon size={28} /><h3>Seu feed ainda está vazio</h3><p>Quando houver publicações reais disponíveis para sua conta, elas aparecerão aqui.</p></div>}
        </div></> : screen === 'criar' ? <CreatePost profile={ownProfile} /> : <SocialPlaceholder screen={screen} />}
      </main>

      <aside className="flow-social-right">
        <section className="flow-right-card"><div className="flow-right-title"><strong>Sugestões para você</strong><button onClick={() => go('/app/explorar')}>Ver todos</button></div>{suggestions.length === 0 ? <p className="flow-right-empty">Nenhuma sugestão disponível ainda.</p> : suggestions.slice(0, 5).map(profile => <Suggestion key={profile.uid} profile={profile} followed={followed.has(profile.uid)} onFollow={() => void handleFollow(profile.uid)} onClick={() => openProfile(profile.uid, profile)} />)}</section>
        <section className="flow-right-card"><div className="flow-right-title"><strong>Tendências para você</strong><button onClick={() => go('/app/explorar')}>Ver todos</button></div><Trend tag="#FlowAoVivo" count="12,5 mil posts" /><Trend tag="#CriadoresFLOW" count="8.742 posts" /><Trend tag="#EmMovimento" count="6.338 posts" /><Trend tag="#ConexõesReais" count="4.921 posts" /><Trend tag="#FlowLifestyle" count="3.210 posts" /></section>
        <section className="flow-right-card"><div className="flow-right-title"><strong>Quem seguir</strong><button onClick={() => go('/app/explorar')}>Ver todos</button></div>{['fotografia.flow', 'motivacao.flow', 'empreende.flow'].map((handle, index) => <div className="flow-follow-row" key={handle}><span className="flow-avatar"><UserRound size={16} /></span><div><strong>@{handle}</strong><small>{['Fotografia', 'Motivação Diária', 'Empreendedorismo'][index]}</small></div><button className="flow-follow">Seguir</button></div>)}</section>
        <section className="flow-right-card flow-security-card"><Shield /><div><strong>FLOW Guardian</strong><p>Proteção e moderação fazem parte da experiência. Denuncie conteúdos que violem as diretrizes.</p></div><button onClick={() => go('/app/denunciar')}>Denunciar conteúdo</button></section>
      </aside>
    </div>
    {selectedProfile && <ProfilePanel profile={selectedProfile} loading={profileLoading} onClose={() => setSelectedProfile(null)} own={selectedProfile.uid === user.uid} />}
    {commentsPost && <CommentsPanel post={commentsPost} onClose={() => setCommentsPost(null)} />}
  </div>;
}

function SidebarButton({ icon, label, active, onClick }: { icon: ReactElement; label: string; active?: boolean; onClick: () => void }) { return <button className={`flow-sidebar-item ${active ? 'active' : ''}`} onClick={onClick}>{icon}<span>{label}</span></button>; }
function Composer({ profile }: { profile: Profile }) { return <section className="flow-composer"><div className="flow-avatar-small">{profile.name[0]?.toUpperCase()}</div><button className="flow-composer-prompt" type="button" onClick={() => go('/app/criar')}>O que está acontecendo?</button><button type="button" onClick={() => go('/app/criar')}><ImageIcon size={16} /> Imagem</button><button type="button" onClick={() => go('/app/criar')}><Video size={16} /> Vídeo</button><button type="button" onClick={() => go('/app/criar')}><Users size={16} /> Enquete</button><button type="button" onClick={() => go('/app/criar')}><Heart size={16} /> Sentimento</button><button className="flow-publish" type="button" onClick={() => go('/app/criar')}>Publicar</button></section>; }
function CreatePost({ profile }: { profile: Profile }) {
  const [value, setValue] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const chooseFile = (next: File | undefined) => { if (!next) return; setFile(next); setPreview(URL.createObjectURL(next)); setError(''); };
  const publish = async () => {
    setError('');
    try {
      setBusy(true);
      const media = file ? await uploadPostMedia(file, setProgress) : null;
      await createPost({ text: value, type: media ? (file?.type.startsWith('video/') ? 'video' : 'image') : 'text', media });
      go('/app');
    } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível publicar agora.'); } finally { setBusy(false); }
  };
  return <section className="flow-create-post"><header><button type="button" onClick={() => go('/app')}>Cancelar</button><h1>Criar publicação</h1><button className="flow-publish" type="button" onClick={() => void publish()} disabled={busy}>{busy ? `${progress}%` : 'Publicar'}</button></header><div className="flow-create-author"><div className="flow-avatar-small">{profile.name[0]?.toUpperCase()}</div><strong>{profile.name}</strong></div><textarea value={value} onChange={event => setValue(event.target.value)} placeholder="O que está acontecendo?" autoFocus /><label className="flow-media-picker"><ImageIcon size={20} /><span>Adicionar imagem ou vídeo</span><input type="file" accept="image/*,video/*" onChange={event => chooseFile(event.target.files?.[0])} /></label>{preview && (file?.type.startsWith('video/') ? <video className="flow-create-preview" src={preview} controls /> : <img className="flow-create-preview" src={preview} alt="Pré-visualização" />)}{error && <p className="flow-create-error" role="alert">{error}</p>}</section>;
}
async function sharePost(postId: string) { const url = `${window.location.origin}/app/post/${postId}`; if (navigator.share) await navigator.share({ title: 'FLOW', url }); else await navigator.clipboard.writeText(url); }
function PostCard({ post, liked, saved, onLike, onSave, onComments, onShare, onProfile }: { post: SocialPost; liked: boolean; saved: boolean; onLike: () => void; onSave: () => void; onComments: () => void; onShare: () => void; onProfile: () => void }) {
  const authorId = firstText(post, ['authorId', 'userId', 'uid', 'authorUid']); const name = firstText(post.author, ['name', 'displayName'], 'Usuário'); const handle = firstText(post.author, ['handle', 'username'], authorId ? `@${authorId.slice(0, 8)}` : '@usuario'); const avatar = firstImage(post.author, ['avatarUrl', 'photoURL', 'avatar', 'photo']); const media = firstImage(post, ['imageUrl', 'mediaUrl', 'thumbnailUrl', 'image', 'photoUrl']); const caption = firstText(post, ['caption', 'text', 'content']); const likes = number(post.likes || post.likeCount); const comments = number(post.comments || post.commentCount); const shares = number(post.shares || post.shareCount);
  return <article className="flow-post-card"><header className="flow-post-head"><button className="flow-post-author" onClick={onProfile}><span className="flow-avatar">{avatar ? <img src={avatar} alt="" /> : <UserRound size={19} />}</span><span><strong>{name}</strong><small>{handle}</small></span></button><button className="flow-post-more" aria-label="Mais opções"><MoreHorizontal /></button></header>{caption && <p className="flow-post-caption">{caption}</p>}{media && <button className="flow-post-media" onClick={onProfile}><img src={media} alt="Publicação" />{post.video === true && <span className="flow-play"><Play fill="currentColor" /></span>}</button>}<footer className="flow-post-actions"><button className={liked ? 'liked' : ''} onClick={onLike}><Heart fill={liked ? 'currentColor' : 'none'} /><span>{likes + (liked ? 1 : 0)}</span></button><button onClick={onComments}><MessageCircle /><span>{comments}</span></button><button onClick={onShare}><Send /><span>{shares}</span></button><button className={`save ${saved ? 'liked' : ''}`} onClick={onSave}><Bookmark fill={saved ? 'currentColor' : 'none'} /></button></footer></article>;
}
function Suggestion({ profile, followed, onFollow, onClick }: { profile: Profile; followed: boolean; onFollow: () => void; onClick: () => void }) { return <div className="flow-suggestion"><button className="flow-suggestion-user" onClick={onClick}><span className="flow-avatar">{profile.avatar ? <img src={profile.avatar} alt="" /> : <UserRound size={18} />}</span><span><strong>{profile.name}</strong><small>{profile.handle}</small></span></button><button className="flow-follow" onClick={onFollow}>{followed ? 'Seguindo' : 'Seguir'}</button></div>; }
function Trend({ tag, count }: { tag: string; count: string }) { return <button className="flow-trend" onClick={() => go('/app/explorar')}><strong>{tag}</strong><small>{count}</small></button>; }
function CommentsPanel({ post, onClose }: { post: SocialPost; onClose: () => void }) {
  const [comments, setComments] = useState<CommentRecord[]>([]); const [value, setValue] = useState(''); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  useEffect(() => { void listComments(post.id).then(setComments).catch(() => setError('Não foi possível carregar os comentários.')); }, [post.id]);
  const submit = async () => { if (!value.trim()) return; try { setBusy(true); const id = await addComment(post.id, value); setComments(current => [...current, { id, authorId: 'Você', text: value.trim() }]); setValue(''); } catch { setError('Não foi possível publicar o comentário.'); } finally { setBusy(false); } };
  return <div className="flow-comments-overlay"><button aria-label="Fechar comentários" onClick={onClose} /><section className="flow-comments-panel"><header><strong>Comentários</strong><button onClick={onClose}><X /></button></header><div className="flow-comments-list">{error && <p className="flow-create-error">{error}</p>}{comments.length === 0 && !error && <p className="flow-right-empty">Nenhum comentário ainda.</p>}{comments.map(comment => <article key={comment.id}><span className="flow-avatar"><UserRound size={16} /></span><p><strong>{comment.authorId}</strong>{comment.text}</p></article>)}</div><form onSubmit={event => { event.preventDefault(); void submit(); }}><input value={value} onChange={event => setValue(event.target.value)} placeholder="Adicione um comentário..." /><button disabled={busy}>Enviar</button></form></section></div>;
}
function SocialPlaceholder({ screen }: { screen: string }) {
  const labels: Record<string, string> = { explorar: 'Explorar', shorts: 'Shorts', mensagens: 'Mensagens', comunidades: 'Comunidades', perfil: 'Perfil', salvos: 'Salvos', configuracoes: 'Configurações' };
  return <section className="flow-social-page"><span className="flow-page-eyebrow">FLOW</span><h1>{labels[screen] || 'Em breve'}</h1><p>Descubra conteúdos, pessoas e conversas que fazem parte do seu FLOW.</p></section>;
}
function ProfilePanel({ profile, loading, onClose, own }: { profile: Profile; loading: boolean; onClose: () => void; own: boolean }) { return <div className="flow-profile-overlay" role="dialog" aria-modal="true"><button className="flow-profile-backdrop" aria-label="Fechar perfil" onClick={onClose} /><section className="flow-profile-panel"><button className="flow-profile-close" onClick={onClose}><X /></button><div className="flow-profile-cover" style={profile.cover ? { backgroundImage: `url(${profile.cover})` } : undefined} /><div className="flow-profile-body"><div className="flow-profile-avatar">{profile.avatar ? <img src={profile.avatar} alt="" /> : <UserRound size={32} />}</div><div className="flow-profile-meta"><div><h2>{profile.name}</h2><span>{profile.handle}</span></div>{!own && <button className="flow-follow-primary">Seguir</button>}</div>{loading ? <p>Carregando perfil…</p> : <p>{profile.bio || 'Este perfil ainda não adicionou uma descrição pública.'}</p>}<div className="flow-profile-stats"><span><strong>—</strong> publicações</span><span><strong>—</strong> seguidores</span><span><strong>—</strong> seguindo</span></div></div></section></div>; }
function go(path: string) { history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo(0, 0); }
