import type { MemorialScreenProps } from './types';

export default function Screen365FinalMessage({ onNavigate }: MemorialScreenProps) {
  return (
    <div className="m365-hero">
      <h2 className="m365-headline">Mais que uma rede. Uma lembrança que permanece.</h2>

      <img
        src="/flow-assets-svg/brand/flow-logo.svg"
        alt="FLOW"
        style={{ height: 44, marginBottom: 24, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))' }}
      />

      <p className="m365-text">
        Na Flow, acreditamos que boas histórias nunca terminam. Elas continuam inspirando pessoas, mesmo quando a presença física se vai.
      </p>

      <div className="m365-heart">💜</div>

      <button className="m-btn-primary" style={{ padding: '14px 36px', fontSize: 16 }} onClick={() => onNavigate(351)}>
        Conheça o Memorial
      </button>
    </div>
  );
}
