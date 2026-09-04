import React, { useState } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Sparkles, Check, CheckCheck } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'system';
  actorName: string;
  actorAvatar: string;
  text: string;
  time: string;
  read: boolean;
  targetPreview?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'like',
    actorName: 'Marina D.',
    actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    text: 'curtiu sua publicação "Explorando sintetizadores analógicos na FLOW".',
    time: 'Há 15 min',
    read: false,
    targetPreview: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'n2',
    type: 'comment',
    actorName: 'Lucas Rocha',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    text: 'comentou: "Qual DAW você usou nessa automação? Ficou animal!"',
    time: 'Há 45 min',
    read: false,
    targetPreview: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'n3',
    type: 'follow',
    actorName: 'Sofia Mendes',
    actorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    text: 'começou a seguir você na FLOW.',
    time: 'Há 2 horas',
    read: true,
  },
  {
    id: 'n4',
    type: 'system',
    actorName: 'FLOW Guardian AI',
    actorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    text: 'Sua conta alcançou o nível de Criador Verificado. Acesse a Central do Criador.',
    time: 'Ontem',
    read: true,
  },
];

export default function NotificationsModule() {
  const [filter, setFilter] = useState<'all' | 'mentions' | 'likes' | 'follows' | 'system'>('all');
  const [items, setItems] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const markAllAsRead = () => {
    setItems(prev => prev.map(i => ({ ...i, read: true })));
  };

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'mentions') return item.type === 'comment';
    if (filter === 'likes') return item.type === 'like';
    if (filter === 'follows') return item.type === 'follow';
    if (filter === 'system') return item.type === 'system';
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'like':
        return <Heart size={16} fill="#DC2626" color="#DC2626" />;
      case 'comment':
        return <MessageCircle size={16} color="#2563EB" />;
      case 'follow':
        return <UserPlus size={16} color="#10B981" />;
      case 'system':
        return <Sparkles size={16} color="#8B5CF6" />;
    }
  };

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '24px 20px 60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Bell size={24} color="#2563EB" />
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0F172A' }}>Notificações</h1>
          </div>
          <p style={{ margin: 0, fontSize: 13.5, color: '#64748B' }}>
            Acompanhe interações, menções e avisos do ecossistema FLOW.
          </p>
        </div>
        <button
          type="button"
          onClick={markAllAsRead}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            borderRadius: 10,
            border: '1px solid #E2E8F0',
            background: '#FFFFFF',
            color: '#475569',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <CheckCheck size={16} />
          <span>Marcar todas como lidas</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {[
          { key: 'all', label: 'Todas' },
          { key: 'likes', label: 'Curtidas' },
          { key: 'mentions', label: 'Comentários & Menções' },
          { key: 'follows', label: 'Seguidores' },
          { key: 'system', label: 'Sistema & FLOW' },
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key as typeof filter)}
            style={{
              padding: '7px 16px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              border: filter === tab.key ? '1px solid #2563EB' : '1px solid #E2E8F0',
              background: filter === tab.key ? '#EFF6FF' : '#FFFFFF',
              color: filter === tab.key ? '#2563EB' : '#475569',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 16,
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(15,23,42,0.04)'
      }}>
        {filteredItems.map(item => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '16px 20px',
              borderBottom: '1px solid #F1F5F9',
              background: item.read ? '#FFFFFF' : '#F8FAFC',
              transition: 'background 0.15s ease'
            }}
          >
            {/* Avatar with icon badge */}
            <div style={{ position: 'relative' }}>
              <img
                src={item.actorAvatar}
                alt={item.actorName}
                style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getIcon(item.type)}
              </div>
            </div>

            {/* Content text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: '0 0 4px 0', fontSize: 13.5, color: '#1E293B', lineHeight: 1.4 }}>
                <strong style={{ fontWeight: 700, color: '#0F172A' }}>{item.actorName}</strong> {item.text}
              </p>
              <span style={{ fontSize: 11.5, color: '#94A3B8' }}>{item.time}</span>
            </div>

            {/* Target preview if any */}
            {item.targetPreview && (
              <img
                src={item.targetPreview}
                alt="Alvo"
                style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
              />
            )}

            {!item.read && (
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
