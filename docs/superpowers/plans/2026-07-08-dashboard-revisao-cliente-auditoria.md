# Auditoria - Revisao do Dashboard

Fonte revisada em `2026-07-08`: `C:\Users\mendo\Downloads\REVISÃO DO DASHBOARD.docx`.

## Status Geral

- Atendido no HTML: requisitos executaveis de layout, calculo e tabelas.
- Atendido com limite declarado: itens que dependem de campo Dataverse ausente.
- Nao validado: numeros reais em Dataverse/producao.

## Resumo

- [x] KPI `Recebimento`: criado como percentual de recebido sobre base produzida ajustada.
- [x] Historico 2025: mantido via dados historicos hardcoded existentes.
- [x] Filtros: mantidos.
- [x] LM em filtro anual/todos os anos: ocultado para periodos acima de 62 dias.
- [x] `A receber`: corrigido para servicos produzidos/concluidos nao recebidos, somando projecao de `Sem valor`.
- [x] `A receber` duplicado abaixo dos KPIs: removido.
- [x] `Sem valor`: mantido com potencial.
- [x] CNH, Multas e Total Produzido: mantidos.
- [x] Multas pendentes: alerta explicita pendente/indicada.
- [x] `Sem preco`: alerta explicita servico sem tabela/preco vinculado.
- [x] `Sem OP`: alerta explicita servico sem financeiro/OP vinculado.
- [x] `Sem motorista` e `Sem cliente`: contam apenas a partir de `2026-04-01`.
- [x] `Meta x Realizado`: formato `Meta [R$] | Alcancado [R$] | Participacao`.
- [x] `Ticket Medio Mensal`: valor visivel junto ao grafico.
- [x] `Status dos Servicos` e `Top Clientes`: formato tabela, cortando top 90%.

## Servicos

- [x] Sete cards otimizados em dois cards densos.
- [x] `Pendentes/Prog.` recalculado sem misturar aprovado/concluido.
- [x] `Total de Servicos por Tipo`: tabela `Destino | % sob QT | % sob R$ | Participacao`.
- [x] `Por tipo de veiculo`: tabela `Destino | % sob QT | % sob R$ | Participacao`.
- [x] Card de passageiros: nao recriado porque o fetch atual nao traz passageiro.

## Faturamento

- [x] Cards mantidos em formato compacto.
- [x] Tabela por cliente inclui percentual da quantidade de servicos.
- [x] Pendentes passam pelo mesmo filtro corrigido de produzido/recebido.

## Pagamentos

- [x] Card `Cartao`: criado por forma de pagamento contendo cartao/credito/link/maquina.
- [x] `A receber`: usa o calculo corrigido do Resumo.
- [x] Card `Registros`: removido do layout.
- [x] Tabela `Registros de pagamento`: removida.
- [x] `Tempo de pagamento por cliente`: deixado como pendencia visivel por falta de data de pagamento/vencimento no fetch.
- [ ] Reuniao com Juliana: acao de negocio fora do HTML.

## Frota

- [x] Cards antigos removidos da aba Frota.
- [x] Cards de manutencao criados: preventiva programada, preventiva por condicao, corretiva nao critica, corretiva critica, conservacao, avaria.
- [x] Tabela de KPIs de manutencao criada.
- [x] Limite tecnico declarado: KPI de ate 10 dias da solicitacao depende de data de solicitacao que nao esta no fetch.

## Multas

- [x] Cards atuais mantidos.
- [x] Grafico `Tipo de multa` criado.
- [x] Limite tecnico declarado: fetch atual nao traz tipo/infracao; grafico usa status como fallback visivel.

## Validacao

- [x] DOCX local relido e imagens inspecionadas.
- [x] Graphify executado em raiz minima do JS extraido.
- [x] `node --check` no script extraido do HTML.
- [x] `npm run build`.
- [x] Smoke Playwright com Chart stub nas abas Resumo, Servicos, Pagamentos, Frota e Multas.
