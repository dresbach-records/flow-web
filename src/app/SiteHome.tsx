// FLOW — SiteHome (página pública orquestradora).
// Composição de src/components/site/*. Nenhuma lógica de negócio aqui:
// cada seção conecta seus próprios serviços/hooks.
import BenefitsBar from '../components/site/BenefitsBar';
import CommunitiesSection from '../components/site/CommunitiesSection';
import DownloadSection from '../components/site/DownloadSection';
import FeaturesSection from '../components/site/FeaturesSection';
import HeroSection from '../components/site/HeroSection';
import SiteFooter from '../components/site/SiteFooter';
import SiteHeader from '../components/site/SiteHeader';
import StatsSection from '../components/site/StatsSection';
import './site-home.css';

export default function SiteHome() {
  return (
    <div className="site-home">
      <SiteHeader />
      <main>
        <HeroSection />
        <BenefitsBar />
        <FeaturesSection />
        <StatsSection />
        <CommunitiesSection />
        <DownloadSection />
      </main>
      <SiteFooter />
    </div>
  );
}
