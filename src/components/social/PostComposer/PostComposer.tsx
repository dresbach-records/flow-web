import { BarChart2, Image as ImageIcon, MapPin, MoreHorizontal, Smile, Video } from 'lucide-react';
import type { PostComposerProps } from './PostComposer.types';
import './PostComposer.css';

export default function PostComposer({ userAvatar, onCreate }: PostComposerProps) {
  return (
    <section className="flow-composer-card">
      <div className="flow-composer-top">
        <img src={userAvatar} alt="User" className="flow-composer-avatar" />
        <input
          type="text"
          className="flow-composer-input"
          placeholder="No que você está pensando hoje?"
          onClick={onCreate}
          readOnly
        />
      </div>
      <div className="flow-composer-bottom">
        <div className="flow-composer-actions">
          <button type="button" className="flow-composer-btn btn-foto" onClick={onCreate}>
            <ImageIcon size={18} color="#2563EB" />
            <span>Foto</span>
          </button>
          <button type="button" className="flow-composer-btn btn-video" onClick={onCreate}>
            <Video size={18} color="#EA580C" />
            <span>Vídeo</span>
          </button>
          <button type="button" className="flow-composer-btn btn-enquete" onClick={onCreate}>
            <BarChart2 size={18} color="#9333EA" />
            <span>Enquete</span>
          </button>
          <button type="button" className="flow-composer-btn btn-sentimento" onClick={onCreate}>
            <Smile size={18} color="#D97706" />
            <span>Sentimento</span>
          </button>
          <button type="button" className="flow-composer-btn btn-localizacao" onClick={onCreate}>
            <MapPin size={18} color="#EC4899" />
            <span>Localização</span>
          </button>
          <button type="button" className="flow-composer-btn btn-more" onClick={onCreate}>
            <MoreHorizontal size={18} color="#64748B" />
          </button>
        </div>
        <button type="button" className="flow-composer-publish-btn" onClick={onCreate}>
          Publicar
        </button>
      </div>
    </section>
  );
}
