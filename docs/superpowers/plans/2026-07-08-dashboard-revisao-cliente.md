# Dashboard Revisao Cliente Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar no `Dashboard.html` as revisoes do cliente Elia que sao executaveis sem inventar schema Dataverse.

**Architecture:** Manter o dashboard single-file. Ajustar calculos no pipeline existente (`renderAll`) e reaproveitar componentes atuais de KPI, tabela e Chart.js. Itens que precisam campo Dataverse ausente ficam documentados como pendencia operacional.

**Tech Stack:** HTML unico, CSS inline, JavaScript inline, Chart.js CDN, Dataverse Web API.

---

## Fonte

- DOCX: `C:\Users\mendo\Downloads\REVISAO DO DASHBOARD.docx`
- Copia local: `.codex-artifacts/revisao-dashboard.docx`
- Texto extraido: 60 itens, cobrindo abas Resumo, Servicos, Faturamento, Pagamentos, Frota e Multas.

## Escopo Executavel Agora

### Task 1: Resumo - corrigir A Receber e criar Recebimento

**Files:**
- Modify: `Dashboard.html`

- [x] Adicionar helper de periodo anual para ocultar comparativo `LM` quando o filtro cobre ano inteiro ou periodo longo.
- [x] Calcular `A receber` somente sobre servicos produzidos/concluidos, nao sobre pendentes/programados.
- [x] Incluir no `A receber` a projecao dos concluidos sem valor: `qtd sem valor * ticket medio do periodo`.
- [x] Criar KPI `Recebimento` com formula: `recebido vinculado a OP produzida / (produzido concluido com valor + potencial sem valor)`.
- [x] Manter `Sem valor` como esta, mas preservar potencial calculado.
- [x] Remover o alerta duplicado `A receber` abaixo dos KPIs, mantendo apenas o KPI executivo principal.
- [x] Manter CNH, Multas e Total Produzido.
- [x] Explicar no proprio alerta que `Sem preco` conta servicos sem tabela/preco vinculado e `Sem OP` conta servicos sem financeiro/OP vinculado.
- [x] Explicar `Multas` pendentes como pendentes/indicadas no status do alerta.
- [x] Limitar calculo de `Sem motorista` e `Sem cliente` a servicos a partir de `2026-04-01`.

### Task 2: Resumo - ajustar formatos solicitados

**Files:**
- Modify: `Dashboard.html`

- [x] Trocar `Meta x Realizado` para resumo em formato `Meta [R$] | Alcancado [R$] | Participacao`.
- [x] Trocar `Status dos Servicos` para tabela compacta `Status | Qt de servicos | Participacao`, acumulando top 90%.
- [x] Trocar `Top Clientes - Faturamento` para tabela compacta com top 90%.
- [x] Garantir label de ticket medio visivel no grafico.

### Task 3: Servicos e Faturamento

**Files:**
- Modify: `Dashboard.html`

- [x] Otimizar os 7 cards da aba Servicos em 2 cards densos: operacional e financeiro.
- [x] Recalcular `Pendentes/Prog.` separando pendente/programado de aprovado/concluido.
- [x] Ajustar graficos `Total de Servicos por Tipo` e `Por tipo de veiculo` para tabela comparativa com `Destino | % sob QT | % sob R$ | Participacao`.
- [x] Em `Faturamento por cliente`, incluir percentual de quantidade de servicos junto da quantidade.

### Task 4: Pagamentos

**Files:**
- Modify: `Dashboard.html`

- [x] Remover card `Registros`.
- [x] Remover tabela `Registros de pagamento`.
- [x] Criar card `Cartao` usando `cr40f_formadepagamento` quando contiver `cartao`, `cartao de credito`, `link` ou `maquina`.
- [x] Manter `A receber` usando o mesmo calculo corrigido do Resumo.
- [x] Mostrar card informativo `Tempo de pagamento` como pendente de schema, sem inventar data de pagamento.

### Task 5: Frota e Multas

**Files:**
- Modify: `Dashboard.html`

- [x] Na aba Frota, remover cards atuais e criar cards por categoria de manutencao: preventiva programada, preventiva por condicao, corretiva nao critica, corretiva critica, conservacao, avaria.
- [x] Criar tabela de KPIs de manutencao com metas mensais e limites anuais do DOCX.
- [x] Na aba Multas, manter cards atuais e adicionar grafico/tabela por tipo quando houver campo; sem campo, usar status como fallback visivel.

## Pendencias Fora do Escopo Seguro

- `Tempo de pagamento por cliente`: falta campo de data de pagamento ou data de vencimento no fetch atual.
- `Tipo de multa`: fetch atual de multas traz data, status, motorista e placa; nao traz campo de tipo/infracao.
- `Preventiva programada em ate 10 dias da solicitacao`: fetch atual de manutencoes traz data de manutencao, valor, status, tipo e veiculo; nao traz data de solicitacao.
- Reuniao com Juliana sobre KPIs de Pagamentos: acao de negocio, nao alteracao tecnica.

## Verification

- [x] `node --check` em script extraido do HTML.
- [x] `npm run build`.
- [x] Abrir HTML em navegador local com stub de Chart.js e checar console/abas alteradas.
