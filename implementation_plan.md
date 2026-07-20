# Plano: explicação da lógica dos cards e gráficos

## Objetivo

Adicionar, ao detalhe já existente de todos os cards e gráficos clicáveis, uma opção para consultar:

- uma explicação intuitiva para usuário;
- uma explicação técnica com origem dos dados, filtros, condições e fórmula;
- o mesmo contexto de período/filtros usado pelo indicador aberto.

## Arquivos

- `[MODIFY] Dashboard.html`
  - adicionar navegação de abas no modal de detalhe;
  - adicionar seletor `Para você` / `Técnica` na aba de lógica;
  - criar um catálogo de lógica baseado nos títulos e nos cálculos reais do dashboard;
  - renderizar a explicação para todos os tipos já abertos pelo delegado global (`.kpi`, `.cc`, `.tc`, `.exec-alert`);
  - manter o gráfico, a tabela, o filtro de período e o fechamento atuais.
- `[NEW] task.md`
  - checklist executável após aprovação.

## Decisões e limites

- Assumi que “aba ou opção” pode ficar dentro do modal existente, evitando outra navegação e preservando o fluxo atual.
- A explicação técnica será textual e baseada nos cálculos atuais; não será criado um editor de fórmulas nem será alterada a regra de negócio.
- Quando um indicador não tiver uma regra nominal específica, a interface informará a origem e a transformação observadas no render atual, sem inventar nomes lógicos ou condições.
- As mudanças serão cirúrgicas em `Dashboard.html`; não vou reformatar o arquivo nem mexer nas alterações locais já existentes.

## Critérios verificáveis

1. Todo elemento aberto pelo detalhe atual exibe as opções `Visão geral` e `Como foi calculado`.
2. A aba de lógica exibe os modos `Para você` e `Técnica` para qualquer card/gráfico aberto.
3. A explicação acompanha o título e o valor do indicador, respeita o período aplicado e não quebra quando não há dados.
4. O gráfico/tabela continua funcionando e os gráficos temporários são destruídos no fechamento.
5. `npm run build`, `npm run test:tv` e `npm run test:tv-compat` passam.
