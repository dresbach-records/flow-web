// FLOW — DeveloperApis (explorador + tester real de endpoints).
// Toda chamada vai ao backend configurado, com ID token Firebase quando logado.
// Bloqueia URLs absolutas externas (somente base configurada + /health).
import React, { useCallback, useEffect, useState } from 'react';
import { apiRequest, getApiBaseUrl } from '../../services/api/client';
import { requireFirebaseAuth } from '../../services/firebase/config';

interface Meta {
  routes: Array<{ method: string; path: string }>;
}

type TesterResult = {
  status: number | null;
  statusText: string;
  headers: Array<[string, string]>;
  body: string;
  ms: number;
  bytes: number;
  error: string | null;
} | null;

async function idToken(): Promise<string | null> {
  try {
    const auth = requireFirebaseAuth();
    return (await auth.currentUser?.getIdToken()) ?? null;
  } catch {
    return null;
  }
}

export default function DeveloperApis() {
  const [routes, setRoutes] = useState<Array<{ method: string; path: string }>>([]);
  const [routesError, setRoutesError] = useState<string | null>(null);
  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState('/api/v1/meta');
  const [body, setBody] = useState('{\n  \n}');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<TesterResult>(null);

  const reload = useCallback(async () => {
    try {
      const meta = await apiRequest<Meta>({ path: '/api/v1/meta' });
      setRoutes(meta.routes ?? []);
      setRoutesError(null);
    } catch (err) {
      setRoutesError(err instanceof Error ? err.message : 'Backend inacessível.');
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const send = () => {
    const base = getApiBaseUrl();
    if (!base) {
      setResult({ status: null, statusText: '', headers: [], body: '', ms: 0, bytes: 0, error: 'VITE_API_BASE_URL não configurada.' });
      return;
    }
    if (!path.startsWith('/')) {
      setResult({ status: null, statusText: '', headers: [], body: '', ms: 0, bytes: 0, error: 'Use caminho relativo (ex.: /api/v1/meta). URLs externas bloqueadas.' });
      return;
    }
    let parsedBody: unknown;
    if (method !== 'GET' && body.trim()) {
      try {
        parsedBody = JSON.parse(body) as unknown;
      } catch {
        setResult({ status: null, statusText: '', headers: [], body: '', ms: 0, bytes: 0, error: 'Body JSON inválido.' });
        return;
      }
    }
    setSending(true);
    setResult(null);
    const started = performance.now();
    void (async () => {
      try {
        const token = await idToken();
        const response = await fetch(`${base}${path}`, {
          method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: parsedBody === undefined ? undefined : JSON.stringify(parsedBody),
        });
        const text = await response.text();
        const headers: Array<[string, string]> = [];
        response.headers.forEach((value, key) => headers.push([key, value]));
        setResult({
          status: response.status,
          statusText: response.statusText,
          headers,
          body: text,
          ms: Math.round(performance.now() - started),
          bytes: new Blob([text]).size,
          error: null,
        });
      } catch (err) {
        setResult({
          status: null, statusText: '', headers: [], body: '',
          ms: Math.round(performance.now() - started), bytes: 0,
          error: err instanceof Error ? err.message : 'Falha de rede.',
        });
      } finally {
        setSending(false);
      }
    })();
  };

  return (
    <div>
      <div className="dev-head">
        <h1>APIs & Tester</h1>
        <p>Contrato real do backend + execução real com autenticação Firebase.</p>
      </div>

      <div className="dev-card" style={{ marginBottom: 16 }}>
        <h3>Endpoints reais</h3>
        {routesError ? (
          <p className="dev-error">{routesError}</p>
        ) : (
          <table className="dev-table">
            <thead><tr><th>Método</th><th>Rota</th><th></th></tr></thead>
            <tbody>
              {routes.map((r) => (
                <tr key={`${r.method} ${r.path}`}>
                  <td><code>{r.method}</code></td>
                  <td><code>{r.path}</code></td>
                  <td>
                    <button
                      type="button"
                      className="dev-btn secondary"
                      onClick={() => { setMethod(r.method); setPath(r.path); }}
                    >
                      Usar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="dev-card">
        <h3>Tester</h3>
        <div className="dev-row">
          <select className="dev-select" value={method} onChange={(e) => setMethod(e.target.value)} aria-label="Método HTTP">
            {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => <option key={m}>{m}</option>)}
          </select>
          <input
            className="dev-input"
            style={{ flex: 1, minWidth: 220 }}
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/api/v1/meta"
            aria-label="Caminho da API"
          />
          <button type="button" className="dev-btn" disabled={sending} onClick={send}>
            {sending ? 'Enviando…' : 'Executar'}
          </button>
        </div>
        {method !== 'GET' && (
          <textarea className="dev-textarea" value={body} onChange={(e) => setBody(e.target.value)} aria-label="Corpo JSON" />
        )}
        {result && (
          <div style={{ marginTop: 12 }}>
            {result.error ? (
              <p className="dev-error">{result.error}</p>
            ) : (
              <>
                <p>
                  <code>HTTP {result.status} {result.statusText}</code>
                  {' · '}{result.ms} ms · {result.bytes} bytes
                </p>
                <pre className="dev-pre">{result.body}</pre>
              </>
            )}
          </div>
        )}
        <p className="dev-note">Operações de escrita exigem sessão Firebase; o backend valida e responde com erros reais.</p>
      </div>
    </div>
  );
}
