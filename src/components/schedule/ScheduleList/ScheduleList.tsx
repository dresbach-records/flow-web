import { FlowIcon } from '../../../assets/flowAssets';
import { formatDate, formatTime, statusLabels } from '../types';
import type { ScheduleListProps } from './ScheduleList.types';
import './ScheduleList.css';

export default function ScheduleList({ items, onSelect, onDelete }: ScheduleListProps) {
  return (
    <section className="flow-schedule-list">
      <div className="flow-schedule-list-head">
        <span>Conteúdo</span>
        <span>Perfil</span>
        <span>Data e hora</span>
        <span>Status</span>
        <span>Ações</span>
      </div>
      {items.length === 0 ? (
        <div className="flow-schedule-empty">
          <FlowIcon name="filter" size={30} />
          <h2>Nenhum agendamento encontrado</h2>
          <p>Crie uma publicação para organizar seu calendário.</p>
        </div>
      ) : (
        items.map((item) => (
          <article key={item.id}>
            <div className="flow-schedule-content">
              {item.mediaUrl && <img src={item.mediaUrl} alt="" />}
              <span>
                <strong>{item.text || 'Publicação sem texto'}</strong>
                <small>{item.type}</small>
              </span>
            </div>
            <span className="flow-schedule-profile-cell">{item.profileId}</span>
            <time>
              {formatDate(item.scheduledAt)}
              <small>{formatTime(item.scheduledAt)}</small>
            </time>
            <span className={`flow-schedule-status ${item.status.toLowerCase()}`}>{statusLabels[item.status]}</span>
            <div className="flow-schedule-row-actions">
              <button onClick={() => onSelect(item)} aria-label="Visualizar">
                <FlowIcon name="eye" size={16} />
              </button>
              <button onClick={() => onDelete(item.id)} aria-label="Excluir">
                <FlowIcon name="trash" size={16} />
              </button>
            </div>
          </article>
        ))
      )}
    </section>
  );
}
