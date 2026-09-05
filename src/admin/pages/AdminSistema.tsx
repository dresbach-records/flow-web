// FLOW — AdminSistema (status real da plataforma).
// Backend /health, diagnósticos Firebase, presença de envs (só presença, nunca
// valores) e alcance das coleções principais. Sem "operacional" fictício.
import React, { useCallback, useEffect, useState } from 'react';
import { Server, RefreshCw } from 'lucide-react';
import { getApiBaseUrl } from '../../services/api/client';
import { firebaseDiagnostics } from '../../services/firebase/config';
import { listDocuments } from '../../services/firebase/firestore';

interface Check {
  name: string;
  detail: string;
  ok: boolean | null;
}

const ENVS = ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_AUTH_DOMAIN', 'VITE_FIREBASE_PROJECT_ID', 'VITE_FIREBASE_STORAGE_BUCKET', 'VITE_FIREBASE_MESSAGING_SENDER_ID', 'VITE_FIREBASE_APP_ID', 'VITE_API_BASE_URL'] as const;

export const AdminSistema: React.FC = () => {
  const [checks, setChecks] = useState<Check[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const out: Check[] = [];

    // Backend /health (real).
    const base = getApiBaseUrl();
    if (!base) {
      out.push({ name: 'API Backend', detail: 'VITE_API_BASE_URL ausente', ok: false });
    } else {
      try {
        const root = base.replace(/\/api\/v1\/?$/, '');
        const res = await fetch(`${root}/health`, { signal: AbortSignal.timeout(8000) });
        const body = (await res.json().catch(() => ({}))) as { guardian?: string };
        out.push({
          name: 'API Backend',
          detail: res.ok ? `HTTP ${res.status}${body.guardian ? ` · guardian ${body.guardian}` : ''}` : `HTTP ${res.status}`,
          ok: res.ok,
        });
      } catch {
        out.push({ name: 'API Backend', detail: 'Inacessível (timeout/ rede)', ok: false });
      }
    }

    // Firebase diagnostics (reais).
    out.push({ name: 'Firebase Auth (config)', detail: firebaseDiagnostics.apiKeyConfigured ? 'apiKey presente' : 'apiKey ausente', ok: firebaseDiagnostics.apiKeyConfigured });
    out.push({ name: 'Firebase Project', detail: firebaseDiagnostics.projectIdConfigured ? 'projectId presente' : 'projectId ausente', ok: firebaseDiagnostics.projectIdConfigured });
    out.push({ name: 'Firebase App', detail: firebaseDiagnostics.appIdConfigured ? 'appId presente' : 'appId ausente', ok: firebaseDiagnostics.appIdConfigured });

    // Envs (só presença).
    ENVS.forEach((key) => {
      const present = Boolean((import.meta.env[key] as string | undefined) ?? '');
      out.push({ name: `env ${key}`, detail: present ? 'configurada' : 'ausente', ok: present });
    });

    // Coleções (leitura real, 1 doc).
    const collections = ['users', 'posts', 'communities', 'reports', 'memorial_requests', 'admin_audit'] as const;
    await Promise.all(
      collections.map(async (col) => {
        try {
          await listDocuments(col, { max: 1 });
          out.push({ name: `Firestore ${col}`, detail: 'leitura OK', ok: true });
        } catch {
          out.push({ name: `Firestore ${col}`, detail: 'leitura negada/falhou', ok: false });
        }
      }),
    );

    setChecks(out);
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return (
    <div>
      <div className="greeting-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="greeting-title">
            <Server size={24} color="#6366f1" />
            <span>Sistema</span>
          </h1>
          <p className="greeting-subtitle">Saúde real dos serviços. Nenhum valor sensível é exibido.</p>
        </div>
        <button type="button" className="admin-action-btn" onClick={() => reload()} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={14} />
          <span>Verificar novamente</span>
        </button>
      </div>

      {loading && <p style={{ color: '#64748b', fontSize: 13 }}>Verificando serviços…</p>}

      {!loading && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Detalhe</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {checks.map((c) => (
                <tr key={c.name}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td style={{ fontSize: '12.5px', color: '#64748b' }}>{c.detail}</td>
                  <td>
                    <span className={`badge-tag ${c.ok ? 'novo' : 'alta'}`}>
                      {c.ok ? 'OK' : 'Falha'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
