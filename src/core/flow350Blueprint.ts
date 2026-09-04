export type BlueprintStatus = 'disabled' | 'enabled';
export type BlueprintPriority = 'P0' | 'P1' | 'P2' | 'P3';

export interface FlowBlueprintEntry {
  id: string;
  module: string;
  route: string;
  title: string;
  status: BlueprintStatus;
  priority: BlueprintPriority;
  function: string;
  frontend: string;
  backend: string;
  permissions: string[];
  dependencies: string[];
}

/**
 * FLOW 350 Blueprint
 *
 * The project requirements define ~350 functional screens/states grouped in
 * 19 modules. All entries are intentionally disabled until their complete
 * frontend/backend contract is implemented and tested.
 *
 * IMPORTANT: this registry is planning/runtime metadata. It must never be
 * treated as authorization. Backend authorization remains mandatory.
 */
export const FLOW_350_TARGET = 350;

const MODULES = [
  ['01', 'Conta e autenticação', 16],
  ['02', 'Feed', 28],
  ['03', 'Stories', 18],
  ['04', 'Reels / Shorts', 20],
  ['05', 'Perfil', 22],
  ['06', 'Pesquisa e Explorar', 16],
  ['07', 'Mensagens', 20],
  ['08', 'Notificações', 16],
  ['09', 'Comunidades / Grupos', 20],
  ['10', 'Salvos', 8],
  ['11', 'Eventos', 10],
  ['12', 'Marketplace', 16],
  ['13', 'Páginas', 26],
  ['14', 'Business Suite', 20],
  ['15', 'Anúncios / Ads', 32],
  ['16', 'Configurações', 28],
  ['17', 'Segurança e moderação', 12],
  ['18', 'Criador / profissional', 10],
  ['19', 'Administração', 12],
] as const;

const FUNCTION_BY_MODULE: Record<string, string> = {
  'Conta e autenticação': 'Identidade, cadastro, login, recuperação, verificação, sessões e segurança da conta.',
  'Feed': 'Publicar, consumir, reagir, comentar, compartilhar, salvar e controlar preferências do feed.',
  'Stories': 'Criar, editar, publicar, visualizar e administrar stories e seus controles de privacidade.',
  'Reels / Shorts': 'Criar, editar, publicar, descobrir e medir vídeos curtos.',
  'Perfil': 'Exibir e editar identidade pública, conteúdo, conexões e preferências do perfil.',
  'Pesquisa e Explorar': 'Pesquisar e descobrir pessoas, conteúdo, comunidades, páginas, tendências e marketplace.',
  'Mensagens': 'Conversas privadas, mídia, reações, solicitações, moderação e estados de leitura.',
  'Notificações': 'Centralizar eventos sociais, mensagens, segurança, grupos, páginas e alertas push.',
  'Comunidades / Grupos': 'Descobrir, criar, participar, moderar e administrar comunidades.',
  'Salvos': 'Organizar publicações, vídeos, reels, links e coleções salvas.',
  'Eventos': 'Descobrir, criar, participar e administrar eventos.',
  'Marketplace': 'Descobrir produtos, publicar anúncios, conversar, comprar, vender e avaliar.',
  'Páginas': 'Criar e administrar presença pública, conteúdo, serviços, produtos, seguidores e equipe.',
  'Business Suite': 'Planejar, publicar, administrar mensagens, leads, conteúdo e métricas comerciais.',
  'Anúncios / Ads': 'Criar, revisar, publicar e analisar campanhas, conjuntos, anúncios e métricas.',
  'Configurações': 'Controlar conta, privacidade, segurança, notificações, dados, publicidade e preferências.',
  'Segurança e moderação': 'Denúncias, bloqueios, palavras ocultas, moderação, violações e recursos.',
  'Criador / profissional': 'Ferramentas profissionais, conteúdo, insights, público, monetização e parcerias.',
  'Administração': 'Administrar equipes, permissões, integrações, APIs, webhooks, faturamento e segurança empresarial.',
};

const STATE_NAMES = ['overview', 'list', 'detail', 'create', 'edit', 'settings', 'empty', 'loading', 'error', 'success', 'permissions', 'activity'];

function slug(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function priority(module: string): BlueprintPriority {
  if (module === 'Conta e autenticação' || module === 'Segurança e moderação') return 'P0';
  if (module === 'Feed' || module === 'Perfil' || module === 'Mensagens') return 'P1';
  return 'P2';
}

function permissionsFor(module: string): string[] {
  if (module === 'Conta e autenticação') return ['auth'];
  if (module === 'Marketplace') return ['auth', 'location-optional', 'media-optional'];
  if (module === 'Anúncios / Ads' || module === 'Business Suite') return ['auth', 'business-role'];
  if (module === 'Mensagens') return ['auth', 'notifications-optional', 'media-optional'];
  return ['auth'];
}

/**
 * Generates exactly 350 disabled functional slots from the approved module
 * allocation. The allocation is deterministic so CI can assert the count.
 */
export const FLOW_350_BLUEPRINT: FlowBlueprintEntry[] = MODULES.flatMap(([code, module, count]) =>
  Array.from({ length: count }, (_, index) => {
    const state = STATE_NAMES[index % STATE_NAMES.length];
    const id = `FLOW-${code}-${String(index + 1).padStart(3, '0')}`;
    const title = `${module} — ${state}`;
    return {
      id,
      module,
      route: `/blueprint/${slug(module)}/${state}-${index + 1}`,
      title,
      status: 'disabled' as const,
      priority: priority(module),
      function: `${FUNCTION_BY_MODULE[module]} Estado planejado: ${state}.`,
      frontend: 'Tela responsiva com loading, vazio, erro, sucesso, acessibilidade e adaptação mobile/tablet/desktop.',
      backend: 'Contrato API, validação, autorização server-side, persistência, observabilidade, auditoria e testes automatizados.',
      permissions: permissionsFor(module),
      dependencies: ['design-system-flow', 'api-contract', 'telemetry', 'automated-tests'],
    } satisfies FlowBlueprintEntry;
  }),
);

if (FLOW_350_BLUEPRINT.length !== FLOW_350_TARGET) {
  throw new Error(`FLOW blueprint inválido: esperado ${FLOW_350_TARGET}, encontrado ${FLOW_350_BLUEPRINT.length}`);
}

export const FLOW_BLUEPRINT_BY_ID = new Map(FLOW_350_BLUEPRINT.map((entry) => [entry.id, entry]));

export function getFlowBlueprintEntry(id: string): FlowBlueprintEntry | undefined {
  return FLOW_BLUEPRINT_BY_ID.get(id);
}

export function isFlowBlueprintEnabled(id: string): boolean {
  return FLOW_BLUEPRINT_BY_ID.get(id)?.status === 'enabled';
}
