# FLOW UI Assets — SVG

Pacote de assets vetoriais para a interface da rede social FLOW.

## Estrutura

- brand/light e brand/dark — marca FLOW e símbolo.
- navigation/light e navigation/dark — navegação.
- social/light e social/dark — interações sociais.
- media/light e media/dark — mídia/publicação/player.
- status/light e status/dark — segurança e estados.
- icons/light e icons/dark — biblioteca completa de ícones.
- brand/*/colors.svg — referência visual da paleta.

## Convenção de tema

Os SVGs de ícone usam `currentColor`, portanto o componente pode controlar a cor por CSS/Tailwind:

- Light: cor de texto principal/secondary conforme o design system.
- Dark: cor de texto clara/secondary conforme o design system.
- Destaques: ciano/azul do design system FLOW.

Não alterar o desenho dos ícones para cada tema; apenas a cor deve mudar.

## Diretrizes

- Usar `width`/`height` via CSS no componente.
- Não aplicar letter-spacing ao wordmark FLOW.
- Manter o logo sem espaçamento artificial entre as letras.
- Preferir SVG inline ou componente React para controle de cor.
- Evitar rasterização.
- Para imagens de conteúdo, usar `object-fit: cover`/`contain` conforme o contexto.
- Para avatar, manter proporção 1:1.

## Compatibilidade

Os arquivos são SVG puros, sem dependência externa, sem fontes incorporadas e sem URLs remotas.
