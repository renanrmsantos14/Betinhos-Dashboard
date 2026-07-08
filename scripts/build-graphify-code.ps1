[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$sourceHtml = Join-Path $repoRoot 'Dashboard.html'
$sourceJs = Join-Path $repoRoot 'dataverse-export-metadata-console.js'
$graphRoot = Join-Path $repoRoot '.graphify-code'
$graphOut = Join-Path $graphRoot 'graphify-out'
$inlineJsTarget = Join-Path $graphRoot 'dashboard-inline.js'
$metadataJsTarget = Join-Path $graphRoot 'dataverse-export-metadata-console.js'
$deployScriptTarget = Join-Path $graphRoot 'scripts\deploy-webresource.ps1'

if (-not (Get-Command graphify -ErrorAction SilentlyContinue)) {
    throw 'graphify nao encontrado no PATH.'
}

if (Test-Path $graphRoot) {
    Remove-Item -LiteralPath $graphRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $graphRoot -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $graphRoot 'scripts') -Force | Out-Null

$html = Get-Content -LiteralPath $sourceHtml -Raw
$match = [regex]::Match($html, '<script>\s*(?<code>[\s\S]*?)\s*</script>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
if (-not $match.Success) {
    throw 'Nao foi possivel localizar o bloco <script> inline em Dashboard.html.'
}

$banner = @(
    '// Gerado por scripts/build-graphify-code.ps1'
    '// Fonte: Dashboard.html'
    ''
) -join [Environment]::NewLine

$inlineJs = $banner + $match.Groups['code'].Value.Trim() + [Environment]::NewLine
Set-Content -LiteralPath $inlineJsTarget -Value $inlineJs -Encoding UTF8
Copy-Item -LiteralPath $sourceJs -Destination $metadataJsTarget -Force
Copy-Item -LiteralPath (Join-Path $repoRoot 'scripts\deploy-webresource.ps1') -Destination $deployScriptTarget -Force

graphify extract $graphRoot --out $graphRoot
graphify cluster-only $graphRoot --no-label
