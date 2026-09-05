import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import type { FeedTabsProps } from './FeedTabs.types';
import './FeedTabs.css';

export default function FeedTabs({ activeTab, onChange }: FeedTabsProps) {
  return (
    <div className="flow-feed-tabs-bar">
      <div className="flow-feed-tab-buttons">
        <button
          className={`flow-feed-tab-btn ${activeTab === 'for-you' ? 'active' : ''}`}
          onClick={() => onChange('for-you')}
        >
          Para você
        </button>
        <button
          className={`flow-feed-tab-btn ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => onChange('following')}
        >
          Seguindo
        </button>
        <button
          className={`flow-feed-tab-btn ${activeTab === 'communities' ? 'active' : ''}`}
          onClick={() => onChange('communities')}
        >
          Comunidades
        </button>
      </div>
      <div className="flow-feed-tabs-right">
        <button className="flow-tab-filter-icon" aria-label="Filtrar">
          <SlidersHorizontal size={18} />
        </button>
        <button className="flow-tab-sort-btn">
          <span>Mais recentes</span>
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
}
