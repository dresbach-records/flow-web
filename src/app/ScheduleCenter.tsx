// FLOW — ScheduleCenter (FASE 3).
// Página orquestradora: monta ScheduleCalendar/ScheduleList/ScheduleDetails/
// ScheduleComposer e conecta dados via useSchedules. Antes: 49 linhas densas
// com 3 componentes internos. Depois: composição, mesmo Firebase e mesma UI.
import { useMemo, useState } from 'react';
import { FlowIcon } from '../assets/flowAssets';
import { useAppContext } from '../contexts/AppContext';
import LoadingState from '../components/ui/LoadingState';
import ScheduleCalendar from '../components/schedule/ScheduleCalendar';
import ScheduleComposer from '../components/schedule/ScheduleComposer';
import ScheduleDetails from '../components/schedule/ScheduleDetails';
import ScheduleList from '../components/schedule/ScheduleList';
import { statusLabels, type ScheduleFilter, type ScheduleView } from '../components/schedule/types';
import { useSchedules, type ScheduledPost } from '../hooks/useSchedules';
import { deleteSchedule } from '../services/firebase/scheduling';
import './schedule-center.css';

export default function ScheduleCenter() {
  const { user, loading } = useAppContext();
  const { items, error, setError, reload } = useSchedules(user?.uid);
  const [view, setView] = useState<ScheduleView>('month');
  const [filter, setFilter] = useState<ScheduleFilter>('ALL');
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selected, setSelected] = useState<ScheduledPost | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);

  const filtered = items.filter((item) => filter === 'ALL' || item.status === filter);
  const monthDays = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    return Array.from({ length: 42 }, (_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index));
  }, [month]);
  const forDay = (day: Date) => filtered.filter((item) => item.scheduledAt.toDateString() === day.toDateString());

  const mutate = async (action: () => Promise<void>) => {
    try {
      setError('');
      await action();
      setSelected(null);
      await reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível atualizar o agendamento.');
    }
  };

  if (loading || !user) return <LoadingState message="Carregando agendamentos…" />;

  return (
    <div className="flow-schedule-page">
      <div className="flow-schedule-head">
        <div>
          <span>Conteúdo</span>
          <h1>Agendamentos</h1>
          <p>Organize suas publicações em um só lugar.</p>
        </div>
        <button className="flow-schedule-create" onClick={() => setComposerOpen(true)}>
          <FlowIcon name="plus" size={17} /> Criar publicação
        </button>
      </div>
      <div className="flow-schedule-layout">
        <main className="flow-schedule-main">
          <div className="flow-schedule-toolbar">
            <div className="flow-schedule-profile">
              <span className="flow-schedule-avatar">{user.displayName?.[0]?.toUpperCase() || 'U'}</span>
              <span>
                <strong>{user.displayName || 'Seu perfil'}</strong>
                <small>{user.email}</small>
              </span>
            </div>
            <div className="flow-schedule-actions">
              <button onClick={() => setView('list')} className={view === 'list' ? 'active' : ''}>
                Lista
              </button>
              <button onClick={() => setView('month')} className={view === 'month' ? 'active' : ''}>
                Mês
              </button>
              <select
                aria-label="Filtrar status"
                value={filter}
                onChange={(event) => setFilter(event.target.value as ScheduleFilter)}
              >
                <option value="ALL">Todos os status</option>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {error && (
            <p className="flow-schedule-error" role="alert">
              {error}
            </p>
          )}
          {view === 'month' ? (
            <ScheduleCalendar
              month={month}
              monthDays={monthDays}
              forDay={forDay}
              onPrevMonth={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
              onToday={() => setMonth(new Date())}
              onNextMonth={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
              onSelect={setSelected}
            />
          ) : (
            <ScheduleList
              items={filtered}
              onSelect={setSelected}
              onDelete={(id) => void mutate(() => deleteSchedule(id))}
            />
          )}
        </main>
      </div>
      {selected && <ScheduleDetails item={selected} onClose={() => setSelected(null)} onUpdate={(action) => void mutate(action)} />}
      {composerOpen && (
        <ScheduleComposer
          onClose={() => setComposerOpen(false)}
          onCreated={() => {
            setComposerOpen(false);
            void reload();
          }}
        />
      )}
    </div>
  );
}
