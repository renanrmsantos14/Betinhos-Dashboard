# Mapa de capacidades da API InFleet

Fonte oficial: [documentacao GraphQL InFleet](https://docs.api.infleet.com.br/boas-vindas). Endpoint oficial: `https://api.infleet.com.br/v1/graphql`.

## Diagnostico de motoristas

O tipo [`Driver`](https://docs.api.infleet.com.br/types/driver) possui `id` obrigatorio, `name` obrigatorio e `cpf` opcional. A consulta [`listDriversPaginated`](https://docs.api.infleet.com.br/queries/listdriverspaginated) suporta `limit` e `offset`; [`listDriversWithCursor`](https://docs.api.infleet.com.br/queries/listdriverswithcursor) oferece `edges`, `pageInfo` e `totalCount`.

No DEV, os cinco motoristas pendentes retornaram `id` e CPF pela API. A pendencia ocorre porque:

- tres existem no Dataverse, mas o CPF cadastrado difere do CPF da InFleet;
- dois nao possuem registro correspondente na tabela de funcionarios;
- associacao por nome continua proibida por risco de homonimo.

## Capacidades adotadas

| Dominio | Queries | Uso |
| --- | --- | --- |
| Identidade | `listDriversPaginated`, `getDriver`, `getDriverAtByVehicleId`, `listVehicleDriverHistories` | conciliacao por Driver ID/CPF e motorista no instante do evento |
| Frota | `listVehicles`, `vehiclesSummaries`, `dailyWorkMeasures` | cadastro tecnico, telemetria diaria, odometro e utilizacao |
| Eventos | `listEvents` | eventos de risco, velocidade, geofence e motorista |
| Viagens | `trips` | distancia, velocidade, combustivel e motorista |

## Proxima camada recomendada

| Prioridade | Dominio | Queries oficiais | Resultado no dashboard |
| --- | --- | --- | --- |
| P1 | Paginacao resiliente | `listDriversWithCursor`, `listEventsWithCursor` | cursor explicito, `hasNextPage` e contagem total |
| P1 | Ranking de conducao | `driversRanking`, `dailyVehicleEventSummary`, `monthlyVehicleEventSummary` | score por motorista e tendencia de risco |
| P1 | Combustivel | `listFuellings`, `getFuellingsSummary`, `trips` | consumo abastecido x OBD, custo/km e divergencias |
| P1 | Manutencao | `listMaintenances`, `listMaintenanceTasks`, `maintenanceReminders`, `getVehiclesMtbf`, `getVehiclesMttr` | manutencoes InFleet, atrasos, MTBF e MTTR |
| P2 | Posicao e rota | `listVehiclePositions`, `getVehiclePositionsWithRouteDetails`, `routeVehicleDetails` | ultima posicao e auditoria de rota sob demanda |
| P2 | Ocorrencias | `listVehicleIssues`, `listOccurrencesWithCursor`, `listInvalidEvents` | falhas de veiculo e eventos rejeitados |
| P2 | Jornada | `totalDistance`, `totalTimeIdle`, `totalTimeStopped`, `totalTimeWithIgnitionOn`, `monthlyVehiclesIdle` | produtividade e ociosidade consolidadas |
| P2 | CAN/RPM | `getVehicleCanData`, `getVehicleMeasurements`, `rpmGreenLaneMonthlyTrend`, `rpmLaneUsage` | saude mecanica e uso de faixa de RPM |
| P2 | Compliance | `listTrafficInfractions`, `getTrafficInfractionSummary` | multas e infracoes originadas na InFleet |
| P3 | Checklist | `listChecklistSubmissions`, `listChecklistIssues` | nao conformidades de checklist |
| P3 | Tempo real | `createWebhook`, `listWebhooks`, subscriptions `vehicleMoved` e `vehicleChanged` | atualizacao orientada a evento; exige endpoint receptor seguro |

## Regras de arquitetura

- Dashboard nunca chama a InFleet diretamente; le somente Dataverse/snapshot.
- Bearer token permanece na connection reference do conector customizado.
- Toda carga usa chave idempotente da InFleet e pagina ate o fim.
- Mutations que alteram dados na InFleet nao entram no fluxo de leitura sem aprovacao operacional especifica.
- Dados pessoais nao sao exibidos: CPF serve apenas para conciliacao exata.
- Posicoes e rotas detalhadas devem ser carregadas sob demanda, nao em sincronizacao massiva.
