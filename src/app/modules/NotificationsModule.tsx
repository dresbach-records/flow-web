// FLOW — NotificationsModule (FASE 1/3: sem mocks).
// Notificações 100% Firestore (`users/{uid}/notifications`).
import React, { useCallback, useEffect, useState } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Sparkles, CheckCheck } from 'lucide-react';
import {
  listNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  subscribeToNotifications,
  type NotificationRecord,
  type NotificationType,
} from '../../services/firebase/notifications';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import LoadingState from '../../components/ui/LoadingState';

function formatTime(createdAt: unknown): string {
  try {
    const ts = createdAt as { toDate?: () => Date };
    if (ts && typeof ts.toDate === 'function') {
      return ts.toDate().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    }
  } catch {
    /* sem data honesta: omite */
  }
  return '';
}

export default function NotificationsModule() {
  const [filter, setFilter] = useState<'all' | 'mentions' | 'likes' | 'follows' | 'system'>('all');
  const [items, setItems] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await listNotifications());
    } catch {
      setError('Não foi possível carregar as notificações. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  // Tempo real: snapshot inicial + deltas com cleanup.
  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | null = null;
    try {
      unsubscribe = subscribeToNotifications(
        (live) => {
          if (!cancelled) {
            setItems(live);
            setLoading(false);
          }
        },
        () => {
          if (!cancelled) setLoading(false);
        },
      );
    } catch {
      /* sem sessão: mantém lista pontual */
    }
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const markAllAsRead = () => {
    const previous = items;
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
    void markAllNotificationsAsRead().catch(() => setItems(previous));
  };

  const openItem = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)));
    void markNotificationAsRead(id).catch(() => undefined);
  };

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'mentions') return item.type === 'comment';
    if (filter === 'likes') return item.type === 'like';
    if (filter === 'follows') return item.type === 'follow';
    if (filter === 'system') return item.type === 'system';
    return true;
  });

  const getIcon = (type: NotificationType) => {
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

      {loading && <LoadingState message="Carregando notificações…" />}
      {!loading && error && <ErrorState description={error} onRetry={() => reload()} />}
      {!loading && !error && filteredItems.length === 0 && (
        <EmptyState
          title="Nenhuma notificação"
          description="Curtidas, comentários e novos seguidores reais aparecem aqui."
        />
      )}

      {/* List */}
      {!loading && !error && filteredItems.length > 0 && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(15,23,42,0.04)'
        }}>
          {filteredItems.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => openItem(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 20px',
                background: item.read ? '#FFFFFF' : '#F8FAFC',
                transition: 'background 0.15s ease',
                width: '100%',
                border: 'none',
                borderBottom: '1px solid #F1F5F9',
                cursor: 'pointer',
                textAlign: 'left'
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
                {formatTime(item.createdAt) && (
                  <span style={{ fontSize: 11.5, color: '#94A3B8' }}>{formatTime(item.createdAt)}</span>
                )}
              </div>

              {!item.read && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB' }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
