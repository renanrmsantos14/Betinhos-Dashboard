# Integração Infleet — DEV

Componentes destinados exclusivamente ao ambiente `App Betinhos Dev` e à solução `AppBetinhos`.

## Regras

- Não execute contra Default ou PROD.
- Não salve o Bearer token em arquivos, logs ou histórico do terminal.
- Rode primeiro os testes locais e o provisionador sem `-Apply`.
- O provisionador é idempotente: componentes compatíveis são ignorados; conflitos de tipo interrompem a execução.

## Validação local

```powershell
npm run test:infleet-schema
```

## Provisionamento

O script exige um token Dataverse DEV fornecido somente em memória:

```powershell
./scripts/provision-infleet-dev.ps1 -AccessToken $token
./scripts/provision-infleet-dev.ps1 -AccessToken $token -Apply
```

O modo padrão é leitura/dry-run. `-Apply` cria apenas componentes ausentes na solução `AppBetinhos`.
