// FLOW — DeveloperDocs (documentação viva: endpoints reais + matriz de permissões real).
import React, { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '../../services/api/client';

interface Meta {
  routes: Array<{ method: string; path: string }>;
  version: string;
  guardian: string;
}

const PERMISSIONS: Array<[string, string]> = [
  ['developer.dashboard.view', 'papel admin — leitura de /meta, diagnósticos, contagens'],
  ['developer.api.test', 'papel admin — execução contra a base configurada, com ID token'],
  ['developer.firebase.view', 'papel admin — diagnósticos e alcance por coleção (rules aplicadas)'],
  ['developer.audit.view', 'papel admin — leitura de admin_audit'],
  ['developer.environment.view', 'papel admin — presença de envs (sem valores)'],
  ['moderator', 'sem acesso ao Developer (negado com mensagem honesta)'],
];

export default function DeveloperDocs() {
  const [meta, setMeta] = useState<Meta | null>(null);

  const load = useCallback(async () => {
    try {
      setMeta(await apiRequest<Meta>({ path: '/api/v1/meta' }));
    } catch {
      setMeta(null);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <div className="dev-head">
        <h1>Documentação</h1>
        <p>Contrato vivo do backend{meta ? ` (v${meta.version} · guardian ${meta.guardian})` : ' (backend inacessível no momento)'}.</p>
      </div>

      <div className="dev-card" style={{ marginBottom: 16 }}>
        <h3>Endpoints (fonte: /api/v1/meta)</h3>
        {meta ? (
          <table className="dev-table">
            <thead><tr><th>Método</th><th>Rota</th></tr></thead>
            <tbody>
              {meta.routes.map((r) => (
                <tr key={`${r.method} ${r.path}`}><td><code>{r.method}</code></td><td><code>{r.path}</code></td></tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="dev-note">Backend inacessível — ver APls & Tester para o erro real.</p>
        )}
      </div>

      <div className="dev-card">
        <h3>Matriz de permissões implementada</h3>
        <table className="dev-table">
          <thead><tr><th>Permissão</th><th>Regra real</th></tr></thead>
          <tbody>
            {PERMISSIONS.map(([perm, rule]) => (
              <tr key={perm}><td><code>{perm}</code></td><td>{rule}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
