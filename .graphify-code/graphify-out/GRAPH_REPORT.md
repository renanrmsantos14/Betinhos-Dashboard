# Graph Report - C:\Users\mendo\Desktop\vscode\Dashboard Betinhos\.graphify-code  (2026-07-13)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 163 nodes · 451 edges · 16 communities (12 shown, 4 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `76350af6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

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
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]

## God Nodes (most connected - your core abstractions)
1. `renderAll()` - 55 edges
2. `loadAll()` - 19 edges
3. `renderDistributionTable()` - 16 edges
4. `renderFrota()` - 15 edges
5. `emptyRow()` - 15 edges
6. `renderManutencoes()` - 13 edges
7. `renderPagamentos()` - 12 edges
8. `brlS()` - 11 edges
9. `normL()` - 11 edges
10. `fetchAll()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `renderAll()` --indirect_call--> `mL()`  [INFERRED]
  dashboard-inline.js → dashboard-inline.js  _Bridges community 0 → community 2_
- `renderShareTable()` --calls--> `brlS()`  [EXTRACTED]
  dashboard-inline.js → dashboard-inline.js  _Bridges community 0 → community 6_
- `isOwnVehicle()` --calls--> `fv()`  [EXTRACTED]
  dashboard-inline.js → dashboard-inline.js  _Bridges community 2 → community 4_
- `renderAll()` --calls--> `sumV()`  [EXTRACTED]
  dashboard-inline.js → dashboard-inline.js  _Bridges community 7 → community 2_
- `renderFaturamento()` --calls--> `sumV()`  [EXTRACTED]
  dashboard-inline.js → dashboard-inline.js  _Bridges community 7 → community 0_

## Import Cycles
- None detected.

## Communities (16 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.20
Nodes (31): badge(), brl(), brlS(), daysBetweenValues(), emptyRow(), fmtD(), fmtDt(), grp() (+23 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (20): charts, DB, ENVS, F, fat2023, fat2024, fat2025, FONT (+12 more)

### Community 2 - "Community 2"
Cohesion: 0.14
Nodes (20): enrichReservas(), ensureExecutiveLayout(), fv(), getFilteredMonthlyData(), isCardPayment(), isDataverseDisabled(), isPendingScheduledReservation(), isProducedReservation() (+12 more)

### Community 3 - "Community 3"
Cohesion: 0.20
Nodes (19): API(), buildFuncMap(), clearAlerts(), fetchAll(), generateMockData(), loadAll(), loadFuncionarios(), loadManutencoes() (+11 more)

### Community 4 - "Community 4"
Cohesion: 0.20
Nodes (14): buildOwnFleetUsageRows(), clampDate(), daysBetween(), daysInMonth(), eachDateBetween(), getMetaParaPeriodoProporcional(), isOwnVehicle(), isReservableService() (+6 more)

### Community 5 - "Community 5"
Cohesion: 0.38
Nodes (13): exportMetadata(), getAll(), getAttributes(), getChoiceAttributes(), getKeys(), getRelationships(), normalizeAttribute(), normalizeEntity() (+5 more)

### Community 6 - "Community 6"
Cohesion: 0.20
Nodes (10): chartHasData(), mkChart(), mkSpark(), renderMotoristas(), renderShareTable(), setChartEmptyState(), shareSortClass(), shareSortValue() (+2 more)

### Community 7 - "Community 7"
Cohesion: 0.29
Nodes (8): getLMValueAndCount(), getLYValueAndCount(), getMonthlyDataFromDataverse(), getPeriodValueAndCount(), getTotalForPeriod(), inDateRange(), passesActiveFilters(), sumV()

### Community 8 - "Community 8"
Cohesion: 0.50
Nodes (5): enhanceSortableTables(), markTableSort(), parseTableValue(), sortDomTable(), tableSortKey()

### Community 9 - "Community 9"
Cohesion: 0.67
Nodes (3): calcularMetaMensal(), getHistoricalFat(), getMetaParaPeriodo()

### Community 10 - "Community 10"
Cohesion: 0.67
Nodes (3): msSelectAll(), msToggle(), updateMSButton()

## Knowledge Gaps
- **18 isolated node(s):** `fat2023`, `fat2024`, `fat2025`, `ENVS`, `T` (+13 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `renderAll()` connect `Community 2` to `Community 0`, `Community 1`, `Community 4`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 12`, `Community 13`, `Community 15`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `loadAll()` connect `Community 3` to `Community 1`, `Community 2`, `Community 12`, `Community 14`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Why does `renderFrota()` connect `Community 0` to `Community 1`, `Community 2`, `Community 4`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `renderAll()` (e.g. with `isPendingScheduledReservation()` and `isProducedReservation()`) actually correct?**
  _`renderAll()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `fat2023`, `fat2024`, `fat2025` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1368421052631579 - nodes in this community are weakly interconnected._