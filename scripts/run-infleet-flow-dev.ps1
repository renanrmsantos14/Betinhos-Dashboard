[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$environmentId = '25a2ab78-cf07-ee41-a124-457aa2c29aea'
$flowId = 'f8ef6d9d-c485-4f7d-9ed1-219ac47e5e25'
$triggerName = 'Recorrencia_Diaria'
$clientId = '51f81489-12ee-4a9e-aaae-a2591f45987d'

Import-Module MSAL.PS -ErrorAction Stop
$app = New-MsalClientApplication `
    -ClientId $clientId `
    -TenantId 'organizations' `
    -RedirectUri ([Uri]'http://localhost')
Enable-MsalTokenCacheOnDisk -PublicClientApplication $app | Out-Null

try {
    $token = Get-MsalToken `
        -PublicClientApplication $app `
        -Scopes 'https://service.flow.microsoft.com//.default' `
        -Silent
}
catch {
    throw 'Sessao MSAL silenciosa indisponivel. Autentique uma vez; este script nunca abre device code automaticamente.'
}

$uri = "https://api.flow.microsoft.com/providers/Microsoft.ProcessSimple/environments/$environmentId/flows/$flowId/triggers/$triggerName/run?api-version=2016-11-01"
$arguments = @(
    '--retry', '5',
    '--retry-all-errors',
    '--connect-timeout', '20',
    '--max-time', '120',
    '--silent',
    '--show-error',
    '--output', 'NUL',
    '--write-out', '%{http_code}',
    '--request', 'POST',
    '--header', "Authorization: Bearer $($token.AccessToken)",
    '--header', 'Content-Type: application/json',
    '--data', '{}',
    $uri
)
$statusCode = & curl.exe @arguments
if ($statusCode -notmatch '^2\d\d$') {
    throw "Falha ao disparar fluxo DEV. HTTP $statusCode"
}
Write-Output "Fluxo DEV disparado. HTTP $statusCode"
