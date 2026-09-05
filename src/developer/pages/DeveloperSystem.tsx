// FLOW — DeveloperSystem (Firebase real + ambientes reais sem segredos).
import React, { useCallback, useEffect, useState } from 'react';
import { firebaseDiagnostics, requireFirebaseStorage } from '../../services/firebase/config';
import { listDocuments } from '../../services/firebase/firestore';

const ENVS = ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_AUTH_DOMAIN', 'VITE_FIREBASE_PROJECT_ID', 'VITE_FIREBASE_STORAGE_BUCKET', 'VITE_FIREBASE_MESSAGING_SENDER_ID', 'VITE_FIREBASE_APP_ID', 'VITE_API_BASE_URL'] as const;

const COLLECTIONS = ['users', 'posts', 'communities', 'reports', 'memorial_requests', 'tributes', 'conversations', 'stories', 'admin_audit', 'platform_settings', 'site_pages', 'appeals', 'newsletter'] as const;

export default function DeveloperSystem({ environmentsOnly = false }: { environmentsOnly?: boolean }) {
  const [reach, setReach] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [storageOk, setStorageOk] = useState<boolean | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      requireFirebaseStorage();
      setStorageOk(true);
    } catch {
      setStorageOk(false);
    }
    const out: Record<string, boolean> = {};
    await Promise.all(
      COLLECTIONS.map(async (col) => {
        try {
          await listDocuments(col, { max: 1 });
          out[col] = true;
        } catch {
          out[col] = false;
        }
      }),
    );
    setReach(out);
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return (
    <div>
      <div className="dev-head">
        <h1>{environmentsOnly ? 'Ambientes' : 'Firebase & Sistema'}</h1>
        <p>Diagnóstico real. Nenhum segredo é exibido — apenas presença/alcance.</p>
      </div>

      {!environmentsOnly && (
        <div className="dev-grid">
          <div className="dev-card">
            <h3>Auth</h3>
            <div className="dev-value">
              <span className={`dev-pill ${firebaseDiagnostics.apiKeyConfigured ? 'ok' : 'fail'}`}>
                {firebaseDiagnostics.apiKeyConfigured ? 'apiKey OK' : 'apiKey ausente'}
              </span>
            </div>
            <div className="dev-sub">projectId {firebaseDiagnostics.projectIdConfigured ? 'OK' : 'ausente'} · appId {firebaseDiagnostics.appIdConfigured ? 'OK' : 'ausente'}</div>
          </div>
          <div className="dev-card">
            <h3>Storage</h3>
            <div className="dev-value">
              <span className={`dev-pill ${storageOk ? 'ok' : 'fail'}`}>{storageOk === null ? '…' : storageOk ? 'Inicializado' : 'Indisponível'}</span>
            </div>
            <div className="dev-sub">Inicialização real do bucket</div>
          </div>
          <div className="dev-card">
            <h3>Firestore (rules aplicadas)</h3>
            <div className="dev-value">{Object.values(reach).filter(Boolean).length}/{COLLECTIONS.length}</div>
            <div className="dev-sub">Coleções legíveis pela sessão atual</div>
          </div>
        </div>
      )}

      {loading && <p className="dev-note">Verificando…</p>}

      {!environmentsOnly && !loading && (
        <div className="dev-card" style={{ marginBottom: 16 }}>
          <h3>Alcance por coleção (sessão admin atual)</h3>
          <table className="dev-table">
            <thead><tr><th>Coleção</th><th>Leitura</th></tr></thead>
            <tbody>
              {COLLECTIONS.map((col) => (
                <tr key={col}>
                  <td><code>{col}</code></td>
                  <td><span className={`dev-pill ${reach[col] ? 'ok' : 'fail'}`}>{reach[col] ? 'OK' : 'Negada/erro'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="dev-card">
        <h3>Variáveis de ambiente (só presença)</h3>
        <table className="dev-table">
          <thead><tr><th>Variável</th><th>Status</th></tr></thead>
          <tbody>
            {ENVS.map((key) => {
              const present = Boolean((import.meta.env[key] as string | undefined) ?? '');
              return (
                <tr key={key}>
                  <td><code>{key}</code></td>
                  <td><span className={`dev-pill ${present ? 'ok' : 'fail'}`}>{present ? 'Configurada' : 'Ausente'}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
