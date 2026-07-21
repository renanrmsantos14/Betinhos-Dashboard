# Plano: dashboard TV sem scroll

## Objetivo

Criar uma interface exclusiva para Samsung Q60R 2019 (`.tv-browser`, Tizen 5.0 / Chromium 63) que use toda a area visivel e nao exija rolagem vertical ou horizontal. Desktop e mobile permanecem com o layout e as listas completas atuais.

## Assumptions

- Alvo principal: 1920x1080 com zoom Samsung em 100%. Protecoes: 1536x720 e 1280x720.
- "Ver tudo" significa ver todo o conteudo priorizado da aba TV em uma tela. Conteudo redundante sera ocultado apenas na TV.
- Tabelas detalhadas exibem Top 5; distribuicoes/rankings exibem Top 3 quando necessario para caber.
- Filtro fechado ocupa uma linha. Quando aberto, vira painel sobreposto e nao empurra o dashboard.

## Estrutura visual TV

1. Topbar compacta: marca, aba atual, horario, ambiente e atualizar.
2. Filtro compacto: periodo, presets e limpar em uma linha; edicao avancada abre como overlay.
3. Faixa de KPIs: cards baixos, sem sparklines e sem textos secundarios redundantes.
4. Area principal: no maximo dois paineis analiticos lado a lado.
5. Area de excecoes/tabela: alertas compactos ou Top 3/5, conforme a aba.
6. Setas laterais continuam trocando abas; foco remoto permanece visivel.

## Conteudo por aba na TV

- Resumo: 6 KPIs, matriz compacta de 8 alertas, Total Produzido e Meta x Realizado. Analises secundarias redundantes ficam ocultas na TV.
- Servicos: 2 resumos, Top 5 por tipo, Top 5 por veiculo e Top 5 servicos recentes.
- Faturamento: 4 KPIs, tendencia mensal, Top 3 status e Top 5 clientes.
- Pagamentos: 4 KPIs, Top 3 formas, Top 3 status e Top 5 registros.
- Frota: uso mensal resumido, Top 3 status, Top 3 marcas e Top 5 veiculos.
- Motoristas: KPIs, grafico mensal e Top 5 motoristas.
- Manutencoes: 6 KPIs compactos, Top 3 metas, custo/tipo e Top 5 registros.
- Multas, Trocas e Marketing: 3 KPIs, duas distribuicoes Top 3 e Top 5 registros.
- Diagnostico: permanece funcional e contido na viewport.

## Arquivos

- `[MODIFY] Dashboard.html`
  - adicionar contrato CSS TV de altura fixa e grids por aba;
  - transformar filtro avancado em overlay TV;
  - compactar KPIs, alertas, tabelas, graficos e cabecalhos apenas em `.tv-browser`;
  - esconder paineis secundarios explicitamente marcados apenas na TV;
  - adicionar `applyTvViewportLayout()` para medir a altura util, limitar linhas e reaplicar apos render, troca de aba, filtro e resize;
  - evitar APIs e sintaxe indisponiveis no Chromium 63.
- `[MODIFY] tv-compat.js`
  - expor sinalizadores necessarios para o modo TV compacto sem alterar desktop.
- `[MODIFY] scripts/test-dashboard-tv-build.cjs`
  - validar contrato sem scroll, overlay do filtro, limites Top 3/5 e CSS legado.
- `[MODIFY] scripts/test-tv-input-diagnostic.cjs`
  - validar navegacao/foco e inicializacao do layout TV.
- `[MODIFY] scripts/test-tv-compat.cjs`
  - preservar matriz de compatibilidade Tizen.
- `[UPDATE] task.md`
  - checklist da execucao.
- `[UPDATE] system_architecture.md`
  - registrar composicao e limites do dashboard TV.
- `[GENERATE] dist/Dashboard.html`, `build-info.json`, `package.json`, `package-lock.json`
  - gerar bundle final e versao pelo fluxo existente.

## Criterios verificaveis

1. Em 1920x1080, 1536x720 e 1280x720, `documentElement.scrollHeight <= innerHeight` e `scrollWidth <= innerWidth` com filtro fechado em todas as abas TV.
2. Cada `.page.on` cabe entre filtro e rodape da viewport, sem filhos ultrapassando sua caixa.
3. Tabelas detalhadas mostram no maximo 5 linhas; rankings/distribuicoes marcados mostram no maximo 3.
4. Filtro aberto fica sobreposto, contido na tela e fecha com controle/teclado sem deslocar a pagina.
5. Nenhum texto, badge, canvas, tabela ou toast ultrapassa o card pai.
6. Setas, Enter, Return/Escape, numeros e foco funcionam sem mouse.
7. Console sem erros/warnings ao carregar, trocar todas as abas, abrir filtro e redimensionar.
8. `npm run build`, testes TV/compatibilidade/PIN/diagnostico e `git diff --check` passam.
9. Screenshots automatizadas das tres viewports comprovam o layout final; validacao fisica na Samsung continua sendo o aceite definitivo.
10. A rotacao automatica atual entre abas permanece ativa e nao reinicia a cada ajuste de layout.

## Riscos e mitigacao

- Dados reais podem gerar textos maiores: truncamento com ellipsis e limites de linha exclusivos da TV.
- Browser Samsung em 125% reduz a viewport CSS: teste dedicado em 1536x720.
- Graficos podem manter dimensoes antigas: resize explicito apos aplicar o layout.
- Cache do webresource/browser pode mostrar bundle anterior: versao visivel e fechamento completo do navegador apos publicacao.
