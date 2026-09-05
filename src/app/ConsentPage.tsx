// FLOW — /consentimento (página dedicada; depende de auth + estado real).
// Com aceite pendente exibe o contrato; com aceite válido redireciona ao app.
import { navigate } from '../hooks/useRouter';
import { useAppContext } from '../contexts/AppContext';
import TermsGate from '../components/auth/TermsGate';
import LoadingState from '../components/ui/LoadingState';

export default function ConsentPage() {
  const { user, loading, needsConsent, acceptConsent, declineConsent } = useAppContext();

  if (loading) {
    return <LoadingState message="Verificando consentimento…" />;
  }
  if (!user) {
    navigate('/login');
    return <LoadingState message="Redirecionando ao login…" />;
  }
  if (!needsConsent) {
    navigate('/app');
    return <LoadingState message="Consentimento em dia. Abrindo o app…" />;
  }
  return <TermsGate onAccept={acceptConsent} onDecline={declineConsent} />;
}
