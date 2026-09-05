import { FlowIcon } from '../../../assets/flowAssets';
import { cancelSchedule, deleteSchedule, duplicateSchedule, publishScheduleNow } from '../../../services/firebase/scheduling';
import { formatDate, formatTime, statusLabels } from '../types';
import type { ScheduleDetailsProps } from './ScheduleDetails.types';
import './ScheduleDetails.css';

export default function ScheduleDetails({ item, onClose, onUpdate }: ScheduleDetailsProps) {
  return (
    <div className="flow-schedule-overlay">
      <button className="flow-schedule-backdrop" onClick={onClose} aria-label="Fechar detalhes" />
      <section className="flow-schedule-details">
        <header>
          <strong>Detalhes da publicação</strong>
          <button onClick={onClose} aria-label="Fechar">
            <FlowIcon name="close" size={18} />
          </button>
        </header>
        {item.mediaUrl && <img className="flow-schedule-detail-media" src={item.mediaUrl} alt="" />}
        <p>{item.text || 'Publicação sem texto'}</p>
        <div className="flow-schedule-detail-meta">
          <span>{formatDate(item.scheduledAt)}</span>
          <span>
            {formatTime(item.scheduledAt)} · {item.timezone}
          </span>
          <b className={item.status.toLowerCase()}>{statusLabels[item.status]}</b>
        </div>
        <footer>
          {item.status === 'SCHEDULED' && (
            <button onClick={() => onUpdate(() => publishScheduleNow(item.id))}>Publicar agora</button>
          )}
          {item.status === 'SCHEDULED' && (
            <button onClick={() => onUpdate(() => cancelSchedule(item.id))}>Cancelar</button>
          )}
          <button
            onClick={() =>
              onUpdate(async () => {
                await duplicateSchedule(item);
              })
            }
          >
            Duplicar
          </button>
          <button
            className="danger"
            onClick={() => {
              if (window.confirm('Excluir esta publicação?')) onUpdate(() => deleteSchedule(item.id));
            }}
          >
            Excluir
          </button>
        </footer>
      </section>
    </div>
  );
}
