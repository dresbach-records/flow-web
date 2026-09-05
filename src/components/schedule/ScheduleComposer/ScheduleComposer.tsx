import { useState } from 'react';
import { FlowIcon } from '../../../assets/flowAssets';
import { createSchedule } from '../../../services/firebase/scheduling';
import type { ScheduleComposerProps } from './ScheduleComposer.types';
import './ScheduleComposer.css';

const inputDate = (date: Date) => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
};

export default function ScheduleComposer({ onClose, onCreated }: ScheduleComposerProps) {
  const [text, setText] = useState('');
  const [date, setDate] = useState(inputDate(new Date(Date.now() + 86_400_000)));
  const [time, setTime] = useState('09:00');
  const [status, setStatus] = useState<'DRAFT' | 'SCHEDULED'>('SCHEDULED');
  const [error, setError] = useState('');

  const submit = async () => {
    try {
      const scheduledAt = new Date(`${date}T${time}:00`);
      if (scheduledAt <= new Date()) throw new Error('Escolha uma data e horário futuros.');
      await createSchedule({ profileId: 'self', text, type: 'text', scheduledAt, timezone: 'America/Sao_Paulo', status });
      onCreated();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível agendar.');
    }
  };

  return (
    <div className="flow-schedule-overlay">
      <button className="flow-schedule-backdrop" onClick={onClose} aria-label="Fechar criação" />
      <section className="flow-schedule-composer">
        <header>
          <h2>Criar publicação</h2>
          <button onClick={onClose} aria-label="Fechar">
            <FlowIcon name="close" size={18} />
          </button>
        </header>
        <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Escreva o conteúdo da publicação" />
        <div className="flow-schedule-fields">
          <label>
            Data
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <label>
            Hora
            <input type="time" value={time} onChange={(event) => setTime(event.target.value)} />
          </label>
          <label>
            Fuso
            <select value="America/Sao_Paulo" disabled>
              <option>America/Sao_Paulo</option>
            </select>
          </label>
        </div>
        {error && (
          <p className="flow-schedule-error" role="alert">
            {error}
          </p>
        )}
        <footer>
          <button
            onClick={() => {
              setStatus('DRAFT');
              void submit();
            }}
          >
            Salvar rascunho
          </button>
          <button
            className="primary"
            onClick={() => {
              setStatus('SCHEDULED');
              void submit();
            }}
          >
            Agendar publicação
          </button>
        </footer>
      </section>
    </div>
  );
}
