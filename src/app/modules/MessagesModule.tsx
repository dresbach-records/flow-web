import React, { useState } from 'react';
import { Send, Image, Smile, Phone, Video, MoreVertical, Search, CheckCheck } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  online: boolean;
  unread: number;
  lastMessage: string;
  time: string;
  messages: ChatMessage[];
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'chat-1',
    name: 'Marina D.',
    handle: '@marinabeats',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    online: true,
    unread: 2,
    lastMessage: 'Ouviu a nova prévia que te mandei do arranjo?',
    time: '14:32',
    messages: [
      { id: 'm1', sender: 'them', text: 'E aí! Terminei a mixagem daquela faixa que gravamos semana passada.', time: '14:20' },
      { id: 'm2', sender: 'me', text: 'Sensacional! O grave ficou limpo como a gente queria?', time: '14:25' },
      { id: 'm3', sender: 'them', text: 'Ouviu a nova prévia que te mandei do arranjo?', time: '14:32' },
    ],
  },
  {
    id: 'chat-2',
    name: 'Lucas Rocha',
    handle: '@lucasarch',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    online: false,
    unread: 0,
    lastMessage: 'Vamos marcar aquele café sobre o projeto semana que vem!',
    time: 'Ontem',
    messages: [
      { id: 'm20', sender: 'them', text: 'Valeu pelo feedback sobre as renderizações!', time: 'Ontem' },
      { id: 'm21', sender: 'me', text: 'Ficaram impecáveis, Lucas! Parabéns.', time: 'Ontem' },
      { id: 'm22', sender: 'them', text: 'Vamos marcar aquele café sobre o projeto semana que vem!', time: 'Ontem' },
    ],
  },
  {
    id: 'chat-3',
    name: 'Sofia Mendes',
    handle: '@sofiaux',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    online: true,
    unread: 0,
    lastMessage: 'Te adicionei na biblioteca de componentes do Figma.',
    time: 'Segunda',
    messages: [
      { id: 'm30', sender: 'them', text: 'Te adicionei na biblioteca de componentes do Figma.', time: 'Segunda' },
    ],
  },
];

export default function MessagesModule() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string>('chat-1');
  const [inputVal, setInputVal] = useState('');
  const [search, setSearch] = useState('');

  const activeChat = conversations.find(c => c.id === activeId) ?? conversations[0];

  const handleSend = () => {
    const text = inputVal.trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id === activeId) {
          return {
            ...c,
            lastMessage: text,
            time: newMsg.time,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    setInputVal('');
  };

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.handle.toLowerCase().includes(search.toLowerCase())
  );

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
                      <span style={{ fontSize: 11, color: '#94A3B8' }}>{chat.time}</span>
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
                  {chat.unread > 0 && (
                    <span style={{
                      background: '#2563EB',
                      color: '#FFFFFF',
                      borderRadius: 999,
                      padding: '2px 6px',
                      fontSize: 10,
                      fontWeight: 700
                    }}>
                      {chat.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Conversation */}
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
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: 8 }}>
                <Phone size={18} />
              </button>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: 8 }}>
                <Video size={18} />
              </button>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: 8 }}>
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
            {activeChat.messages.map(msg => {
              const isMe = msg.sender === 'me';
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: '#94A3B8' }}>{msg.time}</span>
                    {isMe && <CheckCheck size={12} color="#2563EB" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Bar */}
          <div style={{
            padding: '12px 20px',
            background: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
              <Image size={20} />
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
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
      </div>
    </div>
  );
}
