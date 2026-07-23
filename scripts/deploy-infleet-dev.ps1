[CmdletBinding()]
param(
    [switch]$Schema
)

$ErrorActionPreference = 'Stop'
$orgUrl = 'https://org23b93544.crm2.dynamics.com'
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
        -Scopes "$orgUrl/.default" `
        -Silent
}
catch {
    throw 'Sessao MSAL silenciosa indisponivel. Autentique uma vez; este script nunca abre device code automaticamente.'
}

if ($Schema) {
    & (Join-Path $PSScriptRoot 'provision-infleet-dev.ps1') -AccessToken $token.AccessToken -Apply
}
& (Join-Path $PSScriptRoot 'provision-infleet-flow-dev.ps1') -AccessToken $token.AccessToken -Apply -Activate
