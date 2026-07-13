# Plano — normalização visual integral do Dashboard Betinhos

## Objetivo

Organizar o dashboard inteiro em uma hierarquia visual única, com grupos explícitos, containers estáveis, grids previsíveis e três tipos de card consistentes. A fonte HTML deve ser a mesma estrutura exibida, sem reconstrução visual em runtime.

## Premissas

- Preservar todos os IDs, `onclick`, campos, tabelas, canvases, filtros e funções de renderização existentes.
- Não alterar regras Dataverse, cálculos, filtros ou payloads.
- Trabalhar sobre o `Dashboard.html` atual, que já tem mudanças locais pendentes; não reverter mudanças alheias.
- Manter o dashboard single-file e sem dependências novas.

## Diagnóstico

| Antes | Depois | Por quê |
| --- | --- | --- |
| Resumo, Serviços, Pagamentos e Frota removem e recriam partes do HTML por `ensureExecutiveLayout` / `ensureReviewLayouts`. | HTML estático já contém a estrutura final; render só popula conteúdo. | Fonte e tela passam a coincidir, sem nós duplicados temporários ou dependência de mutação visual. |
| Grupos usam combinações soltas de `kpi-row`, `kpi-2` a `kpi-6`, `cgrid`, `g1`, `g2` e alertas sem rótulo estrutural. | Cada aba terá seções, grid de métricas, grid analítico e tabela como blocos nomeados. | Grade, ritmo vertical e leitura ficam previsíveis em todas as abas. |
| Cards `kpi`, `cc` e `tc` repetem superfície, borda, sombra, raio e espaçamento. | Base visual compartilhada com variantes de métrica, análise e dados. | Mesma hierarquia sem apagar diferenças funcionais. |
| Alertas executivos ficam em duas linhas com 3 e 4 colunas, sem grupo explícito. | Dois grupos semânticos e grades definidas: operação e qualidade de dados. | Evita desalinhamento e deixa prioridade legível. |
| Entrada de abas aplica animação em página e em cada bloco, com duração longa e `will-change` persistente. | Uma entrada curta somente nos blocos, 180–220 ms, com stagger mínimo e redução de movimento. | Motion informa mudança de contexto sem pesar a navegação. |

## Arquivos

- `[MODIFY] Dashboard.html`
  - Consolidar tokens de espaçamento, superfície, grids e motion.
  - Declarar containers semânticos por aba e aplicar layout final estático.
  - Substituir os trechos de layout montados em runtime pelo mesmo HTML final, preservando IDs e ordem de dados.
  - Remover `ensureExecutiveLayout`, `ensureReviewLayouts`, `replaceCanvasWithTable` e `compactStandaloneKpis`, mais suas chamadas em `renderAll()`.
  - Padronizar responsividade de métricas, análises, alertas, filtros e tabelas.
  - Ajustar animações para `transform` e `opacity`, com `prefers-reduced-motion`.

- `[NEW] task.md` (somente após aprovação)
  - Checklist de execução e validação, atualizado durante a implementação.

## Estrutura alvo

```text
.content
  .fbar                         filtros globais
  .page                         aba ativa
    .page-section--metrics      KPIs principais
      .dashboard-grid           grid definido por variante
        .card--metric
    .page-section--alerts       alertas operacionais ou de qualidade
      .dashboard-grid
        .card--alert
    .page-section--analysis     gráficos, rankings e distribuições
      .dashboard-grid
        .card--analysis
    .page-section--data         tabela principal
      .card--table
```

## Sequência de execução

1. Consolidar CSS e breakpoints em grids reutilizáveis.
   Verificar: nenhuma grade depende de margem residual ou de largura fixa fora de tabelas.

2. Converter Resumo, Serviços, Pagamentos, Frota e Multas para o DOM final estático.
   Verificar: todos os IDs atuais continuam únicos e encontrados pelos renderizadores.

3. Aplicar a mesma hierarquia a Faturamento, Motoristas, Manutenções, Trocas e Marketing.
   Verificar: cada aba segue métrica → análise → dados, quando aplicável.

4. Remover mutações de layout em JavaScript e manter somente renderização de dados.
   Verificar: `renderAll()` não recria estrutura visual e não há funções de layout mortas.

5. Ajustar motion e responsividade.
   Verificar: desktop, tablet e celular não têm overflow horizontal fora das tabelas; `prefers-reduced-motion` reduz deslocamento.

6. Validar localmente.
   Verificar: sintaxe do script inline, `npm run build`, `git diff --check -- Dashboard.html` e smoke visual de todas as abas em desktop e celular, sem erros de console.

## Risco controlado

Maior risco é ID duplicado ou removido ao transformar o HTML dinâmico em estático. A execução manterá os mesmos IDs e fará busca de unicidade antes do smoke visual.
