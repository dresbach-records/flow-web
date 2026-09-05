// FLOW — PermissionGuard (autorização real no frontend + regras no Firestore).
// O frontend NÃO é a única proteção: cada operação é validada pelas rules.
import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useAdminAuth, type AdminUser } from '../context/AdminAuthContext';

interface PermissionGuardProps {
  allow: Array<AdminUser['role']>;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ allow, children }) => {
  const { user } = useAdminAuth();

  if (!user || !allow.includes(user.role)) {
    return (
      <div className="admin-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
        <ShieldAlert size={32} color="#ef4444" style={{ margin: '0 auto 12px auto', display: 'block' }} />
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
          Sem permissão
        </h2>
        <p style={{ color: '#64748b', fontSize: 13.5, margin: 0 }}>
          Seu papel ({user?.role ?? 'desconhecido'}) não autoriza este módulo. A operação também é
          bloqueada pelas regras do Firestore.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
