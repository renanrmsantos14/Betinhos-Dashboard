[CmdletBinding()]
param(
  [string] $EnvironmentUrl = "https://orgf261ae8e.crm2.dynamics.com/",

  [string] $OutputPath = "data/dashboard-prod-snapshot.json",

  [string] $TenantId = "organizations",

  [string] $ClientId = "51f81489-12ee-4a9e-aaae-a2591f45987d",

  [ValidateRange(1, 9)]
  [int] $MaxParallelJobs = 8,

  [switch] $DeviceCode
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)

function Write-Step([string] $Message, [ConsoleColor] $Color = [ConsoleColor]::DarkGray) {
  Write-Host "[snapshot-prod] $Message" -ForegroundColor $Color
}

$downloadWorker = {
  param([string] $Name, [string] $Url, [hashtable] $Headers, [string] $TempPath)

  $rows = [System.Collections.Generic.List[object]]::new()
  $nextUrl = $Url
  $pages = 0

  while ($nextUrl) {
    $pages++
    $response = $null
    $lastError = $null
    for ($attempt = 1; $attempt -le 4 -and $null -eq $response; $attempt++) {
      try {
        $response = Invoke-RestMethod -Method Get -Uri $nextUrl -Headers $Headers -TimeoutSec 120
      } catch {
        $lastError = $_.Exception
        $statusCode = $null
        if ($lastError.Response) { $statusCode = [int] $lastError.Response.StatusCode }
        if ($statusCode -ge 400 -and $statusCode -lt 500) { break }
        if ($attempt -lt 4) {
          Start-Sleep -Seconds ([Math]::Pow(2, $attempt - 1))
        }
      }
    }
    if ($null -eq $response) {
      throw "Falha ao baixar '$Name' na pagina ${pages} apos 4 tentativas: $($lastError.Message)"
    }
    foreach ($row in @($response.value)) { [void] $rows.Add($row) }
    $nextLinkProperty = $response.PSObject.Properties['@odata.nextLink']
    $nextUrl = if ($null -eq $nextLinkProperty) { $null } else { [string] $nextLinkProperty.Value }
  }

  $json = ConvertTo-Json -InputObject $rows.ToArray() -Depth 100 -Compress
  [System.IO.File]::WriteAllText($TempPath, $json, [System.Text.UTF8Encoding]::new($false))
  [pscustomobject]@{ Name = $Name; Count = $rows.Count; Pages = $pages; TempPath = $TempPath }
}

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $root

$environmentBaseUrl = $EnvironmentUrl.TrimEnd("/")
if ($environmentBaseUrl -ne "https://orgf261ae8e.crm2.dynamics.com") {
  throw "Exportacao abortada: este comando aceita somente PROD (https://orgf261ae8e.crm2.dynamics.com)."
}

if (-not (Get-Module -ListAvailable MSAL.PS)) {
  throw "Modulo MSAL.PS nao encontrado. Instale com: Install-Module MSAL.PS -Scope CurrentUser"
}

Import-Module MSAL.PS -ErrorAction Stop
$startedAt = Get-Date
Write-Host ""
Write-Host "Dashboard Betinhos | Snapshot PROD" -ForegroundColor Cyan
Write-Step "Ambiente: $environmentBaseUrl"
Write-Step "Destino: $OutputPath"
Write-Step "Cargas paralelas: $MaxParallelJobs"
Write-Step "Autenticacao PROD..."
$scope = "$environmentBaseUrl/user_impersonation"
$clientApplication = New-MsalClientApplication `
  -ClientId $ClientId `
  -TenantId $TenantId `
  -RedirectUri ([Uri] "http://localhost")
Enable-MsalTokenCacheOnDisk -PublicClientApplication $clientApplication

try {
  $tokenResult = Get-MsalToken -PublicClientApplication $clientApplication -Scopes $scope -Silent
} catch {
  Write-Step "Login necessario." ([ConsoleColor]::Yellow)
  if ($DeviceCode) {
    Write-Step "Use o codigo exibido pelo MSAL para autenticar." ([ConsoleColor]::Yellow)
    $tokenResult = Get-MsalToken -PublicClientApplication $clientApplication -Scopes $scope -DeviceCode
  } else {
    Write-Step "Abrindo autenticacao interativa..." ([ConsoleColor]::Yellow)
    $tokenResult = Get-MsalToken -PublicClientApplication $clientApplication -Scopes $scope -Interactive
  }
}

if ([string]::IsNullOrWhiteSpace($tokenResult.AccessToken)) {
  throw "Falha ao obter token MSAL para $scope"
}

$headers = @{
  Authorization = "Bearer $($tokenResult.AccessToken)"
  Accept = "application/json"
  "OData-MaxVersion" = "4.0"
  "OData-Version" = "4.0"
  Prefer = 'odata.include-annotations="OData.Community.Display.V1.FormattedValue",odata.maxpagesize=5000'
}
$api = "$environmentBaseUrl/api/data/v9.2"

$queries = [ordered]@{
  reservas = "$api/cr40f_reservadeveculoses?`$select=cr40f_reservadeveculosid,cr40f_dataehorriodesada,cr40f_status,cr40f_statusdefaturamento,cr40f_tipodoservico,cr40f_tipodeveiculo,_cr40f_veiculo_value,new_categoriadoitem,_new_composicaodepreco_value,_cr40f_financeiro_value&`$expand=cr40f_Motorista(`$select=cr40f_funcionariosid,cr40f_nomecompleto,new_apelido),cr40f_Cliente(`$select=cr40f_nomedocliente)&`$orderby=cr40f_dataehorriodesada desc"
  clientes = "$api/cr40f_clientes1s?`$select=cr40f_clientes1id,cr40f_nomedocliente"
  passageiros = "$api/cr40f_bancodedadoses?`$select=cr40f_bancodedadosid,cr40f_nomedopassageiro,cr40f_datadenascimento,_cr40f_cliente_value"
  servicosPassageiro = "$api/cr40f_servicosporpassageiros?`$select=_cr40f_bancodedados_value,_cr40f_geral_value"
  errosOperacionais = "$api/cr40f_errooperacionals?`$select=cr40f_dataocorrencia&`$orderby=cr40f_dataocorrencia desc"
  precos = "$api/cr40f_composicaodeprecoses?`$select=cr40f_composicaodeprecosid,new_valortotal,new_status"
  manutencoes = "$api/cr40f_manutencoeses?`$select=cr40f_datamanutencao,cr40f_datadaaprovacao,cr40f_valor,cr40f_status,cr40f_tipodoreparo,_cr40f_placa_carro_value&`$orderby=cr40f_datamanutencao desc"
  multas = "$api/cr40f_multases?`$select=cr40f_dataehorario,cr40f_status,_cr40f_codigodainfracao_value,_cr40f_motorista_value,_cr40f_placa_value&`$expand=cr40f_Codigodainfracao(`$select=cr40f_codigodainfracao,cr40f_descricaodainfracao)&`$orderby=cr40f_dataehorario desc"
  trocas = "$api/cr40f_trocasdecarros?`$select=cr40f_dataehorariodatroca,cr40f_statusdatroca,new_tipodetroca&`$orderby=cr40f_dataehorariodatroca desc"
  pagantes = "$api/cr40f_paganteses?`$select=cr40f_pagantesid,_cr40f_financeiro_value,cr40f_status,cr40f_valor,cr40f_formadepagamento"
  veiculos = "$api/cr40f_veiculoses?`$select=cr40f_veiculosid,cr40f_placa,cr40f_marca,cr40f_modelo,cr40f_statusdoveiculo,cr40f_blindado,cr40f_anodefabricacao,new_categoriadoveiculo"
  funcionarios = "$api/cr40f_funcionarioses?`$select=cr40f_funcionariosid,cr40f_nomecompleto,cr40f_status,cr40f_funcao,cr40f_validadedacnh,new_apelido"
  marketing = "$api/new_marketings?`$select=new_status,new_categoria,new_datadepublicacao&`$orderby=new_datadepublicacao desc"
  infracoes = "$api/cr40f_infracaodetransitos?`$select=cr40f_infracaodetransitoid,cr40f_codigodainfracao,cr40f_descricaodainfracao"
}

$resolvedOutputPath = Join-Path $root $OutputPath
$outputDirectory = Split-Path -Parent $resolvedOutputPath
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
$temporaryPath = "$resolvedOutputPath.tmp"

$pending = [System.Collections.Generic.Queue[object]]::new()
$temporaryTablePaths = [System.Collections.Generic.List[string]]::new()
$position = 0
foreach ($entry in $queries.GetEnumerator()) {
  $position++
  $tableTempPath = Join-Path $outputDirectory ".dashboard-prod-snapshot.$($entry.Key).tmp.json"
  [void] $temporaryTablePaths.Add($tableTempPath)
  $pending.Enqueue([pscustomobject]@{
    Name = $entry.Key
    Url = $entry.Value
    Position = $position
    TempPath = $tableTempPath
  })
}

$activeJobs = @()
$results = [ordered]@{}
$completed = 0
try {
  while ($pending.Count -gt 0 -or $activeJobs.Count -gt 0) {
    while ($pending.Count -gt 0 -and $activeJobs.Count -lt $MaxParallelJobs) {
      $item = $pending.Dequeue()
      Write-Step "$($item.Position)/$($queries.Count) | $($item.Name) | iniciando"
      $activeJobs += Start-Job -Name "snapshot-$($item.Name)" -ScriptBlock $downloadWorker -ArgumentList $item.Name, $item.Url, $headers, $item.TempPath
    }

    $finishedJob = Wait-Job -Job $activeJobs -Any
    $result = Receive-Job -Job $finishedJob -ErrorAction Stop
    Remove-Job -Job $finishedJob -Force
    $activeJobs = @($activeJobs | Where-Object { $_.Id -ne $finishedJob.Id })
    $results[$result.Name] = $result
    $completed++
    Write-Progress -Activity "Exportando snapshot PROD" -Status "$completed/$($queries.Count) tabelas concluidas" -PercentComplete ([Math]::Floor(($completed / $queries.Count) * 100))
    Write-Step "$completed/$($queries.Count) | $($result.Name) | concluido: $($result.Count) registros em $($result.Pages) pagina(s)" ([ConsoleColor]::Green)
  }
  Write-Progress -Activity "Exportando snapshot PROD" -Completed

  $counts = [ordered]@{}
  foreach ($entry in $queries.GetEnumerator()) { $counts[$entry.Key] = $results[$entry.Key].Count }
  $metadata = [ordered]@{
    schemaVersion = 1
    exportedAt = [DateTime]::UtcNow.ToString("o")
    source = [ordered]@{ environment = "PROD"; environmentUrl = $environmentBaseUrl }
    counts = $counts
  }

  Write-Step "Montando JSON final..."
  $metadataJson = $metadata | ConvertTo-Json -Depth 10 -Compress
  $writer = [System.IO.StreamWriter]::new($temporaryPath, $false, [System.Text.UTF8Encoding]::new($false))
  try {
    $writer.Write($metadataJson.Substring(0, $metadataJson.Length - 1))
    $writer.Write(',"data":{')
    $firstTable = $true
    foreach ($entry in $queries.GetEnumerator()) {
      if (-not $firstTable) { $writer.Write(',') }
      $writer.Write(('"{0}":' -f $entry.Key))
      $writer.Write([System.IO.File]::ReadAllText($results[$entry.Key].TempPath, [System.Text.UTF8Encoding]::new($false)))
      $firstTable = $false
    }
    $writer.Write('}}')
  } finally {
    $writer.Dispose()
  }
  Copy-Item -LiteralPath $temporaryPath -Destination $resolvedOutputPath -Force
} finally {
  foreach ($job in @($activeJobs)) {
    if ($job.State -eq "Running") { Stop-Job -Job $job -ErrorAction SilentlyContinue }
    Remove-Job -Job $job -Force -ErrorAction SilentlyContinue
  }
  Remove-Item -LiteralPath $temporaryPath -Force -ErrorAction SilentlyContinue
  foreach ($tableTempPath in $temporaryTablePaths) { Remove-Item -LiteralPath $tableTempPath -Force -ErrorAction SilentlyContinue }
}

$sizeMb = [Math]::Round((Get-Item -LiteralPath $resolvedOutputPath).Length / 1MB, 2)
$totalRecords = ($counts.Values | Measure-Object -Sum).Sum
$elapsed = (Get-Date) - $startedAt
Write-Host ""
Write-Step "Concluido em $($elapsed.ToString('mm\:ss'))" ([ConsoleColor]::Green)
Write-Step "JSON: $resolvedOutputPath ($sizeMb MB)" ([ConsoleColor]::Green)
Write-Step "Total: $totalRecords registros em $($queries.Count) tabelas" ([ConsoleColor]::Green)
Write-Step "Proximo passo: npm run dev" ([ConsoleColor]::Cyan)
