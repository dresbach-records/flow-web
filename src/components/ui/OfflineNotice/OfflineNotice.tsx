// FLOW — OfflineNotice (MEGA §24: offline-aware real).
// "Você está offline." / "Conexão restaurada." — sem simular persistência.
import { useEffect, useState } from 'react';

export default function OfflineNotice() {
  const [online, setOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  );
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const goOffline = () => {
      setOnline(false);
      setRestored(false);
    };
    const goOnline = () => {
      setOnline(true);
      setRestored(true);
      setTimeout(() => setRestored(false), 4000);
    };
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  if (online && !restored) return null;

  return (
    <div
      role={online ? 'status' : 'alert'}
      style={{
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100000,
        padding: '10px 18px',
        borderRadius: 999,
        fontSize: 13.5,
        fontWeight: 700,
        color: '#FFFFFF',
        background: online ? '#10B981' : '#DC2626',
        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
      }}
    >
      {online ? 'Conexão restaurada.' : 'Você está offline.'}
    </div>
  );
}
