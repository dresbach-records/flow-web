import React from 'react';
import { Instagram, Twitter, Youtube, Linkedin, Github } from 'lucide-react';

export const SocialLinks: React.FC = () => {
  const socials = [
    { name: 'Instagram', icon: <Instagram size={18} />, href: 'https://instagram.com' },
    { name: 'Twitter', icon: <Twitter size={18} />, href: 'https://twitter.com' },
    { name: 'YouTube', icon: <Youtube size={18} />, href: 'https://youtube.com' },
    { name: 'LinkedIn', icon: <Linkedin size={18} />, href: 'https://linkedin.com' },
    { name: 'GitHub', icon: <Github size={18} />, href: 'https://github.com' },
  ];

  return (
    <div className="flow-social-links" aria-label="Redes sociais oficiais do Flow">
      {socials.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flow-social-link"
          aria-label={s.name}
        >
          {s.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
