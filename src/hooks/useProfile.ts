// FLOW — useProfile (FASE 3).
// Lógica de carregamento do perfil extraída de src/app/ProfilePage.tsx sem
// alterar o comportamento. Firebase continua real; nenhum mock foi criado.
import { useEffect, useState } from 'react';
import { getDocument, listDocuments, type WithId } from '../services/firebase/firestore';
import type { FlowUser } from '../services/firebase/auth';

export type RecordData = Record<string, unknown>;

export interface Profile {
  uid: string;
  name: string;
  handle: string;
  avatar?: string;
  cover?: string;
  bio?: string;
  location?: string;
  website?: string;
  followers?: number;
  following?: number;
}

export type ProfilePost = WithId<RecordData> & { author?: RecordData | null };

export const text = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback);

export const number = (value: unknown) => (typeof value === 'number' ? value : Number(value ?? 0) || 0);

export const firstText = (obj: RecordData | null | undefined, keys: string[], fallback = '') => {
  for (const key of keys) {
    const value = text(obj?.[key]);
    if (value) return value;
  }
  return fallback;
};

export const image = (obj: RecordData | null | undefined, keys: string[]) => firstText(obj, keys);

export function profileFromAuth(user: { uid: string; displayName: string | null; email: string | null }): Profile {
  const name = user.displayName?.trim() || user.email?.split('@')[0] || 'Usuário';
  return {
    uid: user.uid,
    name,
    handle: `@${name.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '')}`,
  };
}

export function useProfile(uid: string, user: FlowUser | null, own: boolean) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<ProfilePost[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!uid || !user) return;
    let cancelled = false;
    setLoadingProfile(true);
    const load = async () => {
      const [userResult, postResult] = await Promise.allSettled([
        getDocument<RecordData>('users', uid),
        listDocuments<RecordData>('posts', {
          field: 'authorId',
          value: uid,
          orderByField: 'createdAt',
          direction: 'desc',
          max: 60,
        }),
      ]);
      if (cancelled) return;
      const stored = userResult.status === 'fulfilled' ? userResult.value : null;
      const source: RecordData | null =
        stored ?? (own ? { name: user.displayName, displayName: user.displayName, email: user.email } : null);
      if (!source) {
        setProfile(null);
        setPosts([]);
        setLoadingProfile(false);
        return;
      }
      setProfile({
        uid,
        name: firstText(source, ['name', 'displayName'], own ? profileFromAuth(user).name : 'Usuário'),
        handle: firstText(source, ['handle', 'username'], own ? profileFromAuth(user).handle : `@${uid.slice(0, 8)}`),
        avatar: image(source, ['avatarUrl', 'photoURL', 'avatar', 'photo']),
        cover: image(source, ['coverUrl', 'cover', 'banner']),
        bio: firstText(source, ['bio', 'description']),
        location: firstText(source, ['location', 'city']),
        website: firstText(source, ['website', 'websiteUrl']),
        followers: number(source.followers ?? source.followersCount),
        following: number(source.following ?? source.followingCount),
      });
      setPosts(postResult.status === 'fulfilled' ? postResult.value.map((post) => ({ ...post, author: source })) : []);
      setLoadingProfile(false);
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [uid, user, own]);

  return { profile, posts, loadingProfile };
}
