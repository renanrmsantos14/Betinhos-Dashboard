[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$AccessToken,

    [switch]$Apply
)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$connectorDir = Join-Path $root 'power-platform\infleet\connector'
$manifest = Get-Content -LiteralPath (Join-Path $connectorDir 'connector.dev.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$apiDefinition = Get-Content -LiteralPath (Join-Path $connectorDir 'apiDefinition.swagger.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$apiProperties = Get-Content -LiteralPath (Join-Path $connectorDir 'apiProperties.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$orgUrl = ([string]$manifest.target.orgUrl).TrimEnd('/')
$solution = [string]$manifest.target.solutionUniqueName
$connectorId = [guid]$manifest.connector.id
$logicalName = [string]$manifest.connector.logicalName

if ($orgUrl -ne 'https://org23b93544.crm2.dynamics.com') {
    throw "Destino bloqueado: $orgUrl"
}
if ($solution -ne 'AppBetinhos') {
    throw "Solucao bloqueada: $solution"
}
if ($logicalName -ne 'new_5Finfleetgraphql') {
    throw "Nome logico bloqueado: $logicalName"
}

$headers = @{
    Authorization = "Bearer $AccessToken"
    Accept = 'application/json'
    'Content-Type' = 'application/json; charset=utf-8'
    'MSCRM.SolutionUniqueName' = $solution
}

function Invoke-Dataverse {
    param(
        [Parameter(Mandatory = $true)][ValidateSet('GET', 'POST', 'PATCH')][string]$Method,
        [Parameter(Mandatory = $true)][string]$Path,
        $Body
    )

    $params = @{
        Method = $Method
        Uri = "$orgUrl/api/data/v9.2/$Path"
        Headers = $headers
    }
    if ($null -ne $Body) {
        $params.Body = $Body | ConvertTo-Json -Depth 100 -Compress
    }
    Invoke-RestMethod @params
}

$allConnectors = @((Invoke-Dataverse -Method GET -Path 'connectors?$select=connectorid,name,displayname').value)
$existing = @($allConnectors | Where-Object { $_.name -eq $logicalName })
if ($existing.Count -gt 1) {
    throw "Duplicidade detectada: $($existing.Count) conectores com nome $logicalName."
}
if ($existing.Count -eq 1 -and [guid]$existing[0].connectorid -ne $connectorId) {
    throw "Conector existente usa GUID diferente: $($existing[0].connectorid). Nenhuma alteracao aplicada."
}

$payload = @{
    connectorid = $connectorId
    name = $logicalName
    displayname = [string]$manifest.connector.displayName
    description = [string]$manifest.connector.description
    connectortype = 1
    openapidefinition = $apiDefinition | ConvertTo-Json -Depth 100 -Compress
    connectionparameters = $apiProperties.properties.connectionParameters | ConvertTo-Json -Depth 30 -Compress
    iconbrandcolor = [string]$apiProperties.properties.iconBrandColor
}

$operation = if ($existing.Count -eq 1) { 'UPDATE' } else { 'CREATE' }
Write-Host "[$operation] $logicalName ($connectorId) em $orgUrl / $solution"

if ($Apply) {
    if ($operation -eq 'CREATE') {
        $null = Invoke-Dataverse -Method POST -Path 'connectors' -Body $payload
    } else {
        $payload.Remove('connectorid')
        $payload.Remove('name')
        $null = Invoke-Dataverse -Method PATCH -Path "connectors($connectorId)" -Body $payload
    }
}

$result = @{
    target = 'DEV'
    solution = $solution
    connectorId = $connectorId
    logicalName = $logicalName
    operation = $operation
    applied = [bool]$Apply
}

if ($Apply) {
    $solutionRow = @((Invoke-Dataverse -Method GET -Path "solutions?`$select=solutionid&`$filter=uniquename eq '$solution'").value) | Select-Object -First 1
    if (-not $solutionRow) { throw "Solucao $solution nao encontrada apos provisionamento." }
    $componentFilter = [uri]::EscapeDataString("_solutionid_value eq $($solutionRow.solutionid) and objectid eq $connectorId")
    $components = @((Invoke-Dataverse -Method GET -Path "solutioncomponents?`$select=solutioncomponentid,componenttype&`$filter=$componentFilter").value)
    if ($components.Count -ne 1) {
        throw "Conector criado, mas associacao com AppBetinhos nao foi confirmada. Componentes encontrados: $($components.Count)."
    }
    $result.solutionComponentType = $components[0].componenttype
}

$result | ConvertTo-Json -Depth 5
