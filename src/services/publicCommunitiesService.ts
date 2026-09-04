export interface CommunityItem {
  id: string;
  name: string;
  category: string;
  membersCount: string;
  description: string;
  imageUrl: string;
  joined?: boolean;
}

export const OFFICIAL_COMMUNITIES: CommunityItem[] = [
  {
    id: 'viagem',
    name: 'Amantes de Viagem',
    category: 'Viagens',
    membersCount: '124.5k membros',
    description: 'Dicas, roteiros e experiências incríveis pelo mundo todo.',
    imageUrl: '/flow-assets/com-viagem.png',
  },
  {
    id: 'fotografia',
    name: 'Fotografia Criativa',
    category: 'Arte & Foto',
    membersCount: '89.2k membros',
    description: 'Técnicas, presets e inspirações para fotógrafos amadores e pro.',
    imageUrl: '/flow-assets/com-fotografia.png',
  },
  {
    id: 'saudavel',
    name: 'Vida Saudável & Fitness',
    category: 'Saúde & Bem-estar',
    membersCount: '210.8k membros',
    description: 'Rotinas de treinos, receitas fit e hábitos saudáveis de verdade.',
    imageUrl: '/flow-assets/com-saudavel.png',
  },
  {
    id: 'tecnologia',
    name: 'Tecnologia & Inovação',
    category: 'Tecnologia',
    membersCount: '156.3k membros',
    description: 'IA, programação, gadgets, startups e o futuro do mundo digital.',
    imageUrl: '/flow-assets/com-tecnologia.png',
  },
  {
    id: 'pets',
    name: 'Pets do Flow',
    category: 'Animais de Estimação',
    membersCount: '95.4k membros',
    description: 'Histórias divertidas, fotos fofas e cuidados com nossos pets.',
    imageUrl: '/flow-assets/com-pets.png',
  },
  {
    id: 'musica',
    name: 'Música Sem Fronteiras',
    category: 'Música & Som',
    membersCount: '78.9k membros',
    description: 'Playlists, novos lançamentos e debates sobre todos os estilos musicais.',
    imageUrl: '/flow-assets/com-musica.png',
  },
];

const STORAGE_KEY = 'flow_joined_communities';

export function getJoinedCommunityIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function toggleCommunityJoin(communityId: string): boolean {
  try {
    const joined = new Set(getJoinedCommunityIds());
    let nowJoined = false;
    if (joined.has(communityId)) {
      joined.delete(communityId);
      nowJoined = false;
    } else {
      joined.add(communityId);
      nowJoined = true;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(joined)));
    return nowJoined;
  } catch {
    return false;
  }
}
