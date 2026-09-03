import { useEffect, useState, type ComponentPropsWithoutRef } from 'react';

export type FlowTheme = 'light' | 'dark';
export type FlowAssetName =
  | 'arrow-left' | 'arrow-right' | 'bell' | 'bookmark' | 'camera' | 'check' | 'close'
  | 'comment' | 'compass' | 'download' | 'edit' | 'external' | 'eye-off' | 'eye'
  | 'filter' | 'flag' | 'heart' | 'help' | 'home' | 'image' | 'info' | 'link'
  | 'lock' | 'logout' | 'mail' | 'menu' | 'moon' | 'more' | 'pause' | 'play'
  | 'plus' | 'poll' | 'refresh' | 'repeat' | 'search' | 'send' | 'settings'
  | 'share' | 'shield' | 'smile' | 'sun' | 'trash' | 'upload' | 'user' | 'users'
  | 'video' | 'volume';

export function getFlowTheme(): FlowTheme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export function getFlowAsset(name: FlowAssetName, theme: FlowTheme = getFlowTheme()): string {
  return `/flow-assets-svg/icons/${theme}/${name}.svg`;
}

export function getFlowLogo(theme: FlowTheme = getFlowTheme()): string {
  return `/flow-assets-svg/brand/${theme}/flow-logo.svg`;
}

type FlowIconProps = Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'alt'> & { name: FlowAssetName; size?: number; alt?: string };

export function FlowIcon({ name, size = 20, alt = '', style, ...props }: FlowIconProps) {
  const [theme, setTheme] = useState<FlowTheme>(getFlowTheme);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(getFlowTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return <img {...props} src={getFlowAsset(name, theme)} alt={alt} width={size} height={size} style={{ display: 'block', objectFit: 'contain', ...style }} />;
}

export function FlowLogo({ className, alt = 'FLOW', ...props }: Omit<ComponentPropsWithoutRef<'img'>, 'src'> & { alt?: string }) {
  const [theme, setTheme] = useState<FlowTheme>(getFlowTheme);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(getFlowTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return <img {...props} className={className} src={getFlowLogo(theme)} alt={alt} />;
}
