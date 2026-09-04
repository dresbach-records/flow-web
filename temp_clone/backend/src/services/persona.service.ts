import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { FieldValue } from 'firebase-admin/firestore';
import { firestore, firebaseStorage } from '../infrastructure/database.js';

export type PersonaStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
export type Persona = {
  id: string;
  username: string;
  displayName: string;
  accountType: 'AI_MANAGED_PERSONA';
  isAiManaged: true;
  personality: string;
  region: string;
  interests: string[];
  contentCategories: string[];
  postingRules: { dailyPostLimit: number; weeklyPostLimit: number; preferredHours: number[]; enabled: boolean };
  interactionRules: { replyToComments: boolean; followUsers: boolean; discloseAi: boolean };
  status: PersonaStatus;
};

export const marinaPersona: Persona = {
  id: 'marina-silva',
  username: '@marina.flow',
  displayName: 'Marina Silva',
  accountType: 'AI_MANAGED_PERSONA',
  isAiManaged: true,
  personality: 'Casual, comunicativa, positiva, espontânea e interessada em bem-estar.',
  region: 'São Paulo, SP',
  interests: ['Nutrição', 'Academia', 'Treinos', 'Alimentação equilibrada', 'Praia', 'Passeios', 'Viagens', 'Café', 'Fotografia', 'Rotina saudável', 'Qualidade de vida', 'Momentos cotidianos'],
  contentCategories: ['rotina', 'academia', 'alimentação', 'praia', 'passeios', 'trabalho', 'viagens', 'café', 'qualidade de vida'],
  postingRules: { dailyPostLimit: 2, weeklyPostLimit: 7, preferredHours: [8, 12, 18], enabled: true },
  interactionRules: { replyToComments: false, followUsers: false, discloseAi: true },
  status: 'ACTIVE',
};

const captions = [
  'Uma pausa no caminho também faz parte da rotina. Hoje o dia começou com calma e uma vista bonita pela janela.',
  'Nem todo dia precisa render mil coisas. Às vezes, cuidar de si é desacelerar um pouco e respirar.',
  'Treino feito e aquela sensação boa de missão cumprida. O importante é encontrar um ritmo que faça sentido para você.',
  'Tem dias que tudo o que a gente precisa é de sol, mar e tempo sem pressa.',
  'Um passeio simples, uma boa conversa e a cidade acontecendo ao redor. Gosto desses momentos sem muita programação.',
  'Entre uma tarefa e outra, uma pausa para lembrar que qualidade de vida também mora nos detalhes.',
  'Café passado, cabeça mais leve e alguns minutos para começar o dia sem correr.',
  'Viajar também é mudar o olhar. Cada paisagem traz uma pausa diferente para a rotina.',
  'Trabalho, estudos e um café por perto: o equilíbrio possível de hoje.',
  'Uma rotina saudável não precisa ser perfeita. Ela precisa ser possível de repetir.',
  'Pequenas escolhas feitas com constância costumam transformar mais do que grandes promessas.',
  'Hoje foi dia de movimento, suor e orgulho de ter aparecido por mim mesma.',
  'Caminhar ao ar livre muda completamente o humor. Um hábito simples que vale a pena cultivar.',
  'Uma foto espontânea para guardar a lembrança de um dia comum, mas gostoso.',
  'Comer bem não precisa ser complicado. O equilíbrio está muito mais na rotina do que na perfeição.',
  'Sol no rosto, cidade ao fundo e uma vontade enorme de aproveitar o presente.',
  'Nem todo descanso precisa de um plano. Às vezes, ele começa com uma janela aberta e uma respiração profunda.',
  'Entre treinos, cafés e alguns passeios por aí, sigo construindo uma rotina mais leve.',
];

const relationshipCaptions: Record<number, string> = {
  1: 'Minha namorada é meu lugar favorito no mundo. Amo dividir a vida, os planos e até os dias mais simples com ela. ❤️',
  7: 'Cada viagem fica mais bonita ao lado dela. Minha namorada, minha melhor companhia e o amor que eu escolho todos os dias. 🌅❤️',
};

export function captionForAsset(index: number): string { return relationshipCaptions[index] ?? captions[index % captions.length] ?? ''; }

export async function upsertMarinaPersona(): Promise<Persona> {
  const db = firestore();
  const personaRef = db.collection('personas').doc(marinaPersona.id);
  const userRef = db.collection('users').doc(marinaPersona.id);
  const now = new Date();
  await Promise.all([
    personaRef.set({ ...marinaPersona, updatedAt: now }, { merge: true }),
    userRef.set({
      uid: marinaPersona.id,
      ...marinaPersona,
      bio: 'Persona virtual administrada por IA. Nutrição, movimento e uma rotina mais leve.',
      age: 29,
      profession: 'Nutricionista',
      location: marinaPersona.region,
      updatedAt: now,
    }, { merge: true }),
  ]);
  return marinaPersona;
}

export async function seedMarinaPosts(): Promise<number> {
  await upsertMarinaPersona();
  const directory = resolve(process.cwd(), '../public/maria-silva-imagens');
  const files = (await readdir(directory)).filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file)).sort();
  const bucket = firebaseStorage().bucket();
  const db = firestore();
  let created = 0;
  const start = Date.now() + 60 * 60 * 1000;
  for (const [index, fileName] of files.entries()) {
    const postId = `${marinaPersona.id}-${fileName.replace(/\.[^.]+$/, '')}`;
    const postRef = db.collection('posts').doc(postId);
    const existing = await postRef.get();
    let mediaUrl = existing.get('mediaUrl') as string | undefined;
    let mediaPath = existing.get('mediaPath') as string | undefined;
    if (!mediaUrl || !mediaPath) {
      mediaPath = `personas/${marinaPersona.id}/posts/${fileName}`;
      const storageFile = bucket.file(mediaPath);
      await storageFile.save(await import('node:fs/promises').then(fs => fs.readFile(resolve(directory, fileName))), { metadata: { contentType: 'image/jpeg' } });
      [mediaUrl] = await storageFile.getSignedUrl({ action: 'read', expires: '2500-01-01' });
    }
    const scheduledAt = new Date(start + index * 24 * 60 * 60 * 1000);
    await postRef.set({
      authorId: marinaPersona.id,
      personaId: marinaPersona.id,
      aiManaged: true,
      origin: 'PERSONA_SEED',
      aiResponsible: 'FLOW_PERSONA_ENGINE',
      type: 'post',
      mediaType: 'image',
      mediaUrl,
      mediaPath,
      caption: captionForAsset(index),
      hashtags: index % 4 === 0 ? ['#rotinasaudavel', '#bemestar'] : [],
      status: existing.get('status') === 'PUBLISHED' ? 'PUBLISHED' : 'SCHEDULED',
      visibility: existing.get('status') === 'PUBLISHED' ? 'public' : 'private',
      scheduledAt,
      likesCount: existing.get('likesCount') ?? 0,
      commentsCount: existing.get('commentsCount') ?? 0,
      sharesCount: existing.get('sharesCount') ?? 0,
      updatedAt: new Date(),
    }, { merge: true });
    if (!existing.exists) created += 1;
  }
  return created;
}

export async function writePersonaAudit(event: string, postId: string, details: Record<string, unknown> = {}): Promise<void> {
  await firestore().collection('audit_logs').add({ event, postId, actorId: marinaPersona.id, ...details, createdAt: FieldValue.serverTimestamp() });
}
