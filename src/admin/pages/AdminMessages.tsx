// FLOW — AdminMessages (moderação de conversas, dados reais).
// Lista/audita conversas (regra: list/leitura admin). Sem envio em nome de
// usuários; sem exclusão (regras não permitem).
import React, { useCallback, useEffect, useState } from 'react';
import { MessageSquare, Search } from 'lucide-react';
import { listDocuments } from '../../services/firebase/firestore';
import { listMessages, type ChatMessage, type Conversation } from '../../services/firebase/messages';

export const AdminMessages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const items = await listDocuments<Record<string, unknown>>('conversations', { max: 100 });
      const convs: Conversation[] = items.map((d) => ({
        id: d.id,
        participantIds: Array.isArray(d.participantIds)
          ? (d.participantIds as unknown[]).filter((v): v is string => typeof v === 'string')
          : [],
        name: typeof d.name === 'string' && d.name ? d.name : 'Conversa',
        handle: typeof d.handle === 'string' ? d.handle : '',
        avatar: typeof d.avatar === 'string' && d.avatar ? d.avatar : '/logo.png',
        online: false,
        lastMessage: typeof d.lastMessage === 'string' ? d.lastMessage : '',
      }));
      setConversations(convs);
      setActiveId((prev) => (convs.some((c) => c.id === prev) ? prev : (convs[0]?.id ?? '')));
    } catch {
      setLoadError('Não foi possível carregar as conversas. Conta sem permissão ou sem conexão.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    void listMessages(activeId)
      .then((items) => {
        if (!cancelled) setMessages(items);
      })
      .catch(() => {
        if (!cancelled) setMessages([]);
      });
    return () => {
      cancelled = true;
    };
  }, [activeId]);

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.id.includes(search),
  );

  return (
    <div>
      <div className="greeting-section">
        <h1 className="greeting-title">
          <MessageSquare size={24} color="#6366f1" />
          <span>Moderação de Mensagens</span>
        </h1>
        <p className="greeting-subtitle">Auditoria somente-leitura das conversas da plataforma.</p>
      </div>

      {loading && <p style={{ color: '#64748b', fontSize: 13 }}>Carregando conversas…</p>}
      {!loading && loadError && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', color: '#b91c1c', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
          {loadError} <button type="button" onClick={() => reload()} style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}>Tentar novamente</button>
        </div>
      )}

      {!loading && !loadError && conversations.length === 0 && (
        <p style={{ color: '#64748b', fontSize: 13 }}>Nenhuma conversa registrada.</p>
      )}

      {!loading && !loadError && conversations.length > 0 && (
        <div className="admin-table-container">
          <div className="admin-table-toolbar">
            <div className="topbar-search-wrapper" style={{ width: '360px' }}>
              <Search className="topbar-search-icon" />
              <input
                type="text"
                className="topbar-search-input"
                placeholder="Buscar conversa por nome ou ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select className="admin-select" value={activeId} onChange={(e) => setActiveId(e.target.value)}>
              {filtered.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
              ))}
            </select>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Remetente</th>
                <th>Mensagem</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 && (
                <tr>
                  <td colSpan={2} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    Nenhuma mensagem nesta conversa.
                  </td>
                </tr>
              )}
              {messages.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontSize: '12px', color: '#475569' }}>{m.senderId}</td>
                  <td style={{ color: '#0f172a' }}>{m.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
