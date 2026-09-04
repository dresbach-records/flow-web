import React from 'react';

export interface FooterLink {
  label: string;
  href: string;
  badge?: string;
}

export interface FooterColumnProps {
  title: string;
  links: FooterLink[];
  onNavigate: (path: string) => void;
}

export const FooterColumn: React.FC<FooterColumnProps> = ({
  title,
  links,
  onNavigate,
}) => {
  return (
    <div className="flow-footer-col">
      <h4 className="flow-footer-col__title">{title}</h4>
      <ul className="flow-footer-col__list">
        {links.map((link) => (
          <li key={link.label} className="flow-footer-col__item">
            <button
              type="button"
              className="flow-footer-col__link"
              onClick={() => onNavigate(link.href)}
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="flow-footer-col__badge">{link.badge}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterColumn;
