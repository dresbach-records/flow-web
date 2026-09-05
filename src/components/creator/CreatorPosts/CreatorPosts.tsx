import { Eye, Heart, Plus, Share2 } from 'lucide-react';
import CreatorMetric from '../CreatorMetric';
import CreatorVideoRow from '../CreatorVideoRow';
import type { CreatorVideo } from '../types';

export interface CreatorPostsProps {
  onPublish: () => void;
  videos?: CreatorVideo[];
  likesTotal?: number;
  commentsTotal?: number;
  sharesTotal?: number;
}

export default function CreatorPosts({ onPublish, videos = [], likesTotal = 0, commentsTotal = 0, sharesTotal = 0 }: CreatorPostsProps) {
  return (
    <section className="panel page-panel">
      <div className="panel-head">
        <div>
          <span className="eyebrow">CONTEÚDO</span>
          <h3>Desempenho das publicações</h3>
        </div>
        <button className="mini-create" onClick={onPublish}>
          <Plus /> Publicar
        </button>
      </div>
      <div className="post-summary">
        <CreatorMetric icon={Eye} label="Visualizações" value="—" />
        <CreatorMetric icon={Heart} label="Curtidas" value={String(likesTotal)} />
        <CreatorMetric icon={Share2} label="Compartilhamentos" value={String(sharesTotal)} />
      </div>
      <div className="video-list">
        {videos.length === 0 && (
          <p className="chart-pending">Nenhum conteúdo publicado ainda — {commentsTotal} comentários no total.</p>
        )}
        {videos.map((v) => (
          <CreatorVideoRow key={v.title} video={v} />
        ))}
      </div>
    </section>
  );
}
