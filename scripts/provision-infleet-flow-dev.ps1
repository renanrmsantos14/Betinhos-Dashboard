[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$AccessToken,

    [switch]$Apply,

    [switch]$Activate
)

$ErrorActionPreference = 'Stop'
$orgUrl = 'https://org23b93544.crm2.dynamics.com'
$solution = 'AppBetinhos'
$flowId = [guid]'f8ef6d9d-c485-4f7d-9ed1-219ac47e5e25'
$flowName = 'Infleet - Sincronizar telemetria diária e eventos'
$infleetApiName = 'shared_new-5finfleet-20graphql-5f30e351431b40001e'
$infleetConnectorId = [guid]'06a37850-11ae-4b86-be90-dc38fe63e287'
$infleetConnectionId = 'd9bb02c9b9334ad29cfe08b44e66ca6c'
$infleetReferenceName = 'new_InfleetGraphQLDEV'
$dataverseReferenceName = 'new_sharedcommondataserviceforapps_5696d'
$dataverseConnectionKey = 'shared_commondataserviceforapps'
$templatePath = Join-Path (Split-Path $PSScriptRoot -Parent) 'power-platform\infleet\flow-definition.dev.json'

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

if (-not (Test-Path -LiteralPath $templatePath)) {
    throw "Template ausente: $templatePath"
}

$solutions = @((Invoke-Dataverse GET "solutions?`$select=solutionid&`$filter=uniquename eq '$solution'").value)
if ($solutions.Count -ne 1) {
    throw "Solucao $solution nao encontrada de forma unica no DEV."
}

$connector = @((Invoke-Dataverse GET "connectors?`$select=connectorid,name&`$filter=name eq 'new_5Finfleetgraphql'").value)
if ($connector.Count -ne 1 -or [guid]$connector[0].connectorid -ne $infleetConnectorId) {
    throw 'Conector Infleet DEV nao encontrado ou divergente.'
}

$dvReference = @((Invoke-Dataverse GET "connectionreferences?`$select=connectionreferenceid,connectionreferencelogicalname,connectionid,connectorid&`$filter=connectionreferencelogicalname eq '$dataverseReferenceName'").value)
if ($dvReference.Count -ne 1 -or [string]::IsNullOrWhiteSpace([string]$dvReference[0].connectionid)) {
    throw "Connection reference Dataverse invalida: $dataverseReferenceName"
}

$infleetReferences = @((Invoke-Dataverse GET "connectionreferences?`$select=connectionreferenceid,connectionreferencelogicalname,connectionid,connectorid,_customconnectorid_value&`$filter=connectionreferencelogicalname eq '$infleetReferenceName'").value)
if ($infleetReferences.Count -gt 1) {
    throw "Duplicidade de connection reference: $infleetReferenceName"
}

$referencePayload = @{
    connectionreferencelogicalname = $infleetReferenceName
    connectionreferencedisplayname = 'Infleet GraphQL DEV'
    connectorid = "/providers/Microsoft.PowerApps/apis/$infleetApiName"
    connectionid = $infleetConnectionId
    'CustomConnectorId@odata.bind' = "/connectors($infleetConnectorId)"
}

$referenceOperation = if ($infleetReferences.Count -eq 0) { 'CREATE' } else { 'UPDATE' }
Write-Host "[$referenceOperation] connection reference $infleetReferenceName"
if ($Apply) {
    if ($referenceOperation -eq 'CREATE') {
        $null = Invoke-Dataverse POST 'connectionreferences' $referencePayload
    } else {
        $null = Invoke-Dataverse PATCH "connectionreferences($($infleetReferences[0].connectionreferenceid))" $referencePayload
    }
}

$template = Get-Content -LiteralPath $templatePath -Raw -Encoding UTF8
$definitionJson = $template.Replace('__INFLEET_API_NAME__', $infleetApiName).
    Replace('__INFLEET_CONNECTION_REFERENCE__', $infleetReferenceName).
    Replace('__DATAVERSE_CONNECTION_REFERENCE__', $dataverseConnectionKey)
$definitionDocument = $definitionJson | ConvertFrom-Json

function Set-ConnectionReferenceNames {
    param($Actions)
    foreach ($property in $Actions.PSObject.Properties) {
        $action = $property.Value
        if ($action.type -eq 'OpenApiConnection' -and $action.inputs.host) {
            $referenceName = [string]$action.inputs.host.connectionName
            $action.inputs.host | Add-Member -NotePropertyName connectionReferenceName -NotePropertyValue $referenceName -Force
        }
        if ($action.actions) { Set-ConnectionReferenceNames $action.actions }
        if ($action.else.actions) { Set-ConnectionReferenceNames $action.else.actions }
    }
}

Set-ConnectionReferenceNames $definitionDocument.definition.actions

$clientData = @{
    properties = @{
        definition = $definitionDocument.definition
        connectionReferences = @{
            $infleetReferenceName = @{
                api = @{ name = $infleetApiName }
                connection = @{ connectionReferenceLogicalName = $infleetReferenceName }
                runtimeSource = 'embedded'
            }
            shared_commondataserviceforapps = @{
                api = @{ name = 'shared_commondataserviceforapps' }
                connection = @{ connectionReferenceLogicalName = $dataverseReferenceName }
                runtimeSource = 'embedded'
            }
        }
    }
    schemaVersion = '1.0.0.0'
}

$flowPayload = @{
    workflowid = $flowId
    name = $flowName
    category = 5
    type = 1
    primaryentity = 'none'
    description = 'Sincroniza 3 dias de telemetria e eventos relevantes da Infleet com upsert idempotente no Dataverse DEV.'
    clientdata = $clientData | ConvertTo-Json -Depth 100 -Compress
}

$existingFlows = @((Invoke-Dataverse GET "workflows?`$select=workflowid,name,statecode,statuscode&`$filter=workflowid eq $flowId").value)
if ($existingFlows.Count -gt 1) {
    throw "Duplicidade inesperada para workflowid $flowId"
}
$flowOperation = if ($existingFlows.Count -eq 0) { 'CREATE' } else { 'UPDATE' }
Write-Host "[$flowOperation] $flowName ($flowId)"

if ($Apply) {
    if ($flowOperation -eq 'CREATE') {
        $null = Invoke-Dataverse POST 'workflows' $flowPayload
    } else {
        $flowPayload.Remove('workflowid')
        $null = Invoke-Dataverse PATCH "workflows($flowId)" $flowPayload
    }

    if ($Activate) {
        $null = Invoke-Dataverse PATCH "workflows($flowId)" @{ statecode = 1; statuscode = 2 }
    }
}

$result = @{
    target = 'DEV'
    solution = $solution
    connectionReference = @{
        logicalName = $infleetReferenceName
        operation = $referenceOperation
        connectionId = $infleetConnectionId
    }
    flow = @{
        id = $flowId
        name = $flowName
        operation = $flowOperation
        activated = [bool]($Apply -and $Activate)
    }
    applied = [bool]$Apply
}

$result | ConvertTo-Json -Depth 6
