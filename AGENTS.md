# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

This is a **single-file HTML dashboard** for Betinhos, a fleet/transportation management company. The dashboard displays business metrics, operational data, and financial KPIs for managers. It's built as a self-contained HTML file with embedded CSS and JavaScript, using Chart.js for data visualization.

**Key Language:** Portuguese (pt-BR)

## File Structure

The entire application is in `Dashboard.html` (~4900 lines), organized into these logical sections:

### Frontend (HTML & CSS)
- **Topbar**: Logo, branding, and user menu
- **Navigation**: Tab system for switching between views (Resumo, Abas de Faturas, Motoristas, Serviços, Frota)
- **Main Content Area**: Charts, KPIs, and interactive tables
- **Design System**: CSS custom properties for colors, spacing, shadows, and border radii

### JavaScript Architecture (in order of execution)
1. **DADOS HARDCODED** (line ~2210): Historical revenue data (2023-2025) for revenue charts
2. **DADOS FICTÍCIOS** (line ~2225): Mock data generation for local development (toggle with `USING_MOCK_DATA`)
3. **CONFIGURAÇÕES DO DATAVERSE** (line ~2520): API endpoints and Dataverse configuration
4. **UTILS** (line ~2640): Helper functions (formatting, currency, date handling)
5. **FETCH** (line ~2710): Data fetching from Dataverse APIs
6. **ENV DETECTION** (line ~2760): Detects dev vs. production environment
7. **LOAD** (line ~2760): Main initialization logic, data loading, and render pipeline
8. **FILTERS** (line ~2960): Date range and status filtering
9. **META INTELIGENTE** (line ~3195): Smart goals/targets calculation
10. **RENDER PRINCIPAL** (line ~3295): Main dashboard rendering (KPI cards, charts, tables)
11. **CHART HELPERS** (line ~4545): Chart.js configuration and rendering
12. **TABLE RENDERERS** (line ~4650): Table rendering for Faturas, Motoristas, Serviços, Frota
13. **TABLE SORT + SEARCH** (line ~4715): Sorting, filtering, and search functionality
14. **UI HELPERS** (line ~4810): Status badges, tooltips, formatting
15. **INIT** (line ~4890): Startup and event listener setup

## Data Flow

```
Dataverse APIs → Fetch Data → Filter/Transform → Cache (VW object) → Render Charts/Tables → DOM
```

The `VW` object is the main data store holding:
- `reservas`: All service/reservation records
- `motoristas`: Driver data
- `frota`: Fleet/vehicle data
- `clientes`: Client/customer data

## Key Functions & Patterns

### Data Loading
- `loadData()`: Fetches all data from Dataverse (or generates mock data if `USING_MOCK_DATA === true`)
- `loadReservasData()`, `loadMotoristaData()`, `loadFrotaData()`: Individual fetch functions
- `applyFilters()`: Applies date/status filters to the dataset

### Rendering
- `renderMain()`: Renders the main dashboard (KPIs and Overview tab)
- `renderSumTable()`: Renders invoice summary table (Faturas)
- `renderMotTable()`: Renders driver table (Motoristas)
- `renderSrvTable()`: Renders service/reservation table (Serviços)
- `renderFrotaTable()`: Renders fleet table (Frota)

### Charting
- Charts use Chart.js with the `datalabels` plugin
- Config objects are built in `makeChartConfig()` and related functions
- Charts destroy and recreate on data changes (look for `if (myCharts.chartName) { myCharts.chartName.destroy(); }`)

### Tables
- Sorting: `srt(tableId, field, headerElement)` toggles sort direction and re-renders
- Searching: `srchTbl(id, query)` and `srchReg(query)` filter and re-render
- Cache: `tblCache` stores sorted/filtered table data to avoid re-filtering on re-renders

## Development Workflow

### Using Mock Data
To develop locally without needing Dataverse connectivity:
```javascript
// Near the top of the script (around line 2226)
USING_MOCK_DATA = true; // Change to true to generate fake data
```

Then reload the page. Mock data includes randomized motoristas, clientes, and reservas.

### Testing Chart/Table Changes
1. Locate the render function you're modifying (e.g., `renderSumTable`)
2. Make your changes
3. Trigger a re-render by:
   - Clicking a filter button
   - Typing in a search box
   - Clicking a table header to sort
   - Refreshing the page

### Adding a New Chart
1. Create a config object using `makeChartConfig()` pattern
2. Get the canvas element: `document.getElementById('myChartId')`
3. Create with: `myCharts.myChart = new Chart(ctx, config)`
4. Add destroy logic if updating: `if (myCharts.myChart) { myCharts.myChart.destroy(); }`
5. Store in `myCharts` object for lifecycle management

### Adding a New Tab/View
1. Add a button in the HTML topbar nav area
2. Add corresponding content `<div id="tab-xyz">` in the main area
3. Create a render function `renderXyz()`
4. Add click handler to show/hide tabs and trigger `renderXyz()`

## Dataverse Integration

The dashboard fetches data from Dataverse tables:
- **dv_reservas** (Reservations/Services)
- **dv_motoristas** (Drivers)
- **dv_clientes** (Clients)
- **dv_frota** (Fleet)

Fetch URLs are in the **CONFIGURAÇÕES DO DATAVERSE** section (~line 2520).

**IMPORTANT**: Data from before 2026 is suppressed by a global rule (line ~2705).

## Color System

All colors defined as CSS custom properties in `:root`:
- Primary: `--blue` (#1a6cf5)
- Semantic: `--green`, `--red`, `--yellow`, `--orange`, `--teal`, `--purple`
- Light variants: `--blue-l`, `--green-l`, etc.
- Text: `--t1` (dark), `--t2` (medium), `--t3` (light)
- Borders: `--b1`, `--b2`

## Important Notes

### Single File Constraint
This is a single `.html` file. All CSS and JavaScript must be inline within `<style>` and `<script>` tags. No external dependencies beyond:
- Google Fonts (Plus Jakarta Sans)
- Chart.js (CDN)
- chartjs-plugin-datalabels (CDN)

### Hardcoded Data
Revenue data for 2023-2025 is hardcoded in arrays (`fat2023`, `fat2024`, `fat2025`) and used for the main dashboard charts. This is intentional historical data.

### Environment Detection
The `ENV` variable detects dev vs. prod. Check console output or network tab to confirm Dataverse endpoints being used.

### Data Suppression Rule
Pre-2026 data is globally hidden from Dataverse. This is intentional and enforced in the fetch/load logic.

## Common Edits

### Change a Color
Edit the CSS custom property in `:root`, e.g. `--blue: #newcolor;`

### Update Historical Revenue
Edit `fat2023`, `fat2024`, or `fat2025` arrays near line 2210

### Add a New Status Badge Style
Extend the `badge(status)` function (~line 4815) with additional `.includes()` checks

### Fix a Chart Label or Title
Search for the chart's render function, then find the `title`, `legend`, or `labels` config property

### Modify Dataverse Endpoints
Edit the fetch URLs in **CONFIGURAÇÕES DO DATAVERSE** section (~line 2520)
