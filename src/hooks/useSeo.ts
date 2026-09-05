import { useEffect } from 'react';

// URL canônica centralizada do site (configurável via VITE_SITE_URL).
const SITE_URL = ((import.meta.env.VITE_SITE_URL as string | undefined) || 'https://flowsocial.fun').replace(/\/$/, '');

type SeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

function setMeta(selector: string, attr: string, value: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    if (!value) return;
    el = document.createElement('meta');
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  if (value) el.setAttribute('content', value);
}

/** Aplica title/description/canonical/Open Graph/Twitter por página (sem bibliotecas). */
export function useSeo({ title, description, path, image = '/logo.png' }: SeoInput) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    document.title = title;
    setMeta('meta[name="description"]', 'name', description);
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', url);
    setMeta('meta[property="og:title"]', 'property', title);
    setMeta('meta[property="og:description"]', 'property', description);
    setMeta('meta[property="og:url"]', 'property', url);
    setMeta('meta[property="og:image"]', 'property', `${SITE_URL}${image}`);
    setMeta('meta[name="twitter:title"]', 'name', title);
    setMeta('meta[name="twitter:description"]', 'name', description);
    setMeta('meta[name="twitter:image"]', 'name', `${SITE_URL}${image}`);
  }, [title, description, path, image]);
}