import { FlowIcon } from '../../../assets/flowAssets';
import type { ScheduledPost } from '../../../hooks/useSchedules';
import { formatTime } from '../types';
import './ScheduleCalendar.css';

export interface ScheduleCalendarProps {
  month: Date;
  monthDays: Date[];
  forDay: (day: Date) => ScheduledPost[];
  onPrevMonth: () => void;
  onToday: () => void;
  onNextMonth: () => void;
  onSelect: (item: ScheduledPost) => void;
}

export default function ScheduleCalendar({
  month,
  monthDays,
  forDay,
  onPrevMonth,
  onToday,
  onNextMonth,
  onSelect,
}: ScheduleCalendarProps) {
  return (
    <>
      <div className="flow-calendar-head">
        <button onClick={onPrevMonth} aria-label="Mês anterior">
          <FlowIcon name="arrow-left" size={18} />
        </button>
        <button onClick={onToday}>Hoje</button>
        <h2>{new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(month)}</h2>
        <button onClick={onNextMonth} aria-label="Próximo mês">
          <FlowIcon name="arrow-right" size={18} />
        </button>
      </div>
      <div className="flow-calendar">
        <div className="flow-calendar-week">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <strong key={day}>{day}</strong>
          ))}
        </div>
        <div className="flow-calendar-grid">
          {monthDays.map((day) => (
            <div
              className={`flow-calendar-day ${day.getMonth() !== month.getMonth() ? 'muted' : ''}`}
              key={day.toISOString()}
            >
              <span>{day.getDate()}</span>
              {forDay(day)
                .slice(0, 3)
                .map((item) => (
                  <button key={item.id} onClick={() => onSelect(item)} className={`flow-calendar-item ${item.status.toLowerCase()}`}>
                    <small>{formatTime(item.scheduledAt)}</small>
                    {item.mediaUrl && <img src={item.mediaUrl} alt="" />}
                    <b>{item.text || 'Publicação sem texto'}</b>
                  </button>
                ))}
              {forDay(day).length > 3 && <small className="flow-more">+{forDay(day).length - 3} publicações</small>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
