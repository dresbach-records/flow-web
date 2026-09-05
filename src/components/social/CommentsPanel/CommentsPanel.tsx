import { X } from 'lucide-react';
import { useComments } from '../../../hooks/useComments';
import type { CommentsPanelProps } from './CommentsPanel.types';
import './CommentsPanel.css';

export default function CommentsPanel({ post, onClose }: CommentsPanelProps) {
  const { comments } = useComments(post.id);

  return (
    <div className="flow-comments-overlay">
      <div className="flow-comments-backdrop" onClick={onClose} />
      <div className="flow-comments-modal">
        <header className="flow-comments-header">
          <strong>Comentários</strong>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </header>
        <div className="flow-comments-list">
          {comments.map((c) => (
            <div key={c.id} className="flow-comment-item">
              <strong>{c.authorId}</strong>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
