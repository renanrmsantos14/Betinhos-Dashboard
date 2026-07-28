# Graph Report - C:\Users\mendo\Desktop\Betinhos\Tela Dashboard\.graphify-code  (2026-07-28)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 367 nodes · 1033 edges · 18 communities (17 shown, 1 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0dd9bbc4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_dashboard-inline.js|dashboard-inline.js]]
- [[_COMMUNITY_renderAll|renderAll]]
- [[_COMMUNITY_initializeDashboardAfterAccess|initializeDashboardAfterAccess]]
- [[_COMMUNITY_API|API]]
- [[_COMMUNITY_renderDespesas|renderDespesas]]
- [[_COMMUNITY_nav|nav]]
- [[_COMMUNITY_buildCardDetail|buildCardDetail]]
- [[_COMMUNITY_renderMarkpointModule|renderMarkpointModule]]
- [[_COMMUNITY_parseBRDate|parseBRDate]]
- [[_COMMUNITY_dataverse-export-metadata-console.js|dataverse-export-metadata-console.js]]
- [[_COMMUNITY_reportDashboardError|reportDashboardError]]
- [[_COMMUNITY_installTvPinGate|installTvPinGate]]
- [[_COMMUNITY_applyTvViewportLayout|applyTvViewportLayout]]
- [[_COMMUNITY_captureTvDiagnosticEvent|captureTvDiagnosticEvent]]
- [[_COMMUNITY_enhanceSortableTables|enhanceSortableTables]]
- [[_COMMUNITY_fitPassengerRankingColumns|fitPassengerRankingColumns]]
- [[_COMMUNITY_ensureReviewLayouts|ensureReviewLayouts]]

## God Nodes (most connected - your core abstractions)
1. `renderAll()` - 61 edges
2. `API()` - 27 edges
3. `renderDespesas()` - 25 edges
4. `fetchAll()` - 23 edges
5. `normL()` - 22 edges
6. `loadAll()` - 22 edges
7. `initializeDashboardAfterAccess()` - 22 edges
8. `renderDistributionTable()` - 19 edges
9. `emptyRow()` - 18 edges
10. `renderFrota()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `renderMarkpointModule()` --indirect_call--> `isActiveFuncionario()`  [INFERRED]
  dashboard-inline.js → dashboard-inline.js  _Bridges community 1 → community 7_
- `renderAll()` --indirect_call--> `isTravelReservation()`  [INFERRED]
  dashboard-inline.js → dashboard-inline.js  _Bridges community 4 → community 1_
- `getTicketStats()` --indirect_call--> `isTicketEligibleReservation()`  [INFERRED]
  dashboard-inline.js → dashboard-inline.js  _Bridges community 0 → community 1_
- `installTvPinGate()` --indirect_call--> `trackTvPointerBaseline()`  [INFERRED]
  dashboard-inline.js → dashboard-inline.js  _Bridges community 5 → community 11_
- `installTvInputDiagnostic()` --indirect_call--> `captureTvDiagnosticEvent()`  [INFERRED]
  dashboard-inline.js → dashboard-inline.js  _Bridges community 13 → community 10_

## Import Cycles
- None detected.

## Communities (18 total, 1 thin omitted)

### Community 0 - "dashboard-inline.js"
Cohesion: 0.03
Nodes (50): charts, dataLoadPromises, dataSetLoaders, daysBetweenValues(), DB, detailCharts, ENVS, EXPENSE_STATUS (+42 more)

### Community 1 - "renderAll"
Cohesion: 0.12
Nodes (56): badge(), brl(), brlS(), emptyRow(), escapeDashboardText(), fmtD(), fmtDt(), getDashboardMonthLabels() (+48 more)

### Community 2 - "initializeDashboardAfterAccess"
Cohesion: 0.07
Nodes (40): addKpiGoalDirections(), applyF(), buildFuncMap(), buildInfracaoMap(), buildLegacy2026Reservation(), clearAlerts(), copyToClipboard(), detectEnv() (+32 more)

### Community 3 - "API"
Cohesion: 0.12
Nodes (32): API(), createErrorLogRecord(), DASHBOARD_TRANSIENT_HTTP_STATUSES, fetchAll(), fetchDashboardData(), getDashboardXrm(), getErrorLogEntitySet(), loadAnexosDespesas() (+24 more)

### Community 4 - "renderDespesas"
Cohesion: 0.12
Nodes (30): aggregateExpenses(), aggregateFoodExpensesByDriver(), buildExpenseRows(), buildOwnFleetUsageRows(), clearExpenseFilters(), EXPENSE_FOOD_CATEGORIES, expenseCompanyLabel(), expenseDeltaMarkup() (+22 more)

### Community 5 - "nav"
Cohesion: 0.11
Nodes (28): activateTvDirectionalTarget(), clearTvMagneticTarget(), ensureTvDirectionalTarget(), getTabFromUrl(), getTvMagneticTargets(), handleTvMagneticClick(), handleTvPointerNavigation(), installTvNavigation() (+20 more)

### Community 6 - "buildCardDetail"
Cohesion: 0.15
Nodes (20): addCardDetailStat(), appendLogicSection(), buildCardDetail(), buildCardLogic(), chartHasData(), cloneCardTable(), createCardDetailElement(), createChartDataTable() (+12 more)

### Community 7 - "renderMarkpointModule"
Cohesion: 0.15
Nodes (20): clearMarkpointImport(), initMarkpointImport(), markpointAssignConsecutiveRests(), markpointDismissFeedback(), markpointFilteredRecords(), markpointFmtMinutes(), markpointFuncionario(), markpointImportFile() (+12 more)

### Community 8 - "parseBRDate"
Cohesion: 0.20
Nodes (14): calcularMetaMensal(), clampDate(), daysInMonth(), eachDateBetween(), getHistoricalFat(), getMetaParaPeriodo(), getMetaParaPeriodoProporcional(), getPreviousExpensePeriod() (+6 more)

### Community 9 - "dataverse-export-metadata-console.js"
Cohesion: 0.38
Nodes (13): exportMetadata(), getAll(), getAttributes(), getChoiceAttributes(), getKeys(), getRelationships(), normalizeAttribute(), normalizeEntity() (+5 more)

### Community 10 - "reportDashboardError"
Cohesion: 0.27
Nodes (13): buildErrorLogRecord(), flushErrorLogQueue(), installDashboardErrorLogger(), installTvInputDiagnostic(), normalizeDashboardError(), readErrorLogQueue(), redactLogText(), redactLogValue() (+5 more)

### Community 11 - "installTvPinGate"
Cohesion: 0.35
Nodes (12): addTvPinDigit(), clearTvPin(), deleteTvPinDigit(), focusTvPinKey(), handleTvPinKeydown(), handleTvPinKeyup(), installTvPinGate(), renderTvPin() (+4 more)

### Community 12 - "applyTvViewportLayout"
Cohesion: 0.20
Nodes (10): animateFilterActions(), applyTvViewportLayout(), cancelFilterActionsAnimation(), clearF(), closeMultiselects(), filterMSOptions(), installTvViewportLayout(), markTvTableLimits() (+2 more)

### Community 13 - "captureTvDiagnosticEvent"
Cohesion: 0.40
Nodes (6): captureTvDiagnosticEvent(), isTvDiagnosticOpen(), renderTvInputDiagnostic(), sendTvDiagnosticToAppLog(), tvDiagnosticEventData(), tvDiagnosticSummary()

### Community 14 - "enhanceSortableTables"
Cohesion: 0.50
Nodes (5): enhanceSortableTables(), markTableSort(), parseTableValue(), sortDomTable(), tableSortKey()

### Community 15 - "fitPassengerRankingColumns"
Cohesion: 0.67
Nodes (4): applyPassengerRankingColumnWidths(), fitPassengerRankingColumns(), installPassengerRankingColumnResize(), observePassengerRankingWidth()

## Knowledge Gaps
- **36 isolated node(s):** `fat2023`, `fat2024`, `fat2025`, `fat2026`, `legacy2026Rows` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `renderAll()` connect `renderAll` to `dashboard-inline.js`, `initializeDashboardAfterAccess`, `renderDespesas`, `buildCardDetail`, `parseBRDate`, `applyTvViewportLayout`, `enhanceSortableTables`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `API()` connect `API` to `dashboard-inline.js`, `renderMarkpointModule`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **Why does `renderDespesas()` connect `renderDespesas` to `dashboard-inline.js`, `renderAll`, `parseBRDate`, `buildCardDetail`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `renderAll()` (e.g. with `isMultaPendente()` and `isReceivedPayment()`) actually correct?**
  _`renderAll()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `fat2023`, `fat2024`, `fat2025` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dashboard-inline.js` be split into smaller, more focused modules?**
  _Cohesion score 0.034482758620689655 - nodes in this community are weakly interconnected._
- **Should `renderAll` be split into smaller, more focused modules?**
  _Cohesion score 0.11818181818181818 - nodes in this community are weakly interconnected._