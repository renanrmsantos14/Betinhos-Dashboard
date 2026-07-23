# Validacao InFleet - DEV

## Gates locais

```powershell
npm run test:infleet
npm run build
npm run test:tv
npm run test:tv-compat
```

`test:infleet` valida schema, fluxo e contrato do dashboard. O fluxo deve paginar motoristas, historico e eventos; se a telemetria falhar, deve terminar como falha e nao iniciar viagens. A consulta de veiculos bloqueia em vez de truncar quando atingir 1.000 itens, pois a especificacao atual do conector ainda nao confirmou cursor para esse endpoint.

## Evidencia no ambiente DEV

Use um token Dataverse apenas em memoria. O script e somente leitura, nao imprime token, CPF, nome ou chave tecnica.

```powershell
./scripts/validate-infleet-dev.ps1 -AccessToken $token
```

Confirme no JSON:

- `ultimaSincronizacaoUtc` recente.
- `idsInfleetDuplicados` igual a zero para eventos e viagens.
- `mapeamentoMotorista` com queda de `NAO_ENCONTRADO` apos cadastrar o InFleet Driver ID ou CPF normalizado no cadastro do motorista.

## Regra de seguranca para motorista

O fluxo so associa motorista usando InFleet Driver ID ou CPF normalizado. Nome recebido da InFleet e diagnostico, nunca chave de associacao. Registros sem identificador confiavel permanecem como `NAO_ENCONTRADO` ou `SEM_MOTORISTA` para correcao cadastral.
