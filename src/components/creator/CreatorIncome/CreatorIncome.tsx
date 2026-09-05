import { ArrowLeft, ChevronRight, Coins } from 'lucide-react';

export default function CreatorIncome() {
  return (
    <section className="income-grid">
      <article className="panel income-main">
        <div className="panel-head">
          <div>
            <span className="eyebrow">MONETIZAÇÃO</span>
            <h3>Visão geral dos rendimentos</h3>
          </div>
          <button>
            Últimos 30 dias <ChevronRight />
          </button>
        </div>
        <div className="income-number">R$ 0,00</div>
        <p>Você ainda não possui rendimentos neste período.</p>
        <div className="income-empty">
          <Coins />
          <b>Comece a participar de oportunidades</b>
          <span>Complete tarefas, publique conteúdo elegível e acompanhe suas oportunidades de monetização.</span>
          <button>
            Ver oportunidades <ArrowLeft />
          </button>
        </div>
      </article>
      <article className="panel opportunities">
        <span className="eyebrow">OPORTUNIDADES</span>
        <h3>Formas de ganhar no FLOW</h3>
        {['Tarefas para criadores', 'Campanhas com marcas', 'Ganhos por visualizações', 'Programa de afiliados'].map((x, i) => (
          <button key={x}>
            <span>{i + 1}</span>
            <b>{x}</b>
            <ChevronRight />
          </button>
        ))}
      </article>
    </section>
  );
}
