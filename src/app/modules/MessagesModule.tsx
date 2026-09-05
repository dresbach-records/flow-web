// FLOW — MessagesModule (FASE 1/3: sem mocks).
// Conversas e mensagens 100% Firestore (`conversations` + subcoleção `messages`).
import React, { useCallback, useEffect, useState } from 'react';
import { Send, Image, Smile, Phone, Video, MoreVertical, Search, CheckCheck } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import {
  listConversations,
  listMessages,
  markConversationRead,
  sendMessage,
  type ChatMessage,
  type Conversation,
} from '../../services/firebase/messages';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import LoadingState from '../../components/ui/LoadingState';

function tsMs(value: unknown): number {
  try {
    const ts = value as { toDate?: () => Date; toMillis?: () => number };
    if (ts && typeof ts.toMillis === 'function') return ts.toMillis();
    if (ts && typeof ts.toDate === 'function') return ts.toDate().getTime();
  } catch {
    /* sem data */
  }
  return 0;
}

function isUnread(chat: Conversation): boolean {
  return tsMs(chat.updatedAt) > (chat.readByMeAt ?? 0) && chat.lastMessage !== '';
}

function formatTime(createdAt: unknown): string {
  try {
    const ts = createdAt as { toDate?: () => Date };
    if (ts && typeof ts.toDate === 'function') {
      return ts.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
  } catch {
    /* sem data honesta: omite */
  }
  return '';
}

export default function MessagesModule({ initialConversationId = '' }: { initialConversationId?: string }) {
  const { user } = useAppContext();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string>(initialConversationId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const items = await listConversations();
      setConversations(items);
      setActiveId((prev) => (items.some((c) => c.id === prev) ? prev : (items[0]?.id ?? '')));
    } catch {
      setError('Não foi possível carregar as conversas. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    setMessagesLoading(true);
    void listMessages(activeId)
      .then((items) => {
        if (!cancelled) setMessages(items);
      })
      .catch(() => {
        if (!cancelled) setMessages([]);
      })
      .finally(() => {
        if (!cancelled) setMessagesLoading(false);
      });
    // Recibo real: abrir marca como lida (sem simulação local de "não lidas").
    void markConversationRead(activeId)
      .then(() => {
        if (cancelled) return;
        setConversations((prev) =>
          prev.map((c) => (c.id === activeId ? { ...c, readByMeAt: Date.now() } : c)),
        );
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [activeId]);

  const activeChat = conversations.find(c => c.id === activeId);

  const handleSend = () => {
    const text = inputVal.trim();
    if (!text || !activeId) return;
    setSendError(null);
    setInputVal('');
    // Persistência real; recarrega mensagens após confirmação (sem simulação local).
    void sendMessage(activeId, text)
      .then(() => listMessages(activeId))
      .then(setMessages)
      .then(() => reload())
      .catch(() => setSendError('Não foi possível enviar. Tente novamente.'));
  };

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.handle.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px 40px' }}>
        <LoadingState message="Carregando conversas…" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px 40px' }}>
        <ErrorState description={error} onRetry={() => reload()} />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px 40px' }}>
        <EmptyState
          title="Nenhuma conversa ainda"
          description="Suas conversas reais aparecem aqui. Nada é simulado."
        />
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: 1100,
      margin: '0 auto',
      padding: '20px 16px 40px',
      height: 'calc(100vh - 84px)',
      display: 'flex',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        width: '100%',
        background: '#FFFFFF',
        borderRadius: 16,
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(15,23,42,0.04)'
      }}>
        {/* Left List */}
        <div style={{
          borderRight: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          background: '#FFFFFF'
        }}>
          <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #F1F5F9' }}>
            <h2 style={{ margin: '0 0 12px 0', fontSize: 18, fontWeight: 800, color: '#0F172A' }}>Mensagens</h2>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 10 }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Pesquisar conversas..."
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 12px 0 36px',
                  borderRadius: 999,
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredConversations.map(chat => {
              const selected = chat.id === activeId;
              return (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => setActiveId(chat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: selected ? '#EFF6FF' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderLeft: selected ? '3px solid #2563EB' : '3px solid transparent',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    {chat.online && (
                      <span style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: '#10B981',
                        border: '2px solid #FFFFFF'
                      }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                      <strong style={{ fontSize: 14, color: '#0F172A', fontWeight: 700 }}>{chat.name}</strong>
                      {isUnread(chat) && (
                        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#2563EB' }} aria-label="Não lida" />
                      )}
                    </div>
                    <p style={{
                      margin: 0,
                      fontSize: 12.5,
                      color: selected ? '#2563EB' : '#64748B',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {chat.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Conversation */}
        {activeChat ? (
          <div style={{ display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
            {/* Header */}
            <div style={{
              padding: '12px 20px',
              background: '#FFFFFF',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <strong style={{ fontSize: 15, color: '#0F172A', fontWeight: 700, display: 'block', lineHeight: 1.2 }}>
                    {activeChat.name}
                  </strong>
                  <span style={{ fontSize: 12, color: activeChat.online ? '#10B981' : '#94A3B8', fontWeight: 500 }}>
                    {activeChat.online ? 'Online agora' : 'Offline'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button aria-label="Chamada de voz (em breve)" disabled title="Chamadas chegam na Fase 3" style={{ background: 'none', border: 'none', color: '#CBD5E1', padding: 8 }}>
                  <Phone size={18} />
                </button>
                <button aria-label="Chamada de vídeo (em breve)" disabled title="Chamadas chegam na Fase 3" style={{ background: 'none', border: 'none', color: '#CBD5E1', padding: 8 }}>
                  <Video size={18} />
                </button>
                <button aria-label="Opções da conversa" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: 8 }}>
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              {messagesLoading && <LoadingState message="Carregando mensagens…" />}
              {!messagesLoading && messages.length === 0 && (
                <p style={{ margin: 0, fontSize: 13, color: '#94A3B8', textAlign: 'center' }}>
                  Nenhuma mensagem nesta conversa ainda. Envie a primeira abaixo.
                </p>
              )}
              {!messagesLoading && messages.map(msg => {
                const isMe = msg.senderId === user?.uid;
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{
                      maxWidth: '68%',
                      padding: '10px 16px',
                      borderRadius: 16,
                      borderBottomRightRadius: isMe ? 4 : 16,
                      borderBottomLeftRadius: isMe ? 16 : 4,
                      background: isMe ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : '#FFFFFF',
                      color: isMe ? '#FFFFFF' : '#0F172A',
                      fontSize: 14,
                      lineHeight: 1.45,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                      border: isMe ? 'none' : '1px solid #E2E8F0'
                    }}>
                      {msg.text}
                    </div>
                    {formatTime(msg.createdAt) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                        <span style={{ fontSize: 10, color: '#94A3B8' }}>{formatTime(msg.createdAt)}</span>
                        {isMe && <CheckCheck size={12} color="#2563EB" />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {sendError && (
              <p role="alert" style={{ margin: '0 20px 4px 20px', fontSize: 12.5, color: '#DC2626' }}>{sendError}</p>
            )}

            {/* Input Bar */}
            <div style={{
              padding: '12px 20px',
              background: '#FFFFFF',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <button aria-label="Enviar foto (em breve)" disabled title="Anexos chegam na Fase 3" style={{ background: 'none', border: 'none', color: '#CBD5E1' }}>
                <Image size={20} />
              </button>
              <button aria-label="Emoji (em breve)" disabled title="Emojis chegam na Fase 3" style={{ background: 'none', border: 'none', color: '#CBD5E1' }}>
                <Smile size={20} />
              </button>
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                placeholder="Digite sua mensagem..."
                style={{
                  flex: 1,
                  height: 40,
                  padding: '0 16px',
                  borderRadius: 999,
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  fontSize: 14,
                  color: '#0F172A',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={handleSend}
                aria-label="Enviar mensagem"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(37,99,235,0.3)'
                }}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
            <p style={{ fontSize: 13, color: '#94A3B8' }}>Selecione uma conversa.</p>
          </div>
        )}
      </div>
    </div>
  );
}
