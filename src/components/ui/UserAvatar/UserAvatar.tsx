import './UserAvatar.css';

interface UserAvatarProps {
  src?: string;
  name?: string;
  size?: number;
  className?: string;
}

export default function UserAvatar({ src, name = 'Usuário', size = 40, className = '' }: UserAvatarProps) {
  if (src) {
    return <img src={src} alt={name} width={size} height={size} className={`flow-ui-avatar ${className}`} loading="lazy" />;
  }
  const initial = name.trim().charAt(0).toUpperCase() || 'U';
  return (
    <span
      className={`flow-ui-avatar flow-ui-avatar-fallback ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(12, Math.round(size * 0.4)) }}
      role="img"
      aria-label={name}
    >
      {initial}
    </span>
  );
}
