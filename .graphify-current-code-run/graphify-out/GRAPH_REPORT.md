# Graph Report - .graphify-current-code-run  (2026-07-13)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 176 nodes · 482 edges · 15 communities (12 shown, 3 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4187eca6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14

## God Nodes (most connected - your core abstractions)
1. `renderAll()` - 57 edges
2. `loadAll()` - 19 edges
3. `renderDistributionTable()` - 16 edges
4. `renderFrota()` - 15 edges
5. `emptyRow()` - 15 edges
6. `renderManutencoes()` - 13 edges
7. `renderPagamentos()` - 12 edges
8. `brlS()` - 11 edges
9. `sumV()` - 11 edges
10. `normL()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `renderAll()` --indirect_call--> `mL()`  [INFERRED]
  dashboard-inline-current.js → dashboard-inline-current.js  _Bridges community 0 → community 2_
- `renderAll()` --indirect_call--> `isProducedReservation()`  [INFERRED]
  dashboard-inline-current.js → dashboard-inline-current.js  _Bridges community 5 → community 2_
- `renderPagamentos()` --indirect_call--> `isReceivedPayment()`  [INFERRED]
  dashboard-inline-current.js → dashboard-inline-current.js  _Bridges community 5 → community 0_
- `renderShareTable()` --calls--> `brlS()`  [EXTRACTED]
  dashboard-inline-current.js → dashboard-inline-current.js  _Bridges community 0 → community 10_
- `updateFilterSummary()` --calls--> `fmtD()`  [EXTRACTED]
  dashboard-inline-current.js → dashboard-inline-current.js  _Bridges community 0 → community 7_

## Import Cycles
- None detected.

## Communities (15 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.17
Nodes (35): badge(), brl(), brlS(), daysBetweenValues(), emptyRow(), fmtD(), fmtDt(), grp() (+27 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (21): chartHasData(), charts, DB, ENVS, F, fat2023, fat2024, fat2025 (+13 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (22): ensureExecutiveLayout(), getFilteredMonthlyData(), getLMValueAndCount(), getLYValueAndCount(), getMonthlyDataFromDataverse(), getPeriodValueAndCount(), getTicketStats(), getTicketStatsForPeriod() (+14 more)

### Community 3 - "Community 3"
Cohesion: 0.20
Nodes (19): API(), buildFuncMap(), clearAlerts(), fetchAll(), generateMockData(), loadAll(), loadFuncionarios(), loadManutencoes() (+11 more)

### Community 4 - "Community 4"
Cohesion: 0.38
Nodes (13): exportMetadata(), getAll(), getAttributes(), getChoiceAttributes(), getKeys(), getRelationships(), normalizeAttribute(), normalizeEntity() (+5 more)

### Community 5 - "Community 5"
Cohesion: 0.25
Nodes (11): buildOwnFleetUsageRows(), enrichReservas(), fv(), isCardPayment(), isOwnVehicle(), isPendingScheduledReservation(), isProducedReservation(), isReceivedPayment() (+3 more)

### Community 6 - "Community 6"
Cohesion: 0.25
Nodes (11): clampDate(), daysBetween(), daysInMonth(), eachDateBetween(), getMetaParaPeriodoProporcional(), pad2(), parseBRDate(), samePeriodLastMonth() (+3 more)

### Community 7 - "Community 7"
Cohesion: 0.27
Nodes (10): applyF(), clearF(), closeMultiselects(), filterMSOptions(), msSelectAll(), msToggle(), quickFilter(), toggleFilterPanel() (+2 more)

### Community 8 - "Community 8"
Cohesion: 0.20
Nodes (8): defaultFile, fs, http, mimeTypes, path, repoRoot, requestedPort, server

### Community 9 - "Community 9"
Cohesion: 0.50
Nodes (5): enhanceSortableTables(), markTableSort(), parseTableValue(), sortDomTable(), tableSortKey()

### Community 10 - "Community 10"
Cohesion: 0.50
Nodes (4): renderShareTable(), shareSortClass(), shareSortValue(), srtShare()

### Community 11 - "Community 11"
Cohesion: 0.67
Nodes (3): calcularMetaMensal(), getHistoricalFat(), getMetaParaPeriodo()

## Knowledge Gaps
- **26 isolated node(s):** `fat2023`, `fat2024`, `fat2025`, `ENVS`, `T` (+21 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `renderAll()` connect `Community 2` to `Community 0`, `Community 1`, `Community 5`, `Community 6`, `Community 7`, `Community 9`, `Community 10`, `Community 11`, `Community 13`, `Community 14`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `loadAll()` connect `Community 3` to `Community 1`, `Community 12`, `Community 5`, `Community 7`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `renderFrota()` connect `Community 0` to `Community 1`, `Community 2`, `Community 5`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `renderAll()` (e.g. with `isPendingScheduledReservation()` and `isProducedReservation()`) actually correct?**
  _`renderAll()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `fat2023`, `fat2024`, `fat2025` to the rest of the system?**
  _26 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.12554112554112554 - nodes in this community are weakly interconnected._