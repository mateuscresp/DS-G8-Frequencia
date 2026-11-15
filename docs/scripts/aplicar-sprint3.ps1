param(
    [string]$Projeto = "C:\Users\Kauan\Documents\ProjetoDS-Preview",
    [string]$PastaPatches = (Join-Path $PSScriptRoot "patches")
)
$ErrorActionPreference = "Stop"
Push-Location $Projeto
try {
    $pendencias = @(git status --porcelain)
    if ($LASTEXITCODE -ne 0) { throw "Nao foi possivel consultar o repositorio." }
    if ($pendencias.Count -gt 0) {
        throw "Existem arquivos locais sem commit. Salve/revise essas alteracoes antes de aplicar a Sprint 3. Nenhum arquivo foi alterado por este script."
    }
    git switch frontend/presenca
    if ($LASTEXITCODE -ne 0) { throw "Nao foi possivel acessar frontend/presenca." }
    if (-not (Test-Path "p07-frontend\src\pages\StudentDashboard.tsx")) {
        throw "A refatoracao visual do Figma precisa estar aplicada e commitada primeiro."
    }
    $patches = @(Get-ChildItem -LiteralPath $PastaPatches -Filter "*.patch" | Sort-Object Name | ForEach-Object { $_.FullName })
    if ($patches.Count -eq 0) { throw "Nenhum patch encontrado em $PastaPatches." }
    $branch = "sprint3/qualidade-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    git switch -c $branch
    if ($LASTEXITCODE -ne 0) { throw "Nao foi possivel criar a branch da Sprint 3." }
    git am -- $patches
    if ($LASTEXITCODE -ne 0) {
        throw "A importacao parou em um conflito na branch $branch. Envie a mensagem exibida. Nao houve push nem alteracao no backend."
    }
    Push-Location p07-frontend
    try {
        npm ci
        if ($LASTEXITCODE -ne 0) { throw "Falha ao instalar dependencias do frontend." }
        npm run check
        if ($LASTEXITCODE -ne 0) { throw "Falha na verificacao de tipos." }
        npm test
        if ($LASTEXITCODE -ne 0) { throw "Falha nos testes." }
        npm run build
        if ($LASTEXITCODE -ne 0) { throw "Falha no build." }
    } finally { Pop-Location }
    Write-Host "Sprint 3 aplicada e validada na branch $branch." -ForegroundColor Green
    Write-Host "Backend preservado. Nenhum push foi realizado."
    Write-Host "Revise docs/SPRINT3-CHECKLIST.md antes de enviar a entrega."
} finally { Pop-Location }
