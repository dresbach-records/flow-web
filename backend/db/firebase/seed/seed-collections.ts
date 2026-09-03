import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getFirebaseApp } from '../firebase-admin.js';
import { FIRESTORE_COLLECTIONS } from '../collections.js';

const db = getFirestore(getFirebaseApp());

const seeds = [
  { collection: FIRESTORE_COLLECTIONS.moduleConfigs, id: 'core', data: { shop: true, rewards: true, ads: true, communities: true, live: true, messaging: true, calls: true, moderation: true } },
  { collection: FIRESTORE_COLLECTIONS.rewardTasks, id: 'watch-content', data: { title: 'Assistir conteúdo elegível', type: 'WATCH', rewardCents: 1, enabled: true, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() } },
  { collection: FIRESTORE_COLLECTIONS.rewardTasks, id: 'daily-engagement', data: { title: 'Interação diária', type: 'ENGAGE', rewardCents: 1, enabled: true, dailyLimit: 1, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() } }
] as const;

async function main() {
  const batch = db.batch();
  for (const item of seeds) batch.set(db.collection(item.collection).doc(item.id), item.data, { merge: true });
  await batch.commit();
  console.log(`Seed concluído: ${seeds.length} documentos base.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
