import { CONTRIBUA_AREAS, CONTRIBUA_STEPS } from './Contribua.constants';

export default function ContribuaInfo() {
  return (
    <>
      <section className="contribua-section" aria-labelledby="por-que-contribuir">
        <span className="contribua-section-eyebrow">Motivação</span>
        <h2 id="por-que-contribuir">Por que contribuir?</h2>
        <div className="contribua-prose">
          <p>
            Porque participar no início de um projeto significa ajudar a definir aquilo que ele será no
            futuro.
          </p>
          <p>
            No Flow, estamos construindo uma plataforma modular, escalável e preparada para evolução
            contínua.
          </p>
          <p>
            A engenharia contempla, entre outros: <strong>API First</strong>, módulos independentes,
            Feed Ranking, Real-time, Chat, notificações, Web Push, cache, paginação, storage,
            thumbnails, métricas, auditoria, PWA, funcionamento com conexão limitada, offline-first,
            sincronização, segurança e moderação.
          </p>
          <p>
            Não estamos simplesmente criando páginas.
            <br />
            <strong>Estamos construindo a infraestrutura de uma plataforma social.</strong>
          </p>
        </div>
      </section>

      <section className="contribua-section" aria-labelledby="quem-pode-contribuir">
        <span className="contribua-section-eyebrow">Áreas</span>
        <h2 id="quem-pode-contribuir">Quem pode contribuir?</h2>
        <p className="contribua-section-lead">
          Estamos procurando pessoas interessadas em contribuir conforme suas habilidades e
          disponibilidade.
        </p>
        <div className="contribua-areas">
          {CONTRIBUA_AREAS.map((area) => (
            <article key={area.title} className="contribua-area-card">
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </article>
          ))}
        </div>
        <div className="contribua-prose" style={{ marginTop: 24 }}>
          <p>
            Você não precisa dominar todas essas áreas.
            <br />
            <strong>O importante é ter interesse genuíno em construir.</strong>
          </p>
        </div>
      </section>

      <section className="contribua-section" aria-labelledby="como-funciona">
        <span className="contribua-section-eyebrow">Processo</span>
        <h2 id="como-funciona">Como funciona?</h2>
        <div className="contribua-prose">
          <p>
            O desenvolvimento será organizado através do GitHub, com módulos, Issues, Pull Requests,
            revisão de código e acompanhamento do roadmap.
          </p>
          <p>A ideia é que cada colaborador consiga visualizar:</p>
        </div>
        <div className="contribua-steps">
          {CONTRIBUA_STEPS.map((step) => (
            <div key={step.title} className="contribua-step">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
        <div className="contribua-prose" style={{ marginTop: 16 }}>
          <p>
            <strong>Transparência é parte da arquitetura do projeto.</strong>
          </p>
        </div>
      </section>

      <section className="contribua-section" aria-labelledby="informacao-importante">
        <div className="contribua-note">
          <span className="contribua-section-eyebrow">Uma informação importante</span>
          <h2 id="informacao-importante">Transparência desde o primeiro commit</h2>
          <p>
            O Flow está atualmente em fase de desenvolvimento e não possui orçamento para contratação
            tradicional de uma equipe de desenvolvimento.
          </p>
          <p>
            Por isso, a participação nesta etapa ocorre por iniciativa e interesse do próprio
            colaborador. A participação não constitui, por si só, promessa de emprego, salário,
            sociedade ou remuneração futura.
          </p>
          <p>
            Caso o projeto alcance viabilidade comercial e sejam posteriormente criados mecanismos de
            remuneração, participação econômica, investimento, sociedade ou outras formas de parceria,
            essas condições serão discutidas individualmente e formalizadas em instrumentos próprios,
            considerando função, responsabilidades, contribuição e demais condições aplicáveis.
          </p>
          <p>
            Não queremos criar expectativas com promessas informais.{' '}
            <strong>Queremos construir relações transparentes desde o primeiro commit.</strong>
          </p>
        </div>
      </section>

      <section className="contribua-section" aria-labelledby="o-que-encontrar">
        <span className="contribua-section-eyebrow">Jornada</span>
        <h2 id="o-que-encontrar">O que você pode encontrar aqui?</h2>
        <div className="contribua-prose">
          <p>
            Você estará entrando em um projeto que pretende evoluir de{' '}
            <strong>ideia → protótipo → plataforma → produto → negócio</strong>.
          </p>
          <p>
            E quem participar desde os primeiros estágios terá a oportunidade de acompanhar e
            contribuir para essa evolução.
          </p>
          <p>Não prometemos que será fácil.</p>
          <p>Não prometemos que o projeto necessariamente chegará ao mercado.</p>
          <p>
            Mas podemos garantir uma coisa:
            <br />
            <strong>o objetivo é construir de verdade.</strong>
          </p>
        </div>
      </section>
    </>
  );
}