import { useState } from 'react';
import { Bookmark, CheckCircle2, Heart, MessageCircle, MoreHorizontal, Share2 } from 'lucide-react';
import { ReportDialog } from '../../moderation/ReportDialog';
import type { CommentPreview, SocialPost } from '../types';
import type { PostCardProps } from './PostCard.types';
import './PostCard.css';

export default function PostCard({ post, liked, saved, onLike, onSave, onComments }: PostCardProps) {
  const [reportOpen, setReportOpen] = useState(false);
  const authorName = (post.author?.name as string) || 'Usuário';
  const authorHandle = (post.author?.handle as string) || '@usuario';
  const authorAvatar = (post.author?.avatarUrl as string) || '/logo.png';
  const isVerified = post.author?.verified === true;
  const caption = (post.caption as string) || (post.text as string) || '';
  const hashtags = (post.hashtags as string[]) || [];
  const imageUrl = (post.imageUrl as string) || (post.mediaUrl as string) || '';
  const likesCount = (post.likes as number) || (post.likesCount as number) || 0;
  const commentsCount = (post.comments as number) || (post.commentsCount as number) || 0;
  const sharesCount = (post.shares as number) || (post.sharesCount as number) || 0;
  const timeAgo = (post.timeAgo as string) || '';
  const commentPreview = post.commentPreview as CommentPreview | undefined;

  const handleShare = () => {
    const url = `${window.location.origin}/app`;
    if (navigator.clipboard) void navigator.clipboard.writeText(url).catch(() => undefined);
  };

  return (
    <article className="flow-post-card">
      {/* Header */}
      <header className="flow-post-header">
        <div className="flow-post-author-box">
          <img src={authorAvatar} alt={authorName} className="flow-post-author-avatar" />
          <div className="flow-post-author-meta">
            <div className="flow-post-author-name-row">
              <strong className="flow-post-author-name">{authorName}</strong>
              {isVerified && (
                <span className="flow-verified-badge" title="Conta verificada">
                  <CheckCircle2 size={16} color="#3B82F6" fill="#3B82F6" stroke="#FFFFFF" />
                </span>
              )}
              <span className="flow-post-handle">{authorHandle}</span>
              {timeAgo && (
                <>
                  <span className="flow-post-dot">•</span>
                  <span className="flow-post-time">{timeAgo}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <button className="flow-post-more-btn" aria-label="Mais opções" onClick={() => setReportOpen(true)}>
          <MoreHorizontal size={18} />
        </button>
      </header>
      {reportOpen && <ReportDialog targetId={post.id} onClose={() => setReportOpen(false)} />}

      {/* Caption & Hashtags */}
      {caption && <p className="flow-post-caption-text">{caption}</p>}
      {hashtags.length > 0 && (
        <div className="flow-post-hashtags-row">
          {hashtags.map((tag) => (
            <span key={tag} className="flow-post-hashtag">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Media Image */}
      {imageUrl && (
        <div className="flow-post-media-box">
          <img src={imageUrl} alt="Publicação" className="flow-post-media-img" />
        </div>
      )}

      {/* Post Action Bar */}
      <footer className="flow-post-action-bar">
        <div className="flow-post-actions-left">
          <button className={`flow-action-btn ${liked ? 'is-liked' : ''}`} onClick={onLike}>
            <Heart size={20} fill={liked ? '#EC4899' : 'none'} color={liked ? '#EC4899' : '#64748B'} />
            <span>{likesCount > 1000 ? `${(likesCount / 1000).toFixed(1)}K` : likesCount}</span>
          </button>
          <button className="flow-action-btn" onClick={onComments} aria-label="Comentários">
            <MessageCircle size={20} color="#64748B" />
            <span>{commentsCount}</span>
          </button>
          <button className="flow-action-btn" onClick={handleShare} aria-label="Copiar link da publicação">
            <Share2 size={20} color="#64748B" />
            <span>{sharesCount}</span>
          </button>
        </div>
        <div className="flow-post-actions-right">
          <button className={`flow-action-btn ${saved ? 'is-saved' : ''}`} onClick={onSave}>
            <Bookmark size={20} fill={saved ? '#2563EB' : 'none'} color={saved ? '#2563EB' : '#64748B'} />
            <span>Salvar</span>
          </button>
        </div>
      </footer>

      {/* Comment Preview Section */}
      {commentPreview && (
        <div className="flow-post-comment-preview">
          <div className="flow-comment-row">
            <img src={commentPreview.authorAvatar} alt={commentPreview.authorName} className="flow-comment-avatar" />
            <div className="flow-comment-body">
              <span className="flow-comment-author-name">{commentPreview.authorName}</span>
              <span className="flow-comment-text">{commentPreview.text}</span>
              <div className="flow-comment-meta">
                <span className="flow-comment-time">{commentPreview.timeAgo}</span>
                <button className="flow-comment-reply-btn">Responder</button>
              </div>
            </div>
          </div>
          <button className="flow-view-more-comments-btn" onClick={onComments}>
            Ver {commentsCount > 0 ? `${commentsCount} ` : ''}comentários
          </button>
        </div>
      )}
    </article>
  );
}

export type { SocialPost };
