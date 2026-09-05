// FLOW — AdminNotifications (visibilidade de notificações, dados reais).
// Leitura agregada via collectionGroup (regra: leitura admin). Sem disparo em
// massa (exige backend de fan-out — Fase 9).
import React, { useCallback, useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { collectionGroup, getDocs, limit, query } from 'firebase/firestore';
import { requireFirestore } from '../../services/firebase/config';

interface AdminNotification {
  id: string;
  owner: string;
  type: string;
  actorName: string;
  text: string;
  read: boolean;
}

export const AdminNotifications: React.FC = () => {
  const [items, setItems] = useState<AdminNotification[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const db = requireFirestore();
      const snapshot = await getDocs(query(collectionGroup(db, 'notifications'), limit(100)));
      const rows: AdminNotification[] = snapshot.docs.map((d) => {
        const data = d.data() as Record<string, unknown>;
        return {
          id: d.id,
          owner: d.ref.parent.parent?.id ?? '—',
          type: typeof data.type === 'string' ? data.type : 'system',
          actorName: typeof data.actorName === 'string' ? data.actorName : '—',
          text: typeof data.text === 'string' ? data.text : '',
          read: data.read === true,
        };
      });
      setItems(rows);
    } catch {
      setLoadError('Não foi possível carregar as notificações. Conta sem permissão ou índice ausente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const filtered = items.filter((i) => filter === 'all' || i.type === filter);

  return (
    <div>
      <div className="greeting-section">
        <h1 className="greeting-title">
          <Bell size={24} color="#6366f1" />
          <span>Notificações da Plataforma</span>
        </h1>
        <p className="greeting-subtitle">
          Visibilidade somente-leitura. Disparo em massa exige backend de fan-out (Fase 9).
        </p>
      </div>

      {loading && <p style={{ color: '#64748b', fontSize: 13 }}>Carregando notificações…</p>}
      {!loading && loadError && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', color: '#b91c1c', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
          {loadError} <button type="button" onClick={() => reload()} style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}>Tentar novamente</button>
        </div>
      )}

      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <select className="admin-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Todos os tipos</option>
            <option value="like">Curtidas</option>
            <option value="comment">Comentários</option>
            <option value="follow">Seguidores</option>
            <option value="system">Sistema</option>
          </select>
          <span style={{ fontSize: 12, color: '#64748b' }}>{filtered.length} registros (últimos 100)</span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Destinatário</th>
              <th>Tipo</th>
              <th>Conteúdo</th>
              <th>Lida</th>
            </tr>
          </thead>
          <tbody>
            {!loading && !loadError && filtered.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                  Nenhuma notificação encontrada.
                </td>
              </tr>
            )}
            {filtered.map((n, i) => (
              <tr key={`${n.owner}-${n.id}-${i}`}>
                <td style={{ fontSize: '12px' }}>{n.owner}</td>
                <td>{n.type}</td>
                <td><strong>{n.actorName}</strong> {n.text}</td>
                <td>{n.read ? 'Sim' : 'Não'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
