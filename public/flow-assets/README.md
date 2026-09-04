# FLOW SVG Asset Kit

## Paleta de cores
- Azul: #4F7FFF
- Roxo: #8B5CF6
- Magenta: #D946EF
- Rosa: #EC4899

## Estrutura
- `brand/` — Logos, símbolo, wordmark, variantes (claro/escuro/gradiente), favicon, app icon
- `brand/social/` — Ícones das redes sociais vinculadas ao FLOW
- `navigation/` — Ícones de navegação principal (sidebar, topbar, bottomnav)
- `actions/` — Interações: curtir, comentar, compartilhar, salvar, seguir, bloquear...
- `media/` — Câmera, foto, vídeo, áudio, microfone, player, galeria...
- `stories/` — Stories: adicionar, assistido, live, fechar, reação, compartilhar
- `shorts/` — Shorts: logo, play, curtir, comentar, compartilhar, música, remix
- `profile/` — Avatares, capa, badge, verificado, online/offline
- `creator/` — Creator Center: analytics, audiência, conteúdo, monetização...
- `commerce/` — Marketplace: produto, carrinho, pedidos, loja, pagamento, cupom, wallet
- `ads/` — Anúncios: campanha, target, orçamento, performance, impressões, cliques
- `communities/` — Comunidades: membros, moderador, convite, regras, configurações
- `messaging/` — Chat, mensagem, leitura, digitando, voz, vídeo
- `notifications/` — Notificações por tipo: curtida, comentário, seguidor, mensagem...
- `security/` — Segurança: shield, lock, senha, 2FA, sessões, privacidade, dispositivos
- `settings/` — Configurações: conta, preferências, aparência, idioma, acessibilidade...
- `admin/` — Painel admin: dashboard, usuários, moderação, relatórios, auditoria...
- `status/` — Estados: sucesso, erro, aviso, info, carregando, vazio, offline, manutenção
- `authentication/` — Auth: login, cadastro, google, e-mail, senha, verificação, welcome
- `ui/` — Utilitários de interface: chevrons, arrows, plus, check, x, filter, sort...
- `decorative/` — Elementos decorativos: gradiente, orb, wave, glow, pattern, background

## Uso em React

```tsx
// Ícone como <img>
<img src="/flow-assets-svg/navigation/home.svg" alt="Início" width="24" height="24" />

// Ícone inline via import (Vite)
import HomeIcon from '/flow-assets-svg/navigation/home.svg?raw';

// Via asset-manifest.json
import manifest from '/flow-assets/asset-manifest.json';
<img src={manifest.navigation.home} alt="Início" />
```

## Regras
- Nenhum SVG vazio — todos com conteúdo visual real
- viewBox="0 0 24 24" para ícones de interface
- Viewboxes maiores para logos e decorativos
- Gradiente `#4F7FFF → #8B5CF6 → #D946EF → #EC4899` como identidade
- Símbolo "F" consistente em toda a linha de logos
