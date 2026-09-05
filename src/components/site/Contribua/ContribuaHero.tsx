// Hero da página "Contribua com o Flow" — usa a imagem oficial do convite.
export default function ContribuaHero({ onCta }: { onCta: () => void }) {
  return (
    <section className="contribua-hero" aria-label="Contribua com o Flow">
      <div className="contribua-hero-copy">
        <span className="contribua-section-eyebrow">Faça parte do começo</span>
        <h1>Contribua com o Flow</h1>
        <p className="contribua-hero-subtitle">Ajude a construir o futuro das conexões digitais.</p>
        <p className="contribua-hero-lead">
          O Flow está sendo construído do zero. Uma plataforma social independente, com arquitetura
          inspirada nos princípios de engenharia de grandes plataformas sociais, mas com implementação
          própria. Estamos formando uma comunidade de pessoas interessadas em tecnologia, produto,
          design, infraestrutura e inovação que desejam contribuir para transformar essa ideia em uma
          plataforma real.
        </p>
        <button type="button" className="contribua-btn" onClick={onCta}>
          Quero contribuir
        </button>
      </div>
      <div className="contribua-hero-media">
        <img
          src="/CONVITE%20FLOW.png"
          alt="Convite do Flow para pessoas que desejam contribuir com a construção da plataforma"
          width="1024"
          height="1024"
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
}