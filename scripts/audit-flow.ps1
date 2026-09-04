$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "        FLOW - AUDITORIA DO PROJETO" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

$root = Get-Location

function Section($title) {
    Write-Host ""
    Write-Host "---------------------------------------------" -ForegroundColor DarkGray
    Write-Host $title -ForegroundColor Yellow
    Write-Host "---------------------------------------------" -ForegroundColor DarkGray
}

Section "1. AMBIENTE"

Write-Host "Node:"
node -v

Write-Host "PNPM:"
pnpm -v

Section "2. PACKAGE.JSON"

if (Test-Path "package.json") {
    Get-Content package.json
} else {
    Write-Host "ERRO: package.json não encontrado." -ForegroundColor Red
}

Section "3. INSTALACAO"

pnpm install --frozen-lockfile

Section "4. TYPESCRIPT"

if (Test-Path "tsconfig.json") {
    pnpm exec tsc --noEmit
} else {
    Write-Host "tsconfig.json não encontrado." -ForegroundColor Red
}

Section "5. BUILD"

pnpm build

Section "6. ROTAS"

$routes = @(
    "src",
    "app",
    "pages",
    "routes"
)

foreach ($route in $routes) {
    if (Test-Path $route) {
        Write-Host "Encontrado: $route" -ForegroundColor Green
    }
}

Section "7. PLACEHOLDERS"

$patterns = @(
    "TODO",
    "FIXME",
    "coming soon",
    "em breve",
    "javascript:void",
    "href=""#""",
    "onClick={() => {}}"
)

foreach ($pattern in $patterns) {
    Write-Host ""
    Write-Host "Procurando: $pattern" -ForegroundColor Yellow

    Get-ChildItem `
        -Path . `
        -Recurse `
        -File `
        -Include *.ts,*.tsx,*.js,*.jsx,*.css,*.html `
        -ErrorAction SilentlyContinue |
        Select-String -Pattern $pattern -SimpleMatch |
        ForEach-Object {
            Write-Host "$($_.Path):$($_.LineNumber) -> $($_.Line.Trim())" -ForegroundColor Red
        }
}

Section "8. ICONES"

if (Test-Path "package.json") {
    $package = Get-Content package.json -Raw

    if ($package -match "lucide-react") {
        Write-Host "lucide-react encontrado." -ForegroundColor Green
    } else {
        Write-Host "lucide-react NÃO encontrado." -ForegroundColor Red
    }
}

Section "9. FIREBASE"

if (Test-Path "src") {
    Get-ChildItem src -Recurse -File `
        -Include *.ts,*.tsx,*.js,*.jsx `
        -ErrorAction SilentlyContinue |
        Select-String -Pattern "firebase|initializeApp|Firestore|FirebaseAuth|storage" |
        ForEach-Object {
            Write-Host "$($_.Path):$($_.LineNumber) -> $($_.Line.Trim())"
        }
}

Section "10. LOGIN"

$loginFiles = Get-ChildItem `
    -Path . `
    -Recurse `
    -File `
    -Include *login*,*Login*,*auth*,*Auth* `
    -ErrorAction SilentlyContinue

if ($loginFiles.Count -gt 0) {
    Write-Host "Arquivos relacionados ao login encontrados:" -ForegroundColor Green

    foreach ($file in $loginFiles) {
        Write-Host $file.FullName
    }
} else {
    Write-Host "Nenhum arquivo de login/auth encontrado." -ForegroundColor Red
}

Section "11. COMPONENTES VAZIOS"

Get-ChildItem `
    -Path . `
    -Recurse `
    -File `
    -Include *.tsx,*.ts,*.jsx,*.js `
    -ErrorAction SilentlyContinue |
    Select-String -Pattern "return null|return \(\)|return <></>|TODO" |
    ForEach-Object {
        Write-Host "$($_.Path):$($_.LineNumber) -> $($_.Line.Trim())" -ForegroundColor Red
    }

Section "12. FINAL"

Write-Host ""
Write-Host "Auditoria concluída." -ForegroundColor Green
Write-Host ""
Write-Host "Se o BUILD apresentou erro acima, corrija esses erros antes do deploy." -ForegroundColor Cyan
Write-Host ""