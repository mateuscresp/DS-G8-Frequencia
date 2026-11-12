param([string]$Projeto = (Get-Location).Path)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Invoke-Git {
    param([string[]]$Arguments)
    & git @Arguments
    if ($LASTEXITCODE -ne 0) { throw "Git falhou: $($Arguments -join ' ')" }
}
function Invoke-Npm {
    param([string[]]$Arguments)
    & npm.cmd @Arguments
    if ($LASTEXITCODE -ne 0) { throw "npm falhou: $($Arguments -join ' '). A branch local foi preservada para revisao." }
}
$initial = Get-Location
try {
    Set-Location -LiteralPath $Projeto
    foreach ($command in @('git', 'node', 'npm.cmd')) { $null = Get-Command $command -ErrorAction Stop }
    $nodeMajor = [int](& node -p 'process.versions.node.split(".")[0]')
    $nodeMinor = [int](& node -p 'process.versions.node.split(".")[1]')
    if (($nodeMajor -lt 22) -or (($nodeMajor -eq 22) -and ($nodeMinor -lt 12))) {
        throw 'Use Node 24 LTS ou Node 22.12+ antes de aplicar.'
    }
    $root = & git rev-parse --show-toplevel
    if ($LASTEXITCODE -ne 0) { throw 'Execute dentro do repositorio original do projeto.' }
    Set-Location -LiteralPath $root
    $dirty = & git status --porcelain
    if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel verificar o repositorio.' }
    if ($dirty) { throw 'Existem alteracoes locais sem commit. Salve-as em um commit e execute novamente. Nenhum arquivo foi substituido.' }
    $bundle = Join-Path $PSScriptRoot 'integracao.bundle'
    $manifestPath = Join-Path $PSScriptRoot 'manifest.json'
    if (!(Test-Path -LiteralPath $bundle) -or !(Test-Path -LiteralPath $manifestPath)) {
        throw 'Extraia o ZIP completo; bundle e manifest devem ficar ao lado deste script.'
    }
    $manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
    if ((Get-FileHash -LiteralPath $bundle -Algorithm SHA256).Hash -ne $manifest.sha256) { throw 'O pacote esta incompleto ou foi alterado. Baixe novamente.' }
    $previous = & git rev-parse HEAD
    if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel obter o commit atual.' }
    Invoke-Git -Arguments @('bundle', 'verify', $bundle)
    Invoke-Git -Arguments @('fetch', '--no-tags', $bundle, 'refs/heads/integracao/sprint3')
    $target = & git rev-parse FETCH_HEAD
    if ($LASTEXITCODE -ne 0 -or $target -ne $manifest.commit) { throw 'O commit do pacote nao corresponde ao manifesto.' }
    & git merge-base --is-ancestor $previous $target
    if ($LASTEXITCODE -ne 0) {
        throw 'Sua branch possui commits fora da base do pacote. Nenhum arquivo foi substituido. Envie git log -5 --oneline para integrar esses commits antes de continuar.'
    }
    $branch = 'integracao/sprint3-' + (Get-Date -Format 'yyyyMMdd-HHmmss')
    Invoke-Git -Arguments @('switch', '-c', $branch, $target)
    Write-Host "Branch anterior preservada. Commit anterior: $previous" -ForegroundColor Cyan
    Write-Host "Validando a nova branch: $branch" -ForegroundColor Cyan
    Set-Location -LiteralPath (Join-Path $root 'p07-frontend')
    Invoke-Npm -Arguments @('ci')
    Invoke-Npm -Arguments @('run', 'check')
    Invoke-Npm -Arguments @('test')
    Invoke-Npm -Arguments @('run', 'build')
    Set-Location -LiteralPath (Join-Path $root 'backend')
    Invoke-Npm -Arguments @('ci')
    Invoke-Npm -Arguments @('run', 'prisma:generate')
    Invoke-Npm -Arguments @('test')
    Invoke-Npm -Arguments @('run', 'build')
    Invoke-Npm -Arguments @('run', 'lint:ci')
    Set-Location -LiteralPath $root
    Write-Host "Aplicado e validado na branch $branch. Nenhum push realizado." -ForegroundColor Green
    Write-Host 'Para visualizar: Set-Location p07-frontend; npm run dev'
    Write-Host 'Banco, migrations e Keycloak nao foram executados. Leia docs/integracao/README.md antes de ativar a API.'
} finally { Set-Location -LiteralPath $initial.Path }
