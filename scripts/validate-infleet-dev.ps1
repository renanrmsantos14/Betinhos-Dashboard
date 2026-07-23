[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string]$AccessToken,
    [string]$EnvironmentUrl = 'https://org23b93544.crm2.dynamics.com/'
)

$ErrorActionPreference = 'Stop'
$baseUrl = "$($EnvironmentUrl.TrimEnd('/'))/api/data/v9.2"
$headers = @{ Authorization = "Bearer $AccessToken"; Accept = 'application/json' }

function Get-DataverseRows {
    param([Parameter(Mandatory)][string]$Query)

    $nextLink = "$baseUrl/$Query"
    $rows = [System.Collections.Generic.List[object]]::new()
    while ($nextLink) {
        $response = Invoke-RestMethod -Method Get -Uri $nextLink -Headers $headers
        foreach ($row in @($response.value)) { [void]$rows.Add($row) }
        $nextLink = $response.'@odata.nextLink'
    }
    return $rows.ToArray()
}

function Get-StatusCounts {
    param([object[]]$Rows)

    $Rows |
        Group-Object { if ($_.new_statusmapeamentomotorista) { $_.new_statusmapeamentomotorista } else { 'SEM_MOTORISTA' } } |
        Sort-Object Name |
        ForEach-Object { [pscustomobject]@{ status = $_.Name; quantidade = $_.Count } }
}

$daily = Get-DataverseRows 'new_telemetriadiariainfleets?$select=new_data,new_sincronizadoem,new_telemetriadiariainfleetid'
$events = Get-DataverseRows 'new_eventoinfleets?$select=new_infleeteventid,new_statusmapeamentomotorista'
$trips = Get-DataverseRows 'new_viageminfleets?$select=new_infleettripid,new_statusmapeamentomotorista'

$duplicateEvents = @($events | Where-Object { $_.new_infleeteventid } | Group-Object new_infleeteventid | Where-Object Count -gt 1).Count
$duplicateTrips = @($trips | Where-Object { $_.new_infleettripid } | Group-Object new_infleettripid | Where-Object Count -gt 1).Count
$latestSync = @($daily | Where-Object new_sincronizadoem | ForEach-Object { [datetime]$_.new_sincronizadoem } | Sort-Object -Descending | Select-Object -First 1)

[pscustomobject]@{
    ambiente = $EnvironmentUrl.TrimEnd('/')
    validadoEm = (Get-Date).ToUniversalTime().ToString('o')
    telemetriaDiaria = [pscustomobject]@{
        quantidade = $daily.Count
        ultimaSincronizacaoUtc = if ($latestSync.Count) { $latestSync[0].ToUniversalTime().ToString('o') } else { $null }
    }
    eventos = [pscustomobject]@{
        quantidade = $events.Count
        mapeamentoMotorista = @(Get-StatusCounts $events)
        idsInfleetDuplicados = $duplicateEvents
    }
    viagens = [pscustomobject]@{
        quantidade = $trips.Count
        mapeamentoMotorista = @(Get-StatusCounts $trips)
        idsInfleetDuplicados = $duplicateTrips
    }
} | ConvertTo-Json -Depth 6
