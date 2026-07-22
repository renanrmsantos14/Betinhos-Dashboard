[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$AccessToken,

    [switch]$Apply
)

$ErrorActionPreference = 'Stop'
$script:ManifestPath = Join-Path $PSScriptRoot '..\power-platform\infleet\schema.dev.json'
$script:Schema = Get-Content -LiteralPath $script:ManifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
$script:OrgUrl = ([string]$script:Schema.target.orgUrl).TrimEnd('/')
$script:Solution = [string]$script:Schema.target.solutionUniqueName
$script:Headers = @{
    Authorization = "Bearer $AccessToken"
    Accept = 'application/json'
    'Content-Type' = 'application/json; charset=utf-8'
    'MSCRM.SolutionUniqueName' = $script:Solution
}
$script:Planned = New-Object System.Collections.Generic.List[string]
$script:Changed = New-Object System.Collections.Generic.List[string]

if ($script:OrgUrl -ne 'https://org23b93544.crm2.dynamics.com') {
    throw "Destino bloqueado: $script:OrgUrl"
}
if ($script:Solution -ne 'AppBetinhos') {
    throw "Solução bloqueada: $script:Solution"
}

function ConvertTo-DvJson {
    param([Parameter(Mandatory = $true)]$Value)
    return $Value | ConvertTo-Json -Depth 30 -Compress
}

function Invoke-Dv {
    param(
        [Parameter(Mandatory = $true)][ValidateSet('GET', 'POST')][string]$Method,
        [Parameter(Mandatory = $true)][string]$Path,
        $Body
    )

    $params = @{
        Method = $Method
        Uri = "$script:OrgUrl/api/data/v9.2/$Path"
        Headers = $script:Headers
    }
    if ($null -ne $Body) {
        $params.Body = ConvertTo-DvJson $Body
    }
    return Invoke-RestMethod @params
}

function New-Label {
    param([Parameter(Mandatory = $true)][string]$Text)
    return @{
        '@odata.type' = 'Microsoft.Dynamics.CRM.Label'
        LocalizedLabels = @(
            @{
                '@odata.type' = 'Microsoft.Dynamics.CRM.LocalizedLabel'
                Label = $Text
                LanguageCode = 1046
            }
        )
    }
}

function Get-EntityMetadata {
    param([Parameter(Mandatory = $true)][string]$LogicalName)
    $encoded = [uri]::EscapeDataString("LogicalName eq '$LogicalName'")
    $response = Invoke-Dv -Method GET -Path "EntityDefinitions?`$select=MetadataId,LogicalName,SchemaName,EntitySetName&`$filter=$encoded"
    return @($response.value) | Select-Object -First 1
}

function Get-AttributeMetadata {
    param(
        [Parameter(Mandatory = $true)][string]$TableLogicalName,
        [Parameter(Mandatory = $true)][string]$LogicalName
    )
    $encoded = [uri]::EscapeDataString("LogicalName eq '$LogicalName'")
    $response = Invoke-Dv -Method GET -Path "EntityDefinitions(LogicalName='$TableLogicalName')/Attributes?`$select=MetadataId,LogicalName,SchemaName,AttributeType&`$filter=$encoded"
    return @($response.value) | Select-Object -First 1
}

function Add-PlannedChange {
    param([Parameter(Mandatory = $true)][string]$Description)
    $script:Planned.Add($Description)
    Write-Host "[PLANEJADO] $Description"
}

function Invoke-Create {
    param(
        [Parameter(Mandatory = $true)][string]$Description,
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)]$Body
    )
    Add-PlannedChange $Description
    if (-not $Apply) { return }
    $null = Invoke-Dv -Method POST -Path $Path -Body $Body
    $script:Changed.Add($Description)
    Write-Host "[CRIADO] $Description"
}

function Get-RequiredLevel {
    param([bool]$Required)
    return @{
        '@odata.type' = 'Microsoft.Dynamics.CRM.AttributeRequiredLevelManagedProperty'
        Value = $(if ($Required) { 'ApplicationRequired' } else { 'None' })
    }
}

function New-AttributePayload {
    param([Parameter(Mandatory = $true)]$Column)

    $common = @{
        SchemaName = [string]$Column.schemaName
        DisplayName = New-Label ([string]$Column.displayName)
        RequiredLevel = Get-RequiredLevel ([bool]$Column.required)
    }

    switch ([string]$Column.type) {
        'string' {
            return $common + @{
                '@odata.type' = 'Microsoft.Dynamics.CRM.StringAttributeMetadata'
                MaxLength = [int]$Column.maxLength
                FormatName = @{ Value = 'Text' }
            }
        }
        'integer' {
            return $common + @{
                '@odata.type' = 'Microsoft.Dynamics.CRM.IntegerAttributeMetadata'
                MinValue = -2147483648
                MaxValue = 2147483647
                Format = 'None'
            }
        }
        'decimal' {
            return $common + @{
                '@odata.type' = 'Microsoft.Dynamics.CRM.DecimalAttributeMetadata'
                MinValue = -100000000000
                MaxValue = 100000000000
                Precision = [int]$Column.precision
            }
        }
        'money' {
            return $common + @{
                '@odata.type' = 'Microsoft.Dynamics.CRM.MoneyAttributeMetadata'
                MinValue = 0
                MaxValue = 922337203685477
                Precision = [int]$Column.precision
                PrecisionSource = 0
            }
        }
        'boolean' {
            return $common + @{
                '@odata.type' = 'Microsoft.Dynamics.CRM.BooleanAttributeMetadata'
                DefaultValue = $false
                OptionSet = @{
                    '@odata.type' = 'Microsoft.Dynamics.CRM.BooleanOptionSetMetadata'
                    TrueOption = @{ Value = 1; Label = New-Label 'Sim' }
                    FalseOption = @{ Value = 0; Label = New-Label 'Não' }
                }
            }
        }
        'date' {
            return $common + @{
                '@odata.type' = 'Microsoft.Dynamics.CRM.DateTimeAttributeMetadata'
                Format = 'DateOnly'
                DateTimeBehavior = @{ Value = 'DateOnly' }
            }
        }
        'datetime' {
            return $common + @{
                '@odata.type' = 'Microsoft.Dynamics.CRM.DateTimeAttributeMetadata'
                Format = 'DateAndTime'
                DateTimeBehavior = @{ Value = 'UserLocal' }
            }
        }
        default { throw "Tipo não suportado: $($Column.type)" }
    }
}

function Test-AttributeCompatibility {
    param($Existing, $Column, [string]$TableLogicalName)
    $expected = switch ([string]$Column.type) {
        'string' { 'String' }
        'integer' { 'Integer' }
        'decimal' { 'Decimal' }
        'money' { 'Money' }
        'boolean' { 'Boolean' }
        'date' { 'DateTime' }
        'datetime' { 'DateTime' }
    }
    if ([string]$Existing.AttributeType -ne $expected) {
        throw "$TableLogicalName.$($Column.logicalName): tipo existente '$($Existing.AttributeType)' difere de '$expected'."
    }
}

function Ensure-Attribute {
    param(
        [Parameter(Mandatory = $true)][string]$TableLogicalName,
        [Parameter(Mandatory = $true)]$Column
    )
    $existing = Get-AttributeMetadata -TableLogicalName $TableLogicalName -LogicalName ([string]$Column.logicalName)
    if ($existing) {
        Test-AttributeCompatibility -Existing $existing -Column $Column -TableLogicalName $TableLogicalName
        Write-Host "[OK] $TableLogicalName.$($Column.logicalName)"
        return
    }
    Invoke-Create -Description "coluna $TableLogicalName.$($Column.logicalName)" -Path "EntityDefinitions(LogicalName='$TableLogicalName')/Attributes" -Body (New-AttributePayload $Column)
}

function Ensure-Entity {
    param(
        [Parameter(Mandatory = $true)][string]$LogicalName,
        [Parameter(Mandatory = $true)]$Table
    )
    $existing = Get-EntityMetadata -LogicalName $LogicalName
    if ($existing) {
        if ([string]$existing.EntitySetName -ne [string]$Table.entitySetName) {
            throw "${LogicalName}: EntitySetName incompatível '$($existing.EntitySetName)'."
        }
        Write-Host "[OK] tabela $LogicalName"
        return $existing
    }

    $body = @{
        '@odata.type' = 'Microsoft.Dynamics.CRM.EntityMetadata'
        SchemaName = [string]$Table.schemaName
        EntitySetName = [string]$Table.entitySetName
        DisplayName = New-Label ([string]$Table.displayName)
        DisplayCollectionName = New-Label ([string]$Table.displayCollectionName)
        Description = New-Label 'Dados sincronizados da plataforma Infleet para uso no Dashboard Betinhos.'
        OwnershipType = 'UserOwned'
        IsActivity = $false
        HasActivities = $false
        HasNotes = $false
        PrimaryNameAttribute = [string]$Table.primaryName
        Attributes = @(
            @{
                '@odata.type' = 'Microsoft.Dynamics.CRM.StringAttributeMetadata'
                SchemaName = [string]$Table.primaryNameSchema
                DisplayName = New-Label 'Nome'
                RequiredLevel = Get-RequiredLevel $true
                MaxLength = 300
                FormatName = @{ Value = 'Text' }
                IsPrimaryName = $true
            }
        )
    }
    Invoke-Create -Description "tabela $LogicalName" -Path 'EntityDefinitions' -Body $body
    if ($Apply) { return Get-EntityMetadata -LogicalName $LogicalName }
    return $null
}

function Ensure-Lookup {
    param(
        [Parameter(Mandatory = $true)][string]$ReferencingTable,
        [Parameter(Mandatory = $true)][string]$LookupLogicalName,
        [Parameter(Mandatory = $true)]$Lookup
    )
    $existing = Get-AttributeMetadata -TableLogicalName $ReferencingTable -LogicalName $LookupLogicalName
    if ($existing) {
        if ([string]$existing.AttributeType -ne 'Lookup') {
            throw "$ReferencingTable.$LookupLogicalName existe e não é lookup."
        }
        Write-Host "[OK] lookup $ReferencingTable.$LookupLogicalName"
        return
    }

    $body = @{
        '@odata.type' = 'Microsoft.Dynamics.CRM.OneToManyRelationshipMetadata'
        SchemaName = [string]$Lookup.relationshipSchemaName
        ReferencedEntity = [string]$Lookup.target
        ReferencingEntity = $ReferencingTable
        AssociatedMenuConfiguration = @{ Behavior = 'UseCollectionName'; Group = 'Details'; Order = 10000 }
        CascadeConfiguration = @{
            Assign = 'NoCascade'; Delete = 'RemoveLink'; Merge = 'NoCascade'; Reparent = 'NoCascade'
            Share = 'NoCascade'; Unshare = 'NoCascade'; RollupView = 'NoCascade'
        }
        Lookup = @{
            '@odata.type' = 'Microsoft.Dynamics.CRM.LookupAttributeMetadata'
            SchemaName = [string]$Lookup.schemaName
            DisplayName = New-Label ([string]$Lookup.displayName)
            RequiredLevel = Get-RequiredLevel ([bool]$Lookup.required)
        }
    }
    Invoke-Create -Description "lookup $ReferencingTable.$LookupLogicalName -> $($Lookup.target)" -Path 'RelationshipDefinitions' -Body $body
}

function Ensure-AlternateKey {
    param(
        [Parameter(Mandatory = $true)][string]$TableLogicalName,
        [Parameter(Mandatory = $true)][string]$SchemaName,
        [Parameter(Mandatory = $true)][string[]]$Columns
    )
    $encoded = [uri]::EscapeDataString("SchemaName eq '$SchemaName'")
    $response = Invoke-Dv -Method GET -Path "EntityDefinitions(LogicalName='$TableLogicalName')/Keys?`$select=SchemaName,KeyAttributes&`$filter=$encoded"
    $existing = @($response.value) | Select-Object -First 1
    if ($existing) {
        $actual = @($existing.KeyAttributes | Sort-Object)
        $expected = @($Columns | Sort-Object)
        if (($actual -join '|') -ne ($expected -join '|')) {
            throw "$TableLogicalName/${SchemaName}: colunas da chave incompatíveis."
        }
        Write-Host "[OK] chave $TableLogicalName/$SchemaName"
        return
    }
    $body = @{
        '@odata.type' = 'Microsoft.Dynamics.CRM.EntityKeyMetadata'
        SchemaName = $SchemaName
        DisplayName = New-Label $SchemaName
        KeyAttributes = @($Columns)
    }
    Invoke-Create -Description "chave $TableLogicalName/$SchemaName" -Path "EntityDefinitions(LogicalName='$TableLogicalName')/Keys" -Body $body
}

Write-Host "Destino confirmado: $script:OrgUrl | solução $script:Solution | Apply=$Apply"

foreach ($tableProperty in $script:Schema.existingTables.PSObject.Properties) {
    $tableName = [string]$tableProperty.Name
    if (-not (Get-EntityMetadata -LogicalName $tableName)) { throw "Tabela existente não encontrada: $tableName" }
    foreach ($column in $tableProperty.Value.columns) {
        Ensure-Attribute -TableLogicalName $tableName -Column $column
    }
    foreach ($key in $tableProperty.Value.alternateKeys) {
        Ensure-AlternateKey -TableLogicalName $tableName -SchemaName ([string]$key.schemaName) -Columns @($key.columns)
    }
}

foreach ($tableProperty in $script:Schema.tables.PSObject.Properties) {
    $tableName = [string]$tableProperty.Name
    $table = $tableProperty.Value
    $null = Ensure-Entity -LogicalName $tableName -Table $table
    if (-not $Apply -and -not (Get-EntityMetadata -LogicalName $tableName)) {
        Write-Host "[ADIADO] colunas/lookups/chave de $tableName dependem da criação da tabela."
        continue
    }
    foreach ($column in $table.columns) {
        Ensure-Attribute -TableLogicalName $tableName -Column $column
    }
    foreach ($lookupProperty in $table.lookups.PSObject.Properties) {
        Ensure-Lookup -ReferencingTable $tableName -LookupLogicalName ([string]$lookupProperty.Name) -Lookup $lookupProperty.Value
    }
    Ensure-AlternateKey -TableLogicalName $tableName -SchemaName ([string]$table.alternateKeySchema) -Columns @($table.alternateKey)
}

if ($Apply -and $script:Changed.Count -gt 0) {
    $publishXml = '<importexportxml><entities><entity>cr40f_veiculos</entity><entity>cr40f_funcionarios</entity><entity>new_telemetriadiariainfleet</entity><entity>new_eventoinfleet</entity></entities></importexportxml>'
    $null = Invoke-Dv -Method POST -Path 'PublishXml' -Body @{ ParameterXml = $publishXml }
    Write-Host '[PUBLICADO] metadados Infleet'
}

[pscustomobject]@{
    mode = $(if ($Apply) { 'apply' } else { 'dry-run' })
    planned = $script:Planned.Count
    changed = $script:Changed.Count
    target = $script:OrgUrl
    solution = $script:Solution
} | ConvertTo-Json -Compress
