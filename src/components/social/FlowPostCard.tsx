import { useState } from 'react';
import { apiRequest } from '../../services/api/client';

type Post = { id: string; author: { username: string; displayName: string; avatarUrl?: string }; text?: string; mediaUrl?: string; likes: number; comments: number; liked?: boolean };

export function FlowPostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(Boolean(post.liked));
  const [likes, setLikes] = useState(post.likes);
  const toggleLike = async () => {
    const next = !liked;
    setLiked(next); setLikes(v => v + (next ? 1 : -1));
    try { await apiRequest({ path: `/api/v1/posts/${post.id}/like`, method: next ? 'POST' : 'DELETE' }); }
    catch { setLiked(!next); setLikes(v => v - (next ? 1 : -1)); }
  };
  return <article className="flow-post-card">
    <header><strong>{post.author.displayName}</strong><span>@{post.author.username}</span></header>
    {post.text && <p>{post.text}</p>}
    {post.mediaUrl && <video controls playsInline src={post.mediaUrl} />}
    <footer><button onClick={toggleLike} aria-pressed={liked}>{liked ? 'Curtido' : 'Curtir'} · {likes}</button><span>Comentários · {post.comments}</span></footer>
  </article>;
}
