import { Plus } from 'lucide-react';
import type { StoriesRailProps } from './StoriesRail.types';
import './StoriesRail.css';

export default function StoriesRail({ stories }: StoriesRailProps) {
  if (stories.length === 0) {
    return (
      <section className="flow-stories-card">
        <p className="flow-stories-empty">Nenhum story por aqui ainda — os stories da sua rede aparecem aqui.</p>
      </section>
    );
  }
  return (
    <section className="flow-stories-card">
      <div className="flow-stories-scroll">
        {stories.map((story) => (
          <button key={story.id} className="flow-story-item">
            <div className={`flow-story-avatar-wrapper ${story.isOwn ? 'own-story' : ''}`}>
              <img src={story.avatar} alt={story.name} className="flow-story-img" />
              {story.isOwn && (
                <div className="flow-story-plus-badge">
                  <Plus size={12} color="#FFFFFF" strokeWidth={3} />
                </div>
              )}
            </div>
            <span className="flow-story-name">{story.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
