// FLOW — "Contribua com o Flow" (página institucional com formulário real → POST /api/v1/contributors).
import { useRef } from 'react';
import SiteHeader from '../../components/site/SiteHeader';
import SiteFooter from '../../components/site/SiteFooter';
import { ContribuaForm, ContribuaHero, ContribuaInfo } from '../../components/site/Contribua';
import { useSeo } from '../../hooks/useSeo';

export default function SiteContribua() {
  useSeo({
    title: 'Contribua com o Flow | Construa conosco',
    description: 'Conheça o projeto Flow e participe da construção de uma nova plataforma social.',
    path: '/contribua',
  });

  const formRef = useRef<HTMLDivElement | null>(null);
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="site-home">
      <SiteHeader />
      <main className="contribua">
        <ContribuaHero onCta={scrollToForm} />
        <ContribuaInfo />
        <section className="contribua-section" aria-labelledby="quero-contribuir" ref={formRef}>
          <div id="quero-contribuir">
            <ContribuaForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}