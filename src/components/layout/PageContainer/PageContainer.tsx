import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  maxWidth?: number | string;
  className?: string;
}

export default function PageContainer({
  children,
  title,
  subtitle,
  action,
  maxWidth = 1140,
  className = '',
}: PageContainerProps) {
  return (
    <div
      className={`flow-page-container ${className}`}
      style={{ maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }}
    >
      {(title || subtitle || action) && (
        <header className="flow-page-header">
          <div>
            {title && <h1 className="flow-page-title">{title}</h1>}
            {subtitle && <p className="flow-page-subtitle">{subtitle}</p>}
          </div>
          {action && <div className="flow-page-header-action">{action}</div>}
        </header>
      )}

      <div className="flow-page-content">{children}</div>
    </div>
  );
}
