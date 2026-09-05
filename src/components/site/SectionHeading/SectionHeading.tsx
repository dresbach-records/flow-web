import './SectionHeading.css';

export interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({ eyebrow, title, highlight, description, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={`site-section-heading is-${align}`}>
      <span className="site-eyebrow">{eyebrow}</span>
      <h2>
        {highlight ? (
          <>
            <span className="site-gradient-text">{highlight}</span> {title}
          </>
        ) : (
          title
        )}
      </h2>
      {description && <p>{description}</p>}
    </div>
  );
}
