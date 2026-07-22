[CmdletBinding()]
param(
  [string] $EnvironmentUrl = "https://org23b93544.crm2.dynamics.com/",
  [string] $AssemblyPath = "plugins/Betinhos.Pagantes.PaymentTimestamp/bin/Release/net462/Betinhos.Pagantes.PaymentTimestamp.dll",
  [string] $TenantId = "organizations",
  [string] $ClientId = "51f81489-12ee-4a9e-aaae-a2591f45987d",
  [switch] $DeviceCode,
  [switch] $SkipSmokeTest
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$expectedDevUrl = "https://org23b93544.crm2.dynamics.com"
$environmentBaseUrl = $EnvironmentUrl.TrimEnd("/")
if ($environmentBaseUrl -ne $expectedDevUrl) {
  throw "Deploy abortado: este script aceita somente DEV ($expectedDevUrl)."
}

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $root
$resolvedAssemblyPath = Resolve-Path $AssemblyPath

if (-not (Get-Module -ListAvailable MSAL.PS)) {
  throw "Modulo MSAL.PS nao encontrado."
}

Import-Module MSAL.PS -ErrorAction Stop
$scope = "$environmentBaseUrl/user_impersonation"
$clientApplication = New-MsalClientApplication `
  -ClientId $ClientId `
  -TenantId $TenantId `
  -RedirectUri ([Uri] "http://localhost")
Enable-MsalTokenCacheOnDisk -PublicClientApplication $clientApplication

try {
  $tokenResult = Get-MsalToken -PublicClientApplication $clientApplication -Scopes $scope -Silent
} catch {
  if ($DeviceCode) {
    $tokenResult = Get-MsalToken -PublicClientApplication $clientApplication -Scopes $scope -DeviceCode
  } else {
    $tokenResult = Get-MsalToken -PublicClientApplication $clientApplication -Scopes $scope -Interactive
  }
}

if ([string]::IsNullOrWhiteSpace($tokenResult.AccessToken)) {
  throw "Falha ao obter token para DEV."
}

$script:headers = @{
  Authorization = "Bearer $($tokenResult.AccessToken)"
  Accept = "application/json"
  "Content-Type" = "application/json; charset=utf-8"
  "OData-MaxVersion" = "4.0"
  "OData-Version" = "4.0"
  Prefer = "return=representation"
}
$script:api = "$environmentBaseUrl/api/data/v9.2"

function Invoke-Dataverse([string] $Method, [string] $Path, $Body = $null) {
  $params = @{
    Method = $Method
    Uri = "$script:api/$Path"
    Headers = $script:headers
  }
  if ($null -ne $Body) {
    $params.Body = ConvertTo-Json -InputObject $Body -Depth 20 -Compress
  }
  return Invoke-RestMethod @params
}

function Get-First([string] $Path) {
  $response = Invoke-Dataverse -Method Get -Path $Path
  if ($null -eq $response.value -or $response.value.Count -eq 0) { return $null }
  return $response.value[0]
}

function Ensure-PaymentDateColumn {
  $attribute = Get-First "EntityDefinitions(LogicalName='cr40f_pagantes')/Attributes?`$select=LogicalName&`$filter=LogicalName eq 'cr40f_datadoprimeiropagamento'"
  if ($null -ne $attribute) {
    Write-Host "[payment-plugin] coluna existente: cr40f_datadoprimeiropagamento"
    return
  }

  $body = @{
    "@odata.type" = "Microsoft.Dynamics.CRM.DateTimeAttributeMetadata"
    SchemaName = "cr40f_DataDoPrimeiroPagamento"
    DisplayName = @{ LocalizedLabels = @(@{ Label = "Data do primeiro pagamento"; LanguageCode = 1046 }) }
    Description = @{ LocalizedLabels = @(@{ Label = "Instante UTC da primeira transicao do pagante para Pago."; LanguageCode = 1046 }) }
    RequiredLevel = @{ Value = "None" }
    Format = "DateAndTime"
    DateTimeBehavior = @{ Value = "UserLocal" }
  }
  Invoke-Dataverse -Method Post -Path "EntityDefinitions(LogicalName='cr40f_pagantes')/Attributes" -Body $body | Out-Null
  Invoke-Dataverse -Method Post -Path "PublishXml" -Body @{ ParameterXml = '<importexportxml><entities><entity>cr40f_pagantes</entity></entities></importexportxml>' } | Out-Null
  Write-Host "[payment-plugin] coluna criada e publicada: cr40f_datadoprimeiropagamento"
}

function Ensure-PluginAssembly {
  $assemblyName = "Betinhos.Pagantes.PaymentTimestamp"
  $escapedName = $assemblyName.Replace("'", "''")
  $assembly = Get-First "pluginassemblies?`$select=pluginassemblyid,name,version&`$filter=name eq '$escapedName'"
  $content = [Convert]::ToBase64String([IO.File]::ReadAllBytes($resolvedAssemblyPath))
  $body = @{
    name = $assemblyName
    description = "Registra a data do primeiro pagamento de Pagantes."
    content = $content
    isolationmode = 2
    sourcetype = 0
  }

  if ($null -eq $assembly) {
    $assembly = Invoke-Dataverse -Method Post -Path "pluginassemblies" -Body $body
    Write-Host "[payment-plugin] assembly criado: $($assembly.pluginassemblyid)"
  } else {
    Invoke-Dataverse -Method Patch -Path "pluginassemblies($($assembly.pluginassemblyid))" -Body @{ content = $content } | Out-Null
    Write-Host "[payment-plugin] assembly atualizado: $($assembly.pluginassemblyid)"
  }

  return [string] $assembly.pluginassemblyid
}

function Get-PluginType([string] $AssemblyId) {
  $typeName = "Betinhos.Pagantes.PaymentTimestamp.SetFirstPaymentTimestampPlugin"
  $escapedType = $typeName.Replace("'", "''")
  $pluginType = Get-First "plugintypes?`$select=plugintypeid,typename&`$filter=typename eq '$escapedType' and _pluginassemblyid_value eq $AssemblyId"
  if ($null -eq $pluginType) {
    $assemblyIdentity = [Reflection.AssemblyName]::GetAssemblyName($resolvedAssemblyPath)
    $publicKeyToken = ($assemblyIdentity.GetPublicKeyToken() | ForEach-Object { $_.ToString("x2") }) -join ""
    $culture = if ([string]::IsNullOrWhiteSpace($assemblyIdentity.CultureName)) { "neutral" } else { $assemblyIdentity.CultureName }
    $pluginType = Invoke-Dataverse -Method Post -Path "plugintypes" -Body @{
      name = $typeName
      typename = $typeName
      friendlyname = "Registrar data do primeiro pagamento"
      description = "Preenche a data do primeiro pagamento de Pagantes em PreOperation."
      assemblyname = $assemblyIdentity.Name
      culture = $culture
      publickeytoken = $publicKeyToken
      version = $assemblyIdentity.Version.ToString()
      isworkflowactivity = $false
      "pluginassemblyid@odata.bind" = "/pluginassemblies($AssemblyId)"
    }
    Write-Host "[payment-plugin] tipo criado: $($pluginType.plugintypeid)"
  }
  Write-Host "[payment-plugin] tipo confirmado: $($pluginType.plugintypeid)"
  return [string] $pluginType.plugintypeid
}

function Get-MessageRegistration([string] $MessageName) {
  $message = Get-First "sdkmessages?`$select=sdkmessageid,name&`$filter=name eq '$MessageName'"
  if ($null -eq $message) { throw "Mensagem SDK $MessageName nao encontrada." }

  $filter = Get-First "sdkmessagefilters?`$select=sdkmessagefilterid&`$filter=primaryobjecttypecode eq 'cr40f_pagantes' and _sdkmessageid_value eq $($message.sdkmessageid)"
  if ($null -eq $filter) { throw "Filtro SDK $MessageName/cr40f_pagantes nao encontrado." }

  return @{ MessageId = [string] $message.sdkmessageid; FilterId = [string] $filter.sdkmessagefilterid }
}

function Ensure-Step([string] $PluginTypeId, [string] $MessageName, [string] $FilteringAttributes = "") {
  $registration = Get-MessageRegistration $MessageName
  $stepName = "Betinhos Pagantes - Registrar primeiro pagamento - $MessageName"
  $escapedStepName = $stepName.Replace("'", "''")
  $step = Get-First "sdkmessageprocessingsteps?`$select=sdkmessageprocessingstepid,name&`$filter=name eq '$escapedStepName'"
  $body = @{
    name = $stepName
    description = "Preenche cr40f_datadoprimeiropagamento na primeira transicao para Pago."
    stage = 20
    mode = 0
    rank = 1
    supporteddeployment = 0
    "eventhandler_plugintype@odata.bind" = "/plugintypes($PluginTypeId)"
    "plugintypeid@odata.bind" = "/plugintypes($PluginTypeId)"
    "sdkmessageid@odata.bind" = "/sdkmessages($($registration.MessageId))"
    "sdkmessagefilterid@odata.bind" = "/sdkmessagefilters($($registration.FilterId))"
  }
  if (-not [string]::IsNullOrWhiteSpace($FilteringAttributes)) {
    $body.filteringattributes = $FilteringAttributes
  }

  if ($null -eq $step) {
    $step = Invoke-Dataverse -Method Post -Path "sdkmessageprocessingsteps" -Body $body
    Write-Host "[payment-plugin] step criado: $MessageName / $($step.sdkmessageprocessingstepid)"
  } else {
    Invoke-Dataverse -Method Patch -Path "sdkmessageprocessingsteps($($step.sdkmessageprocessingstepid))" -Body $body | Out-Null
    Write-Host "[payment-plugin] step atualizado: $MessageName / $($step.sdkmessageprocessingstepid)"
  }
  return [string] $step.sdkmessageprocessingstepid
}

function Ensure-PreImage([string] $UpdateStepId) {
  $imageName = "Betinhos Pagantes - PreImage primeiro pagamento"
  $escapedImageName = $imageName.Replace("'", "''")
  $image = Get-First "sdkmessageprocessingstepimages?`$select=sdkmessageprocessingstepimageid,name&`$filter=name eq '$escapedImageName'"
  $body = @{
    name = $imageName
    entityalias = "PreImage"
    imagetype = 0
    messagepropertyname = "Target"
    attributes = "cr40f_status,cr40f_datadoprimeiropagamento"
    "sdkmessageprocessingstepid@odata.bind" = "/sdkmessageprocessingsteps($UpdateStepId)"
  }

  if ($null -eq $image) {
    $image = Invoke-Dataverse -Method Post -Path "sdkmessageprocessingstepimages" -Body $body
    Write-Host "[payment-plugin] PreImage criada: $($image.sdkmessageprocessingstepimageid)"
  } else {
    Invoke-Dataverse -Method Patch -Path "sdkmessageprocessingstepimages($($image.sdkmessageprocessingstepimageid))" -Body $body | Out-Null
    Write-Host "[payment-plugin] PreImage atualizada: $($image.sdkmessageprocessingstepimageid)"
  }
}

function Test-PaymentTimestampPlugin {
  $createdIds = [Collections.Generic.List[string]]::new()
  try {
    $pending = Invoke-Dataverse -Method Post -Path "cr40f_paganteses" -Body @{
      cr40f_id = "codex-smoke-pending-$([Guid]::NewGuid().ToString('N'))"
      cr40f_status = 202410001
      cr40f_formadepagamento = 202410002
      cr40f_valor = 0.01
    }
    $pendingId = [string] $pending.cr40f_pagantesid
    [void] $createdIds.Add($pendingId)

    Invoke-Dataverse -Method Patch -Path "cr40f_paganteses($pendingId)" -Body @{ cr40f_status = 202410002 } | Out-Null
    $afterPayment = Invoke-Dataverse -Method Get -Path "cr40f_paganteses($pendingId)?`$select=cr40f_status,createdon,cr40f_datadoprimeiropagamento"
    if ($afterPayment.cr40f_status -ne 202410002 -or $null -eq $afterPayment.cr40f_datadoprimeiropagamento) {
      throw "Smoke test falhou: transicao Pendente -> Pago nao registrou a data."
    }

    $firstTimestamp = [DateTime] $afterPayment.cr40f_datadoprimeiropagamento
    Invoke-Dataverse -Method Patch -Path "cr40f_paganteses($pendingId)" -Body @{ cr40f_status = 202410002 } | Out-Null
    $afterRepeatedPayment = Invoke-Dataverse -Method Get -Path "cr40f_paganteses($pendingId)?`$select=cr40f_datadoprimeiropagamento"
    if ([DateTime] $afterRepeatedPayment.cr40f_datadoprimeiropagamento -ne $firstTimestamp) {
      throw "Smoke test falhou: reenvio do status Pago sobrescreveu a primeira data."
    }

    $createdPaid = Invoke-Dataverse -Method Post -Path "cr40f_paganteses" -Body @{
      cr40f_id = "codex-smoke-paid-$([Guid]::NewGuid().ToString('N'))"
      cr40f_status = 202410002
      cr40f_formadepagamento = 202410002
      cr40f_valor = 0.01
    }
    $createdPaidId = [string] $createdPaid.cr40f_pagantesid
    [void] $createdIds.Add($createdPaidId)
    $afterCreatePaid = Invoke-Dataverse -Method Get -Path "cr40f_paganteses($createdPaidId)?`$select=cr40f_datadoprimeiropagamento"
    if ($null -eq $afterCreatePaid.cr40f_datadoprimeiropagamento) {
      throw "Smoke test falhou: registro criado como Pago nao recebeu a data."
    }

    Write-Host "[payment-plugin] smoke DEV passou: transicao, idempotencia e Create Pago"
  } finally {
    foreach ($id in $createdIds) {
      Invoke-Dataverse -Method Delete -Path "cr40f_paganteses($id)" | Out-Null
    }
    if ($createdIds.Count -gt 0) {
      Write-Host "[payment-plugin] $($createdIds.Count) registros sinteticos removidos"
    }
  }
}

Ensure-PaymentDateColumn
$assemblyId = Ensure-PluginAssembly
$pluginTypeId = Get-PluginType -AssemblyId $assemblyId
Ensure-Step -PluginTypeId $pluginTypeId -MessageName "Create" | Out-Null
$updateStepId = Ensure-Step -PluginTypeId $pluginTypeId -MessageName "Update" -FilteringAttributes "cr40f_status"
Ensure-PreImage -UpdateStepId $updateStepId

if (-not $SkipSmokeTest) {
  Test-PaymentTimestampPlugin
}

Write-Host "[payment-plugin] deploy DEV concluido"
