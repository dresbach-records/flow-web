// FLOW — Creator static data (FASE 1).
// Ações do menu de ferramentas (navegação da UI, sem dados).
// Vídeos de demonstração REMOVIDOS (REGRA DE CONCLUSÃO FLOW): as telas usam
// posts reais via services/firebase/creator.
import { BookOpen, BriefcaseBusiness, Coins, Rocket, ShieldCheck, Wallet } from 'lucide-react';

export const creatorActions = [
  ['Tarefa do criador', 'Complete desafios e oportunidades', Coins],
  ['Ganhos por views', 'Acompanhe sua monetização', Wallet],
  ['Parcerias', 'Encontre oportunidades com marcas', BriefcaseBusiness],
  ['Impulsionar', 'Amplie o alcance de uma publicação', Rocket],
  ['Academia', 'Aprenda a criar melhor', BookOpen],
  ['Verificação', 'Fortaleça a credibilidade do perfil', ShieldCheck],
] as const;
