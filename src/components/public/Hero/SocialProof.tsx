import React from 'react';

export interface SocialProofProps {
  memberCountText?: string;
  className?: string;
}

export const SocialProof: React.FC<SocialProofProps> = ({
  memberCountText = 'Mais de 1 milhão de pessoas já fazem parte do Flow',
  className = '',
}) => {
  return (
    <div className={`flow-social-proof ${className}`}>
      <div className="flow-social-proof__avatars">
        <img
          src="/flow-assets/social-proof-avatars.png"
          alt="Membros da comunidade Flow"
          className="flow-social-proof__avatar-img"
          onError={(e) => {
            // Fallback to CSS avatars if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
      <span className="flow-social-proof__text">{memberCountText}</span>
    </div>
  );
};

export default SocialProof;
