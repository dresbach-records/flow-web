// FLOW — SiteEditor (MODO REAL).
// Blocos por página persistem em `site_pages/{page}` (leitura pública, escrita
// só admin). Publicar grava blocos + timestamp real. Pré-visualizar abre a rota
// real em nova aba. Vinculação viva com a Home: Fase 9.
import React, { useCallback, useEffect, useState } from 'react';
import { Eye, Save, Plus, Trash2, ChevronUp, ChevronDown, Globe2 } from 'lucide-react';
import { getDocument, upsertDocument } from '../services/firebase/firestore';
import { logAdminAction } from '../services/firebase/audit';
import './site-editor.css';

type Block = { id: string; type: string; title: string; body: string };

const PAGES = ['/', '/for-you', '/explorar', '/recursos', '/criadores', '/comunidades', '/seguranca', '/empresa', '/sobre', '/carreiras', '/imprensa', '/blog', '/contato', '/parcerias', '/marcas', '/media-kit', '/ajuda', '/acessibilidade'];

const defaults: Block[] = [
  { id: 'hero', type: 'Hero', title: 'Seu mundo. Em movimento.', body: 'Apresentação principal do FLOW.' },
  { id: 'features', type: 'Recursos', title: 'Uma plataforma. Todo o seu universo.', body: 'For You, Shorts, Stories, Live, Comunidades e muito mais.' },
  { id: 'cta', type: 'CTA', title: 'Entre no FLOW', body: 'Crie sua conta e descubra a plataforma.' },
];

function pageDocId(page: string): string {
  return page === '/' ? 'home' : page.replace(/^\//, '').replace(/\//g, '_');
}

export default function SiteEditor() {
  const [page, setPage] = useState('/');
  const [blocks, setBlocks] = useState<Block[]>(defaults);
  const [status, setStatus] = useState('Nenhuma versão salva ainda.');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (target: string) => {
    setLoading(true);
    setError(null);
    try {
      const doc = await getDocument<{ blocks?: Block[]; publishedAt?: unknown }>('site_pages', pageDocId(target));
      if (doc?.blocks && Array.isArray(doc.blocks) && doc.blocks.length > 0) {
        setBlocks(doc.blocks.filter((b) => b && typeof b.id === 'string'));
        setStatus('Versão salva carregada. Edite e publique para atualizar.');
      } else {
        setBlocks(defaults);
        setStatus('Nenhuma versão salva ainda.');
      }
    } catch {
      setBlocks(defaults);
      setStatus('Nenhuma versão salva ainda.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(page);
  }, [page, load]);

  const add = () => setBlocks((b) => [...b, { id: crypto.randomUUID(), type: 'Seção', title: 'Nova seção', body: 'Edite este conteúdo.' }]);
  const move = (i: number, d: number) => setBlocks((b) => {
    const n = [...b];
    const j = i + d;
    if (j < 0 || j >= n.length) return n;
    [n[i], n[j]] = [n[j], n[i]];
    return n;
  });
  const update = (i: number, key: keyof Block, v: string) =>
    setBlocks((b) => b.map((x, k) => (k === i ? { ...x, [key]: v } : x)));

  const publish = () => {
    setError(null);
    setSaving(true);
    const payload = { blocks, page, publishedAt: new Date().toISOString() };
    void upsertDocument('site_pages', pageDocId(page), payload)
      .then(() => {
        setStatus(`Publicado em ${new Date().toLocaleString('pt-BR')}.`);
        void logAdminAction('PUBLISH_SITE_PAGE', `Site ${page}`);
      })
      .catch(() => setError('Falha ao publicar. Verifique a permissão administrativa.'))
      .finally(() => setSaving(false));
  };

  const preview = () => {
    window.open(page, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="site-editor">
      <header>
        <div>
          <span>FLOW CONTROL CENTER / SITE</span>
          <h1>Editor do site</h1>
          <p>Blocos persistidos por página. A vinculação viva com a Home chega na Fase 9.</p>
        </div>
        <div className="se-actions">
          <button onClick={preview}><Eye />Pré-visualizar</button>
          <button className="primary" onClick={publish} disabled={saving || loading}>
            <Save />{saving ? 'Publicando…' : 'Publicar'}
          </button>
        </div>
      </header>
      {error && (
        <p role="alert" style={{ color: '#B91C1C', fontSize: 13 }}>{error}</p>
      )}
      <div className="se-layout">
        <aside>
          <label>PÁGINA</label>
          <select value={page} onChange={(e) => setPage(e.target.value)}>
            {PAGES.map((x) => <option key={x}>{x}</option>)}
          </select>
          <div className="se-info"><Globe2 /><b>Publicação</b><span>{loading ? 'Carregando…' : status}</span></div>
        </aside>
        <main>
          <div className="se-toolbar"><b>{page}</b><button onClick={add}><Plus />Adicionar seção</button></div>
          {blocks.map((b, i) => (
            <article className="se-block" key={b.id}>
              <div className="se-block-top">
                <span>{b.type}</span>
                <div>
                  <button onClick={() => move(i, -1)}><ChevronUp /></button>
                  <button onClick={() => move(i, 1)}><ChevronDown /></button>
                  <button onClick={() => setBlocks((x) => x.filter((y) => y.id !== b.id))}><Trash2 /></button>
                </div>
              </div>
              <input value={b.title} onChange={(e) => update(i, 'title', e.target.value)} />
              <textarea value={b.body} onChange={(e) => update(i, 'body', e.target.value)} />
            </article>
          ))}
        </main>
      </div>
    </div>
  );
}
