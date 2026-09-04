import React from 'react';
import { FolderOpen } from 'lucide-react';
import CTAButton from './CTAButton';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <FolderOpen size={36} color="#94A3B8" />,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flow-state flow-state--empty ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 24px',
        gap: 12,
        borderRadius: 16,
        background: '#FFFFFF',
        border: '1px dashed #CBD5E1',
        maxWidth: 480,
        margin: '0 auto',
      }}
    >
      <div style={{ marginBottom: 4 }}>{icon}</div>
      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0F172A' }}>{title}</h3>
      {description && <p style={{ margin: 0, fontSize: 14, color: '#64748B', lineHeight: 1.5 }}>{description}</p>}
      {actionLabel && onAction && (
        <CTAButton size="sm" variant="soft" onClick={onAction} style={{ marginTop: 8 }}>
          {actionLabel}
        </CTAButton>
      )}
    </div>
  );
};

export default EmptyState;
