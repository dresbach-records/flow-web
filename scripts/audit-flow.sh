#!/usr/bin/env bash
set -u

REPORT="flow-audit-report.txt"

echo "=============================================" | tee "$REPORT"
echo " FLOW — AUDITORIA AUTOMÁTICA DO PROJETO" | tee -a "$REPORT"
echo "=============================================" | tee -a "$REPORT"
echo "" | tee -a "$REPORT"

run() {
  echo "" | tee -a "$REPORT"
  echo ">>> $*" | tee -a "$REPORT"
  "$@" 2>&1 | tee -a "$REPORT"
  return ${PIPESTATUS[0]}
}

echo "DATA: $(date)" | tee -a "$REPORT"
echo "NODE: $(node -v 2>/dev/null || echo 'N/A')" | tee -a "$REPORT"
echo "PNPM: $(pnpm -v 2>/dev/null || echo 'N/A')" | tee -a "$REPORT"

echo "" | tee -a "$REPORT"
echo "========== ESTRUTURA ==========" | tee -a "$REPORT"

find . \
  -path './node_modules' -prune -o \
  -path './.git' -prune -o \
  -path './dist' -prune -o \
  -type f -print \
  | sort \
  | tee -a "$REPORT"

echo "" | tee -a "$REPORT"
echo "========== PACKAGE.JSON ==========" | tee -a "$REPORT"

if [ -f package.json ]; then
  cat package.json | tee -a "$REPORT"
else
  echo "ERRO: package.json não encontrado" | tee -a "$REPORT"
fi

echo "" | tee -a "$REPORT"
echo "========== PNPM LOCK ==========" | tee -a "$REPORT"

if [ -f pnpm-lock.yaml ]; then
  echo "pnpm-lock.yaml encontrado" | tee -a "$REPORT"
else
  echo "ERRO: pnpm-lock.yaml não encontrado" | tee -a "$REPORT"
fi

echo "" | tee -a "$REPORT"
echo "========== INSTALAÇÃO ==========" | tee -a "$REPORT"

if pnpm install --frozen-lockfile 2>&1 | tee -a "$REPORT"; then
  echo "OK: instalação concluída" | tee -a "$REPORT"
else
  echo "ERRO: pnpm install --frozen-lockfile falhou" | tee -a "$REPORT"
fi

echo "" | tee -a "$REPORT"
echo "========== TYPESCRIPT ==========" | tee -a "$REPORT"

if pnpm exec tsc --noEmit 2>&1 | tee -a "$REPORT"; then
  echo "OK: TypeScript sem erros" | tee -a "$REPORT"
else
  echo "ERRO: TypeScript encontrou problemas" | tee -a "$REPORT"
fi

echo "" | tee -a "$REPORT"
echo "========== BUILD ==========" | tee -a "$REPORT"

if pnpm build 2>&1 | tee -a "$REPORT"; then
  echo "OK: build concluído" | tee -a "$REPORT"
else
  echo "ERRO: build falhou" | tee -a "$REPORT"
fi

echo "" | tee -a "$REPORT"
echo "========== DEPENDÊNCIAS ==========" | tee -a "$REPORT"

pnpm list --depth 0 2>&1 | tee -a "$REPORT" || true

echo "" | tee -a "$REPORT"
echo "========== ÍCONES ==========" | tee -a "$REPORT"

echo "Imports Lucide:" | tee -a "$REPORT"
grep -RIn \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude-dir=dist \
  "from ['\"]lucide-react" . 2>/dev/null \
  | tee -a "$REPORT" || true

echo "" | tee -a "$REPORT"
echo "Possíveis placeholders de ícones:" | tee -a "$REPORT"

grep -RInE \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude-dir=dist \
  "TODO|FIXME|placeholder|icon-placeholder|IconPlaceholder|lucide-placeholder" . 2>/dev/null \
  | tee -a "$REPORT" || true

echo "" | tee -a "$REPORT"
echo "========== ROTAS ==========" | tee -a "$REPORT"

grep -RInE \
  --include='*.tsx' \
  --include='*.ts' \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  "(/login|/cadastro|/app|/explorar|/shorts|/mensagens|/comunidades|/perfil|/salvos|/configuracoes|/agendamentos)" . 2>/dev/null \
  | tee -a "$REPORT" || true

echo "" | tee -a "$REPORT"
echo "========== LINKS QUE PODEM ESTAR MORTOS ==========" | tee -a "$REPORT"

grep -RInE \
  --include='*.tsx' \
  --include='*.ts' \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  "href=['\"]#['\"]|javascript:void|onClick=\{\(\)=>\{\}\}" . 2>/dev/null \
  | tee -a "$REPORT" || true

echo "" | tee -a "$REPORT"
echo "========== AUTH ==========" | tee -a "$REPORT"

grep -RInE \
  --include='*.tsx' \
  --include='*.ts' \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  "firebase|Firebase|signIn|signInWithEmailAndPassword|createUser|onAuthStateChanged|GoogleAuthProvider|AppleAuthProvider|FacebookAuthProvider|localStorage.*auth" . 2>/dev/null \
  | tee -a "$REPORT" || true

echo "" | tee -a "$REPORT"
echo "========== FIREBASE ==========" | tee -a "$REPORT"

find . \
  -path './node_modules' -prune -o \
  -path './.git' -prune -o \
  -type f \( \
    -name '*firebase*' \
    -o -name 'firebase.json' \
    -o -name '.firebaserc' \
  \) -print \
  | tee -a "$REPORT"

echo "" | tee -a "$REPORT"
echo "========== DADOS MOCK ==========" | tee -a "$REPORT"

grep -RInE \
  --include='*.tsx' \
  --include='*.ts' \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  "mock|fake|dummy|demo|fixture|pravatar|unsplash|example.com" . 2>/dev/null \
  | tee -a "$REPORT" || true

echo "" | tee -a "$REPORT"
echo "========== CONSOLE DEBUG ==========" | tee -a "$REPORT"

grep -RInE \
  --include='*.tsx' \
  --include='*.ts' \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  "console\.log|console\.error|console\.warn" . 2>/dev/null \
  | tee -a "$REPORT" || true

echo "" | tee -a "$REPORT"
echo "========== CSS PROBLEMÁTICO ==========" | tee -a "$REPORT"

grep -RInE \
  --include='*.css' \
  --include='*.tsx' \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  "overflow:\s*hidden|width:\s*[0-9]+px|height:\s*[0-9]+px|position:\s*absolute" . 2>/dev/null \
  | tee -a "$REPORT" || true

echo "" | tee -a "$REPORT"
echo "========== ENV ==========" | tee -a "$REPORT"

if [ -f .env ]; then
  echo ".env encontrado — conteúdo NÃO será exibido por segurança." | tee -a "$REPORT"
else
  echo ".env não encontrado" | tee -a "$REPORT"
fi

if [ -f .env.example ]; then
  echo ".env.example encontrado" | tee -a "$REPORT"
else
  echo "ATENÇÃO: .env.example não encontrado" | tee -a "$REPORT"
fi

echo "" | tee -a "$REPORT"
echo "=============================================" | tee -a "$REPORT"
echo " AUDITORIA FINALIZADA" | tee -a "$REPORT"
echo " RELATÓRIO: $REPORT" | tee -a "$REPORT"
echo "=============================================" | tee -a "$REPORT"