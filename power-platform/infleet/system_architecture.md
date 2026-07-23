# Arquitetura Infleet

`Infleet GraphQL → Power Automate solution-aware → Dataverse → Dashboard`

- Sincronização diária reconcilia os últimos 3 dias.
- `vehiclesSummaries` e `dailyWorkMeasures` fornecem agregados diários em lote.
- `listEvents` mantém detalhes dos eventos; ID Infleet é a chave idempotente.
- `trips` fornece consumo e motorista por viagem; ID Infleet é a chave idempotente.
- Placa é a identidade de integração do veículo. Vínculo motorista-veículo é temporal, nunca permanente.
- Dashboard lê somente Dataverse e snapshot; credencial Infleet fica na conexão segura.

## Confiabilidade operacional

- Motoristas sao associados somente por InFleet Driver ID ou CPF normalizado; nome e apenas diagnostico.
- Motoristas, historico e eventos usam pagina de 500 itens ate nao haver mais resultados.
- A lista de veiculos interrompe o fluxo ao atingir 1.000 itens enquanto o cursor desse endpoint nao estiver confirmado, evitando truncamento silencioso.
- Falha na telemetria diaria encerra a execucao como falha e impede a sincronizacao de viagens naquele ciclo.
- O dashboard mostra cobertura da frota, pendencias de mapeamento e tendencia diaria de quilometragem a partir do Dataverse.
