import { Eye, Heart, Plus, Share2 } from 'lucide-react';
import { creatorVideos } from '../data';
import CreatorMetric from '../CreatorMetric';
import CreatorVideoRow from '../CreatorVideoRow';

export interface CreatorPostsProps {
  onPublish: () => void;
}

export default function CreatorPosts({ onPublish }: CreatorPostsProps) {
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
        <CreatorMetric icon={Eye} label="Visualizações" value="47,9 mil" delta="+1.284" />
        <CreatorMetric icon={Heart} label="Curtidas" value="1.438" delta="+87" />
        <CreatorMetric icon={Share2} label="Compartilhamentos" value="584" delta="+29" />
      </div>
      <div className="video-list">
        {creatorVideos.map((v) => (
          <CreatorVideoRow key={v.title} video={v} />
        ))}
      </div>
    </section>
  );
}
