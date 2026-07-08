# Graph Report - .graphify-inline-code  (2026-07-08)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 124 nodes · 287 edges · 11 communities (9 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
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
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]

## God Nodes (most connected - your core abstractions)
1. `renderAll()` - 32 edges
2. `loadAll()` - 18 edges
3. `mkChart()` - 12 edges
4. `fetchAll()` - 11 edges
5. `API()` - 10 edges
6. `opts0()` - 10 edges
7. `emptyRow()` - 10 edges
8. `grp()` - 9 edges
9. `sumV()` - 8 edges
10. `renderFaturamento()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `getLYValueAndCount()` --calls--> `sumV()`  [EXTRACTED]
  dashboard.inline.js → dashboard.inline.js  _Bridges community 5 → community 4_
- `renderAll()` --calls--> `sumV()`  [EXTRACTED]
  dashboard.inline.js → dashboard.inline.js  _Bridges community 5 → community 1_
- `renderAll()` --calls--> `mKeys()`  [EXTRACTED]
  dashboard.inline.js → dashboard.inline.js  _Bridges community 0 → community 1_
- `renderAll()` --calls--> `samePeriodLastMonth()`  [EXTRACTED]
  dashboard.inline.js → dashboard.inline.js  _Bridges community 4 → community 1_
- `loadAll()` --calls--> `enrichReservas()`  [EXTRACTED]
  dashboard.inline.js → dashboard.inline.js  _Bridges community 2 → community 7_

## Import Cycles
- None detected.

## Communities (11 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (20): chartHasData(), charts, DB, ENVS, F, fat2023, fat2024, fat2025 (+12 more)

### Community 1 - "Community 1"
Cohesion: 0.21
Nodes (23): brl(), brlS(), clearF(), emptyRow(), ensureExecutiveLayout(), getFilteredMonthlyData(), grp(), html() (+15 more)

### Community 2 - "Community 2"
Cohesion: 0.22
Nodes (18): API(), buildFuncMap(), clearAlerts(), fetchAll(), generateMockData(), loadAll(), loadFuncionarios(), loadManutencoes() (+10 more)

### Community 3 - "Community 3"
Cohesion: 0.33
Nodes (13): exportMetadata(), getAll(), getAttributes(), getChoiceAttributes(), getKeys(), getRelationships(), normalizeAttribute(), normalizeEntity() (+5 more)

### Community 4 - "Community 4"
Cohesion: 0.27
Nodes (11): clampDate(), daysInMonth(), getLYValueAndCount(), getMetaParaPeriodoProporcional(), getPeriodValueAndCount(), getTotalForPeriod(), pad2(), parseBRDate() (+3 more)

### Community 5 - "Community 5"
Cohesion: 0.27
Nodes (10): getLMValueAndCount(), getMonthlyDataFromDataverse(), renderFrotaTable(), renderMotTable(), renderSrvTable(), renderSumTable(), srchReg(), srchTbl() (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.67
Nodes (3): calcularMetaMensal(), getHistoricalFat(), getMetaParaPeriodo()

### Community 7 - "Community 7"
Cohesion: 0.67
Nodes (3): enrichReservas(), fv(), normL()

### Community 8 - "Community 8"
Cohesion: 0.67
Nodes (3): msSelectAll(), msToggle(), updateMSButton()

## Knowledge Gaps
- **17 isolated node(s):** `fat2023`, `fat2024`, `fat2025`, `ENVS`, `T` (+12 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `renderAll()` connect `Community 1` to `Community 0`, `Community 9`, `Community 4`, `Community 5`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `loadAll()` connect `Community 2` to `Community 0`, `Community 9`, `Community 10`, `Community 7`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `mkChart()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **What connects `fat2023`, `fat2024`, `fat2025` to the rest of the system?**
  _17 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._