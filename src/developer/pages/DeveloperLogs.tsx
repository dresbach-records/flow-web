// FLOW — DeveloperLogs (auditoria real da plataforma).
import React, { useCallback, useEffect, useState } from 'react';
import { listAuditEntries, type AuditEntry } from '../../services/firebase/audit';

export default function DeveloperLogs() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setEntries(await listAuditEntries(100));
    } catch {
      setError('Não foi possível carregar a auditoria.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return (
    <div>
      <div className="dev-head">
        <h1>Logs & Auditoria</h1>
        <p>Eventos reais de <code>admin_audit</code>. Erros de runtime do backend: <code>GET /api/v1/meta</code> e <code>/health</code>.</p>
      </div>

      {loading && <p className="dev-note">Carregando…</p>}
      {error && <p className="dev-error">{error} <button type="button" className="dev-btn secondary" onClick={() => reload()}>Tentar novamente</button></p>}

      {!loading && !error && entries.length === 0 && (
        <div className="dev-card"><h3>Vazio</h3><p className="dev-note">Nenhuma ação auditada ainda.</p></div>
      )}

      {!loading && !error && entries.length > 0 && (
        <table className="dev-table">
          <thead><tr><th>Operador</th><th>Ação</th><th>Alvo</th></tr></thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id}>
                <td style={{ fontSize: 12 }}>{e.adminEmail || e.adminUid}</td>
                <td><code>{e.action}</code></td>
                <td style={{ fontSize: 12 }}>{e.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
