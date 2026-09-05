import { ChevronRight } from 'lucide-react';
import { creatorActions } from '../data';

export default function CreatorTools() {
  return (
    <section className="creator-tools">
      <div className="section-title">
        <div>
          <span className="eyebrow">FERRAMENTAS</span>
          <h2>Faça seu FLOW crescer</h2>
        </div>
        <button>
          Ver todas <ChevronRight />
        </button>
      </div>
      <div className="tool-grid">
        {creatorActions.map(([name, desc, Icon]) => (
          <button className="tool-card" key={name}>
            <span className="tool-icon">
              <Icon />
            </span>
            <span>
              <b>{name}</b>
              <small>{desc}</small>
            </span>
            <ChevronRight />
          </button>
        ))}
      </div>
    </section>
  );
}
