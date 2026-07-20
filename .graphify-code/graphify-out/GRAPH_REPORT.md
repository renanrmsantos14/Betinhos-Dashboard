# Graph Report - C:\Users\mendo\Desktop\vscode\Dashboard Betinhos\.graphify-code  (2026-07-17)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 188 nodes · 520 edges · 15 communities (12 shown, 3 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4d9a2c99`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_renderAll|renderAll]]
- [[_COMMUNITY_dashboard-inline.js|dashboard-inline.js]]
- [[_COMMUNITY_loadAll|loadAll]]
- [[_COMMUNITY_parseBRDate|parseBRDate]]
- [[_COMMUNITY_buildErrorLogRecord|buildErrorLogRecord]]
- [[_COMMUNITY_sumV|sumV]]
- [[_COMMUNITY_dataverse-export-metadata-console.js|dataverse-export-metadata-console.js]]
- [[_COMMUNITY_normL|normL]]
- [[_COMMUNITY_applyF|applyF]]
- [[_COMMUNITY_enhanceSortableTables|enhanceSortableTables]]
- [[_COMMUNITY_toggleFilterPanel|toggleFilterPanel]]
- [[_COMMUNITY_showAlert|showAlert]]
- [[_COMMUNITY_ensureReviewLayouts|ensureReviewLayouts]]
- [[_COMMUNITY_nav|nav]]

## God Nodes (most connected - your core abstractions)
1. `renderAll()` - 55 edges
2. `loadAll()` - 19 edges
3. `renderDistributionTable()` - 16 edges
4. `renderFrota()` - 15 edges
5. `emptyRow()` - 15 edges
6. `renderManutencoes()` - 13 edges
7. `API()` - 12 edges
8. `renderPagamentos()` - 12 edges
9. `brlS()` - 11 edges
10. `sumV()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `renderAll()` --indirect_call--> `isProducedReservation()`  [INFERRED]
  dashboard-inline.js → dashboard-inline.js  _Bridges community 7 → community 0_
- `createErrorLogRecord()` --calls--> `API()`  [EXTRACTED]
  dashboard-inline.js → dashboard-inline.js  _Bridges community 2 → community 4_
- `updateFilterSummary()` --calls--> `fmtD()`  [EXTRACTED]
  dashboard-inline.js → dashboard-inline.js  _Bridges community 0 → community 8_
- `getLYValueAndCount()` --calls--> `sumV()`  [EXTRACTED]
  dashboard-inline.js → dashboard-inline.js  _Bridges community 5 → community 3_
- `renderAll()` --calls--> `sumV()`  [EXTRACTED]
  dashboard-inline.js → dashboard-inline.js  _Bridges community 5 → community 0_

## Import Cycles
- None detected.

## Communities (15 total, 3 thin omitted)

### Community 0 - "renderAll"
Cohesion: 0.13
Nodes (46): badge(), brl(), brlS(), emptyRow(), fmtD(), fmtDt(), getFilteredMonthlyData(), grp() (+38 more)

### Community 1 - "dashboard-inline.js"
Cohesion: 0.08
Nodes (20): charts, DB, ENVS, F, fat2023, fat2024, fat2025, FONT (+12 more)

### Community 2 - "loadAll"
Cohesion: 0.22
Nodes (18): API(), buildFuncMap(), clearAlerts(), fetchAll(), generateMockData(), loadAll(), loadFuncionarios(), loadManutencoes() (+10 more)

### Community 3 - "parseBRDate"
Cohesion: 0.17
Nodes (16): calcularMetaMensal(), clampDate(), daysBetween(), daysInMonth(), eachDateBetween(), getHistoricalFat(), getLYValueAndCount(), getMetaParaPeriodo() (+8 more)

### Community 4 - "buildErrorLogRecord"
Cohesion: 0.24
Nodes (15): buildErrorLogRecord(), createErrorLogRecord(), flushErrorLogQueue(), getDashboardXrm(), getErrorLogEntitySet(), installDashboardErrorLogger(), makeHeaders(), normalizeDashboardError() (+7 more)

### Community 5 - "sumV"
Cohesion: 0.18
Nodes (14): chartHasData(), getLMValueAndCount(), getMonthlyDataFromDataverse(), getPeriodValueAndCount(), getTicketStats(), getTicketStatsForPeriod(), inDateRange(), isTicketEligibleReservation() (+6 more)

### Community 6 - "dataverse-export-metadata-console.js"
Cohesion: 0.38
Nodes (13): exportMetadata(), getAll(), getAttributes(), getChoiceAttributes(), getKeys(), getRelationships(), normalizeAttribute(), normalizeEntity() (+5 more)

### Community 7 - "normL"
Cohesion: 0.18
Nodes (13): buildOwnFleetUsageRows(), daysBetweenValues(), enrichReservas(), fv(), isCardPayment(), isOwnVehicle(), isPendingScheduledReservation(), isProducedReservation() (+5 more)

### Community 8 - "applyF"
Cohesion: 0.31
Nodes (9): applyF(), clearF(), closeMultiselects(), filterMSOptions(), msSelectAll(), msToggle(), quickFilter(), updateFilterSummary() (+1 more)

### Community 9 - "enhanceSortableTables"
Cohesion: 0.50
Nodes (5): enhanceSortableTables(), markTableSort(), parseTableValue(), sortDomTable(), tableSortKey()

### Community 10 - "toggleFilterPanel"
Cohesion: 0.67
Nodes (3): animateFilterActions(), cancelFilterActionsAnimation(), toggleFilterPanel()

## Knowledge Gaps
- **18 isolated node(s):** `fat2023`, `fat2024`, `fat2025`, `ENVS`, `T` (+13 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `renderAll()` connect `renderAll` to `dashboard-inline.js`, `parseBRDate`, `sumV`, `normL`, `applyF`, `enhanceSortableTables`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `loadAll()` connect `loadAll` to `applyF`, `dashboard-inline.js`, `showAlert`, `normL`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `renderFrota()` connect `renderAll` to `dashboard-inline.js`, `normL`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `renderAll()` (e.g. with `isPendingScheduledReservation()` and `isProducedReservation()`) actually correct?**
  _`renderAll()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `fat2023`, `fat2024`, `fat2025` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `renderAll` be split into smaller, more focused modules?**
  _Cohesion score 0.12753623188405797 - nodes in this community are weakly interconnected._
- **Should `dashboard-inline.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._