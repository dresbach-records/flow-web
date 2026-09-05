import type { ReactNode } from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export default function EmptyState({ title, description, action, icon, className = '' }: EmptyStateProps) {
  return (
    <div className={`flow-ui-empty ${className}`} role="status">
      {icon && <div className="flow-ui-empty-icon" aria-hidden="true">{icon}</div>}
      <h2 className="flow-ui-empty-title">{title}</h2>
      {description && <p className="flow-ui-empty-description">{description}</p>}
      {action && <div className="flow-ui-empty-action">{action}</div>}
    </div>
  );
}
