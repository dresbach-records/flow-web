import { firebaseStorage, firestore } from '../infrastructure/firebase/firebase-admin.js';

/**
 * Auditoria de Storage órfão (ferramenta operacional real, sem auto-delete).
 * Compara arquivos `users/` com `mediaPath` referenciados em `posts`.
 */
export async function auditStorageOrphans(maxFiles = 500): Promise<{
  scanned: number;
  referenced: number;
  orphans: string[];
  truncated: boolean;
}> {
  const [files] = await firebaseStorage().bucket().getFiles({ prefix: 'users/', maxResults: maxFiles });
  const posts = await firestore().collection('posts').select('mediaPath').limit(2000).get();
  const referenced = new Set<string>();
  posts.docs.forEach((doc) => {
    const path = doc.data()?.mediaPath;
    if (typeof path === 'string' && path) referenced.add(path);
  });
  const orphans = files.map((f) => f.name).filter((name) => !referenced.has(name));
  return {
    scanned: files.length,
    referenced: referenced.size,
    orphans: orphans.slice(0, 100),
    truncated: files.length >= maxFiles || orphans.length > 100,
  };
}
