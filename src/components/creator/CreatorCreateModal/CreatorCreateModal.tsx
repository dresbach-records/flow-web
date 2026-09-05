import { Play, Sparkles, Video, X } from 'lucide-react';

export interface CreatorCreateModalProps {
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export default function CreatorCreateModal({ onClose, onNavigate }: CreatorCreateModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="create-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>
          <X />
        </button>
        <span className="eyebrow">CRIAR NO FLOW</span>
        <h2>O que você quer publicar?</h2>
        <p>Escolha um formato para começar sua próxima criação.</p>
        <div className="create-options">
          <button onClick={() => onNavigate('/app/criar/post')}>
            <span className="image-icon">▧</span>
            <b>Publicação</b>
            <small>Foto, vídeo ou texto</small>
          </button>
          <button onClick={() => onNavigate('/app/criar/short')}>
            <Play />
            <b>Short</b>
            <small>Vídeo curto vertical</small>
          </button>
          <button onClick={() => onNavigate('/app/stories')}>
            <Sparkles />
            <b>Story</b>
            <small>Conteúdo por 24 horas</small>
          </button>
          <button onClick={() => onNavigate('/app/live')}>
            <Video />
            <b>Live</b>
            <small>Transmissão ao vivo</small>
          </button>
        </div>
      </div>
    </div>
  );
}
