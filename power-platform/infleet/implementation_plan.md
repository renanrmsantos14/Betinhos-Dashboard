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
