# Graph Report - C:\Users\mendo\Desktop\vscode\Dashboard Betinhos\.graphify-code  (2026-07-08)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 140 nodes · 373 edges · 14 communities (10 shown, 4 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]

## God Nodes (most connected - your core abstractions)
1. `renderAll()` - 46 edges
2. `loadAll()` - 18 edges
3. `renderManutencoes()` - 13 edges
4. `opts0()` - 12 edges
5. `mkChart()` - 12 edges
6. `trunc()` - 11 edges
7. `fetchAll()` - 11 edges
8. `renderPagamentos()` - 11 edges
9. `emptyRow()` - 11 edges
10. `API()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `renderManutencoes()` --indirect_call--> `mL()`  [INFERRED]
  dashboard-inline.js → dashboard-inline.js  _Bridges community 2 → community 1_
- `renderAll()` --calls--> `sumV()`  [EXTRACTED]
  dashboard-inline.js → dashboard-inline.js  _Bridges community 6 → community 2_
- `renderFaturamento()` --calls--> `sumV()`  [EXTRACTED]
  dashboard-inline.js → dashboard-inline.js  _Bridges community 6 → community 1_
- `getMetaParaPeriodoProporcional()` --calls--> `parseBRDate()`  [EXTRACTED]
  dashboard-inline.js → dashboard-inline.js  _Bridges community 5 → community 7_
- `getTotalForPeriod()` --calls--> `parseBRDate()`  [EXTRACTED]
  dashboard-inline.js → dashboard-inline.js  _Bridges community 5 → community 6_

## Import Cycles
- None detected.

## Communities (14 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (19): chartHasData(), charts, DB, ENVS, F, fat2023, fat2024, fat2025 (+11 more)

### Community 1 - "Community 1"
Cohesion: 0.25
Nodes (26): badge(), brl(), brlS(), emptyRow(), fmtD(), fmtDt(), grp(), mkChart() (+18 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (21): enrichReservas(), ensureExecutiveLayout(), fv(), getFilteredMonthlyData(), html(), isCardPayment(), isDataverseDisabled(), isPendingScheduledReservation() (+13 more)

### Community 3 - "Community 3"
Cohesion: 0.22
Nodes (18): API(), buildFuncMap(), clearAlerts(), fetchAll(), generateMockData(), loadAll(), loadFuncionarios(), loadManutencoes() (+10 more)

### Community 4 - "Community 4"
Cohesion: 0.38
Nodes (13): exportMetadata(), getAll(), getAttributes(), getChoiceAttributes(), getKeys(), getRelationships(), normalizeAttribute(), normalizeEntity() (+5 more)

### Community 5 - "Community 5"
Cohesion: 0.31
Nodes (9): clampDate(), daysBetween(), daysInMonth(), pad2(), parseBRDate(), samePeriodLastMonth(), samePeriodLastYear(), shouldShowLM() (+1 more)

### Community 6 - "Community 6"
Cohesion: 0.29
Nodes (8): getLMValueAndCount(), getLYValueAndCount(), getMonthlyDataFromDataverse(), getPeriodValueAndCount(), getTotalForPeriod(), inDateRange(), passesActiveFilters(), sumV()

### Community 7 - "Community 7"
Cohesion: 0.50
Nodes (4): calcularMetaMensal(), getHistoricalFat(), getMetaParaPeriodo(), getMetaParaPeriodoProporcional()

### Community 8 - "Community 8"
Cohesion: 0.67
Nodes (3): msSelectAll(), msToggle(), updateMSButton()

## Knowledge Gaps
- **17 isolated node(s):** `fat2023`, `fat2024`, `fat2025`, `ENVS`, `T` (+12 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `renderAll()` connect `Community 2` to `Community 0`, `Community 1`, `Community 5`, `Community 6`, `Community 7`, `Community 10`, `Community 11`, `Community 13`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `loadAll()` connect `Community 3` to `Community 0`, `Community 2`, `Community 10`, `Community 12`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `fetchAll()` connect `Community 3` to `Community 0`?**
  _High betweenness centrality (0.001) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `renderAll()` (e.g. with `isPendingScheduledReservation()` and `isProducedReservation()`) actually correct?**
  _`renderAll()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `fat2023`, `fat2024`, `fat2025` to the rest of the system?**
  _17 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.12857142857142856 - nodes in this community are weakly interconnected._