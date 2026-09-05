// FLOW — Creator static data (FASE 3).
// Conteúdo de demonstração preservado integralmente de CreatorCenter.tsx.
// Substituição por dados reais fica para as fases de rede social/backend.
import { BookOpen, BriefcaseBusiness, Coins, Rocket, ShieldCheck, Wallet } from 'lucide-react';
import type { CreatorVideo } from './types';

export const creatorVideos: CreatorVideo[] = [
  { title: 'Kawaizinho chegou com mais uma dica…', views: '26,4 mil', likes: '896', comments: '27', shares: '366', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=85', date: '02 set 2026', completion: '42%' },
  { title: 'Como criar conteúdo que realmente conecta', views: '12,8 mil', likes: '542', comments: '31', shares: '118', img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=700&q=85', date: '01 set 2026', completion: '58%' },
  { title: 'Meu bastidor de hoje no FLOW', views: '8,7 mil', likes: '391', comments: '18', shares: '72', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=85', date: '30 ago 2026', completion: '51%' },
];

export const creatorActions = [
  ['Tarefa do criador', 'Complete desafios e oportunidades', Coins],
  ['Ganhos por views', 'Acompanhe sua monetização', Wallet],
  ['Parcerias', 'Encontre oportunidades com marcas', BriefcaseBusiness],
  ['Impulsionar', 'Amplie o alcance de uma publicação', Rocket],
  ['Academia', 'Aprenda a criar melhor', BookOpen],
  ['Verificação', 'Fortaleça a credibilidade do perfil', ShieldCheck],
] as const;
