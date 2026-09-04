import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { firebaseStorage } from './config';

export type UploadResult = { path: string; url: string };

/**
 * Upload a media file to Firebase Storage under the given folder.
 * Returns the storage path and a public download URL.
 */
export function uploadMedia(
  folder: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<UploadResult> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${folder}/${Date.now()}-${safeName}`;
  const storageRef = ref(firebaseStorage, path);
  const task = uploadBytesResumable(storageRef, file, { contentType: file.type });

  return new Promise<UploadResult>((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot) => {
        if (onProgress) onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
      },
      reject,
      async () => {
        try {
          resolve({ path, url: await getDownloadURL(task.snapshot.ref) });
        } catch (error) {
          reject(error);
        }
      },
    );
  });
}

export async function deleteMedia(path: string): Promise<void> {
  await deleteObject(ref(firebaseStorage, path));
}
