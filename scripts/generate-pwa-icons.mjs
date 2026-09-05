// Gera os ícones PWA oficiais da FLOW a partir dos assets de marca (SVG).
// Uso: node scripts/generate-pwa-icons.mjs
import sharp from 'sharp';
import { writeFileSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = resolve(root, 'public');

const APP_ICON = readFileSync(resolve(publicDir, 'flow-assets-svg/brand/flow-app-icon.svg'), 'utf8');
const FAVICON = readFileSync(resolve(publicDir, 'flow-assets-svg/brand/flow-favicon.svg'), 'utf8');

// Ícone full-bleed (gradiente institucional) com o símbolo centralizado na área segura (maskable/Apple).
const FULLBLEED = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
<defs>
  <linearGradient id="fg" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#4F7FFF"/>
    <stop offset="33%" stop-color="#8B5CF6"/>
    <stop offset="66%" stop-color="#D946EF"/>
    <stop offset="100%" stop-color="#EC4899"/>
  </linearGradient>
  <radialGradient id="rg" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#D946EF"/>
    <stop offset="100%" stop-color="#4F7FFF"/>
  </radialGradient>
</defs>
<rect width="100" height="100" fill="url(#fg)"/>
<g transform="translate(17.07, 12.26) scale(0.74)">
  <path d="M22 14 C22 14 26 12 38 12 C48 12 52 15 52 20 C52 26 44 29 35 29 L22 29" stroke="white" stroke-width="5.5" stroke-linecap="round"/>
  <path d="M22 29 L22 86" stroke="white" stroke-width="5.5" stroke-linecap="round"/>
  <path d="M22 52 L40 52" stroke="white" stroke-width="5" stroke-linecap="round"/>
  <circle cx="56" cy="80" r="11" fill="white" opacity="0.92"/>
</g>
</svg>`;

async function render(svg, size, out) {
  await sharp(Buffer.from(svg)).resize(size, size).png({ compressionLevel: 9 }).toFile(out);
  const meta = await sharp(out).metadata();
  const stats = await sharp(out).stats();
  console.log(`  ${resolve(publicDir, out).replace(root + '/', '')}  ${meta.width}x${meta.height}  alpha=${meta.hasAlpha}  mean=${stats.channels.map((c) => Math.round(c.mean)).join(',')}`);
}

// ICO multi-tamanho com payload PNG (16/32/48/256).
function buildIco(payloads) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(payloads.length, 4);
  const dirSize = payloads.length * 16;
  const entries = [];
  let offset = 6 + dirSize;
  for (const { size, png } of payloads) {
    const entry = Buffer.alloc(16);
    entry[0] = size >= 256 ? 0 : size;
    entry[1] = size >= 256 ? 0 : size;
    entry[2] = 0;
    entry[3] = 0;
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += png.length;
  }
  return Buffer.concat([header, ...entries, ...payloads.map((p) => p.png)]);
}

const targets = [
  ['icons/icon-192.png', APP_ICON, 192],
  ['icons/icon-512.png', APP_ICON, 512],
  ['icons/icon-192-maskable.png', FULLBLEED, 192],
  ['icons/icon-512-maskable.png', FULLBLEED, 512],
  ['favicon-16x16.png', FAVICON, 16],
  ['favicon-32x32.png', FAVICON, 32],
  ['apple-touch-icon.png', FULLBLEED, 180],
];

for (const [name, svg, size] of targets) {
  await render(svg, size, resolve(publicDir, name));
}

// favicon.ico multi-tamanho (oficial, para navegadores legados).
const icoPayloads = [];
for (const size of [16, 32, 48, 256]) {
  const svg = size === 256 ? APP_ICON : FAVICON;
  const png = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  icoPayloads.push({ size, png });
}
writeFileSync(resolve(publicDir, 'favicon.ico'), buildIco(icoPayloads));
console.log(`  favicon.ico  ${icoPayloads.length} imagens (${icoPayloads.map((p) => p.size).join('/')})`);

console.log('Ícones PWA gerados com o logo oficial da FLOW.');