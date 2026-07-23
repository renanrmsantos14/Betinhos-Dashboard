# Arquitetura Infleet

`Infleet GraphQL → Power Automate solution-aware → Dataverse → Dashboard`

- Sincronização diária reconcilia os últimos 3 dias.
- `vehiclesSummaries` e `dailyWorkMeasures` fornecem agregados diários em lote.
- `listEvents` mantém detalhes dos eventos; ID Infleet é a chave idempotente.
- `trips` fornece consumo e motorista por viagem; ID Infleet é a chave idempotente.
- Placa é a identidade de integração do veículo. Vínculo motorista-veículo é temporal, nunca permanente.
- Dashboard lê somente Dataverse e snapshot; credencial Infleet fica na conexão segura.
