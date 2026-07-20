[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$sourceHtml = Join-Path $repoRoot 'Dashboard.html'
$sourceJs = Join-Path $repoRoot 'dataverse-export-metadata-console.js'
$graphRoot = Join-Path $repoRoot '.graphify-code'
$graphOut = Join-Path $graphRoot 'graphify-out'
$publishedGraphOut = Join-Path $repoRoot 'graphify-out'
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
$matches = [regex]::Matches($html, '<script(?<attrs>[^>]*)>\s*(?<code>[\s\S]*?)\s*</script>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
$inlineScripts = @($matches | Where-Object { $_.Groups['attrs'].Value -notmatch '\bsrc\s*=' })
if ($inlineScripts.Count -eq 0) {
    throw 'Nao foi possivel localizar blocos <script> inline em Dashboard.html.'
}

$banner = @(
    '// Gerado por scripts/build-graphify-code.ps1'
    '// Fonte: Dashboard.html'
    ''
) -join [Environment]::NewLine

$inlineJs = $banner + (($inlineScripts | ForEach-Object { $_.Groups['code'].Value.Trim() }) -join ([Environment]::NewLine * 2)) + [Environment]::NewLine
Set-Content -LiteralPath $inlineJsTarget -Value $inlineJs -Encoding UTF8
Copy-Item -LiteralPath $sourceJs -Destination $metadataJsTarget -Force
Copy-Item -LiteralPath (Join-Path $repoRoot 'scripts\deploy-webresource.ps1') -Destination $deployScriptTarget -Force

graphify extract $graphRoot --out $graphRoot
graphify label $graphRoot

New-Item -ItemType Directory -Path $publishedGraphOut -Force | Out-Null
@(
    '.graphify_analysis.json'
    '.graphify_labels.json'
    '.graphify_labels.json.sig'
    'GRAPH_REPORT.md'
    'graph.html'
    'graph.json'
    'manifest.json'
) | ForEach-Object {
    Copy-Item -LiteralPath (Join-Path $graphOut $_) -Destination (Join-Path $publishedGraphOut $_) -Force
}
