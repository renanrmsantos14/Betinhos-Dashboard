# Plano de implementação Infleet — DEV

## Assumptions

- Alvo exclusivo: ambiente DEV, solução `AppBetinhos`.
- Veículos são relacionados somente pela placa normalizada.
- Funcionários são relacionados por `Infleet Driver ID` ou CPF normalizado; conflito nunca é escolhido automaticamente.
- Manutenção, multas e abastecimentos cadastrados no Dataverse continuam como fontes oficiais.
- Webhook fica fora desta entrega: exige URL pública estável e definição de retenção de posições.

## Mudanças

- `[MODIFY] schema.dev.json`: métricas agregadas e tabela idempotente de viagens.
- `[MODIFY] flow-definition.dev.json`: consultas em lote, odômetro, consumo e viagens.
- `[MODIFY] provision-infleet-dev.ps1`: publicação dinâmica das tabelas do manifesto.
- `[MODIFY] Dashboard.html`: consumo real, ociosidade, odômetro e eventos sem limite fictício.
- `[MODIFY] export-prod-snapshot.ps1`: contrato de snapshot das novas colunas/tabela.
- `[MODIFY] test-infleet-*.mjs`: contratos de schema, fluxo e dashboard.
- `[UPDATE] README.md` e `system_architecture.md`: arquitetura e operação.

## Verificação

1. Manifesto e definição do fluxo parseiam.
2. Testes Infleet passam.
3. Provisionamento DEV é idempotente.
4. Fluxo executa com sucesso e mantém chaves únicas.
5. Viagens possuem lookups de veículo e, quando resolvido, motorista.
6. Dashboard carrega novos dados sem chamar Infleet diretamente.

## Completion cycle - 2026-07-23

User-approved scope: items 1, 2, 3 and 5.

- [MODIFY] `flow-definition.dev.json`: complete InFleet pagination, real partial-failure status, and safe unmapped-driver diagnostics.
- [MODIFY] `Dashboard.html`: integration health, km trend, stale vehicles and pending-mapping count; preserve staged fleet filter.
- [NEW] `scripts/validate-infleet-dev.ps1`: read-only audit of volume, duplicates, freshness and pending mappings; no CPF, token or raw payload.
- [NEW] `scripts/test-infleet-flow-definition.mjs`: pagination, failure and secret-protection contracts.
- [MODIFY] dashboard/schema tests and `package.json`: align signature and expose a single `test:infleet` gate.
- [NEW] `power-platform/infleet/VALIDATION.md`: reproducible non-PII evidence.

Acceptance:

1. Never map a driver by name; only unique InFleet Driver ID or normalized CPF.
2. Partial telemetry failure ends the flow as failed with actionable diagnostics.
3. No one-page fixed limit silently drops InFleet data.
4. InFleet tests and dashboard build contracts pass.

## Documentation audit and driver reconciliation - 2026-07-23

- [MODIFY] `Dashboard.html`: expose pending driver identities returned by InFleet, including Driver ID and event/trip counts.
- [MODIFY] `scripts/validate-infleet-dev.ps1`: include the same privacy-safe reconciliation queue in DEV evidence.
- [MODIFY] `scripts/test-infleet-dashboard.mjs`: protect the new fields and UI contracts.
- [NEW] `power-platform/infleet/API_CAPABILITY_MAP.md`: map official queries to current and future dashboard capabilities.
- [MODIFY] `power-platform/infleet/flow-definition.dev.json`: fix the observable daily telemetry failure after runtime evidence is confirmed.

Acceptance:

1. No mapping by name.
2. Every `NAO_ENCONTRADO` driver exposes an InFleet Driver ID when the API supplied one.
3. The flow completes successfully after publication.
4. No duplicate InFleet event/trip IDs.
5. Dashboard build and TV compatibility gates pass.
