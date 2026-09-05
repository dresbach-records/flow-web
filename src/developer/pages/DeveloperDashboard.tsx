// FLOW — DeveloperDashboard (métricas reais: backend /meta + Firebase + contagens).
import React, { useCallback, useEffect, useState } from 'react';
import { apiRequest, getApiBaseUrl } from '../../services/api/client';
import { firebaseDiagnostics } from '../../services/firebase/config';
import { listDocuments } from '../../services/firebase/firestore';
import frontendPkg from '../../../package.json';

interface Meta {
  service: string;
  version: string;
  guardian: string;
  project: string;
  time: string;
  routes: Array<{ method: string; path: string }>;
}

export default function DeveloperDashboard() {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [counts, setCounts] = useState({ users: 0, posts: 0, communities: 0, reports: 0 });
  const [countsError, setCountsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    setMetaError(null);
    setCountsError(null);
    try {
      const data = await apiRequest<Meta>({ path: '/api/v1/meta' });
      setMeta(data);
    } catch (err) {
      setMetaError(err instanceof Error ? err.message : 'Backend inacessível.');
    }
    try {
      const [users, posts, communities, reports] = await Promise.all([
        listDocuments('users', { max: 1000 }).catch(() => []),
        listDocuments('posts', { max: 1000 }).catch(() => []),
        listDocuments('communities', { max: 1000 }).catch(() => []),
        listDocuments('reports', { field: 'status', value: 'OPEN', max: 1000 }).catch(() => []),
      ]);
      setCounts({ users: users.length, posts: posts.length, communities: communities.length, reports: reports.length });
    } catch {
      setCountsError('Falha ao contar coleções.');
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
        <h1>Dashboard do Desenvolvedor</h1>
        <p>Saúde real da plataforma. Sem métricas fictícias.</p>
      </div>

      {loading && <p className="dev-note">Carregando…</p>}

      <div className="dev-grid">
        <div className="dev-card">
          <h3>Backend</h3>
          {metaError ? (
            <p className="dev-error">{metaError}</p>
          ) : (
            <>
              <div className="dev-value">{meta?.service ?? '…'} <span className="dev-pill ok">OK</span></div>
              <div className="dev-sub">v{meta?.version} · guardian {meta?.guardian} · {meta?.project}</div>
            </>
          )}
        </div>
        <div className="dev-card">
          <h3>Frontend</h3>
          <div className="dev-value">{frontendPkg.name} v{frontendPkg.version}</div>
          <div className="dev-sub">React {frontendPkg.dependencies.react} · Firebase {frontendPkg.dependencies.firebase}</div>
        </div>
        <div className="dev-card">
          <h3>Firebase Auth</h3>
          <div className="dev-value">
            <span className={`dev-pill ${firebaseDiagnostics.apiKeyConfigured ? 'ok' : 'fail'}`}>
              {firebaseDiagnostics.apiKeyConfigured ? 'Configurado' : 'Ausente'}
            </span>
          </div>
          <div className="dev-sub">apiKey · projectId · appId via diagnostics reais</div>
        </div>
        <div className="dev-card">
          <h3>API base</h3>
          <div className="dev-value" style={{ fontSize: 14, wordBreak: 'break-all' }}>{getApiBaseUrl() || '(não configurada)'}</div>
          <div className="dev-sub">VITE_API_BASE_URL canônica</div>
        </div>
        <div className="dev-card">
          <h3>Usuários / Posts</h3>
          {countsError ? <p className="dev-error">{countsError}</p> : <div className="dev-value">{counts.users} / {counts.posts}</div>}
          <div className="dev-sub">Contagens reais do Firestore</div>
        </div>
        <div className="dev-card">
          <h3>Comunidades / Denúncias</h3>
          {countsError ? <p className="dev-error">{countsError}</p> : <div className="dev-value">{counts.communities} / {counts.reports}</div>}
          <div className="dev-sub">Denúncias = OPEN reais</div>
        </div>
      </div>

      <div className="dev-card">
        <h3>Rotas reais do backend (/api/v1/meta)</h3>
        {metaError ? (
          <p className="dev-error">{metaError}</p>
        ) : (
          <table className="dev-table">
            <thead><tr><th>Método</th><th>Rota</th></tr></thead>
            <tbody>
              {(meta?.routes ?? []).map((r) => (
                <tr key={`${r.method} ${r.path}`}><td><code>{r.method}</code></td><td><code>{r.path}</code></td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="dev-note" style={{ marginTop: 12 }}>
        Filas, webhooks, OpenTelemetry e deploys: sem backend na arquitetura atual — PENDENTE (sem telas fictícias).
      </p>
    </div>
  );
}
