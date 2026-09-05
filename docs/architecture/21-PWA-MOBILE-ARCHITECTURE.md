# 21 — PWA / MOBILE ARCHITECTURE

> Status do documento: **vivo**. Desktop e Mobile compartilham a **mesma plataforma** (design responsivo + PWA).

---

## 1. Princípio

Uma única SPA responsiva (não app nativo separado). Mobile = CSS responsivo + bottom nav + PWA (install, offline, push).

## 2. PWA

### 2.1 Manifest (`public/manifest.webmanifest`)
- `name`: "FLOW — Conecte. Compartilhe. Viva."; `short_name`: "FLOW".
- `start_url`: `/`; `scope`: `/`; `display`: standalone; `orientation`: portrait.
- `theme_color`: `#4F7FFF`; `background_color`: `#FFFFFF`.
- Ícones oficiais (logo da FLOW, gradiente azul→roxo→rosa): `icon-192.png`, `icon-512.png` (any), `icon-192-maskable.png`, `icon-512-maskable.png` (maskable opaco).

### 2.2 Service Worker (`public/sw.js`)
- Cache: `flow-shell-v4` (bump para invalidar ícone antigo).
- Precache: `/`, `/index.html`, `/manifest.webmanifest`, `/favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `icons/icon-192.png`, `icons/icon-512.png`.
- `install`: `cache.addAll` + `skipWaiting`.
- `activate`: limpa caches antigos + `clients.claim`.
- `fetch`: **network-first** para GETs same-origin; `/api` nunca é cacheado (FASE 10 — evita HTML no lugar de JSON); fallback `caches.match` → `/index.html`.
- `push`: `showNotification` (ícone oficial); click → focus/`/app`.
- Registro: `main.tsx` (on load).

### 2.3 Install
- `usePwaInstall` (captura `beforeinstallprompt`; retorna `accepted|dismissed|unavailable`).
- `InstallAppPrompt` — diálogo flutuante; dismiss em `flow.pwa.dismissed`.
- `DownloadSection` no site público.

### 2.4 Push
- `push.ts` + backend (`VAPID`); ver `13-NOTIFICATION-ARCHITECTURE.md`.

## 3. Mobile UI

- `BottomNav` (canônico): Início, Explorar, botão central Criar (`/app/criar`), Notificações, Perfil.
- AppShell: `TopBar`/`Sidebar` (desktop), `BottomNav` (mobile), `RightRail` (desktop), `FloatingPlayer`.
- Responsividade: `responsive.css`, `site-fidelity.css`; breakpoints em componentes (ex.: ≤900px admin sidebar colapsa; ≤700px site-editor).
- Safe areas / touch UX: ainda não formalizados. `[PLANEJADO]`
- Teste responsivo: Playwright verifica sem overflow horizontal em 390px e 1440px.

## 4. Offline

- `OfflineNotice` — pill "Você está offline."/"Conexão restaurada."
- SW app-shell → navegação básica offline (shell). Dados dinâmicos exigem conexão (ou futura fila offline).
- **Regra:** nunca fingir persistência offline — operações falham honestamente.

## 5. Metas de mobile

| Item | Estado |
|---|---|
| Manifest | [IMPLEMENTADO] |
| Service Worker (app-shell, push) | [IMPLEMENTADO] |
| Install prompt | [IMPLEMENTADO] |
| Ícones/maskable | [IMPLEMENTADO] |
| Metadata/OG | [IMPLEMENTADO] |
| Bottom nav | [IMPLEMENTADO] |
| Safe areas | [NÃO IMPLEMENTADO] |
| Touch gestures | [PARCIAL] |
| Offline data queue | [NÃO IMPLEMENTADO] |
| Push | [IMPLEMENTADO] (web) |
| Performance mobile | [PARCIAL] |

## 6. Catálogo mobile

`public/Telas Versao mobili/` contém mockups PNG (home, login, perfil, mensagens, shorts, explorar, etc.) — **referência visual**, não vinculados como telas funcionais separadas.

## 7. Roadmap

1. **[IMPLEMENTADO]** PWA completo (manifest, SW, install, push), BottomNav, responsividade, offline notice.
2. **[PLANEJADO] P1** — safe areas, gestos de navegação, teste em device-lab.
3. **[PLANEJADO] P2** — fila de operações offline com idempotência, app shell melhorado.
4. **[PLANEJADO] P3** — App nativo (React Native/Expo) reutilizando API, se decisão de produto.