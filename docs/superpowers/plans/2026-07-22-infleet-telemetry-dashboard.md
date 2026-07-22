# Infleet Telemetry Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Synchronize deduplicated Infleet daily telemetry and events into DEV/AppBetinhos and render fast fleet indicators in `Dashboard.html`.

**Architecture:** A solution-aware DEV cloud flow reads Infleet GraphQL through a secret environment variable, resolves canonical vehicle/driver lookups, and upserts two Dataverse tables by alternate key. The dashboard lazily reads the compact tables and aggregates only the active date range.

**Tech Stack:** Dataverse Web API v9.2, Power Automate/Logic Apps workflow definition, Infleet GraphQL, PowerShell 5.1, single-file HTML/CSS/JavaScript, Chart.js.

## Global Constraints

- Target only DEV environment `25a2ab78-cf07-ee41-a124-457aa2c29aea` at `https://org23b93544.crm2.dynamics.com`.
- Put every Power Platform component in unmanaged solution `AppBetinhos` (`31b604cb-5afc-f011-8406-7ced8da87992`).
- Use confirmed publisher prefix `new`.
- Do not modify Default or PROD.
- Preserve all pre-existing worktree changes and the single-file dashboard contract.
- Never commit, print, or log the Infleet Bearer token.
- Vehicle lookup is required; driver lookup is optional and temporal.
- Never create vehicle or employee records from telemetry.
- Use alternate-key upsert; never blind-create telemetry rows.

---

### Task 1: Add repeatable DEV provisioning artifacts

**Files:**
- Create: `power-platform/infleet/README.md`
- Create: `power-platform/infleet/schema.dev.json`
- Create: `scripts/provision-infleet-dev.ps1`
- Test: `scripts/test-infleet-schema.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: DEV org URL, solution unique name, access token supplied only at runtime.
- Produces: `new_infleetvehicleid`, `new_placanormalizada`, `new_ultimasincronizacaoinfleet`, `new_infleetdriverid`, `new_cpfnormalizado`, `new_telemetriadiariainfleet`, and `new_eventoinfleet` metadata.

- [ ] **Step 1: Add schema contract test**

Create `scripts/test-infleet-schema.mjs` to load `schema.dev.json` and assert:

```js
import assert from "node:assert/strict";
import fs from "node:fs";

const schema = JSON.parse(fs.readFileSync(new URL("../power-platform/infleet/schema.dev.json", import.meta.url), "utf8"));
assert.equal(schema.target.environmentId, "25a2ab78-cf07-ee41-a124-457aa2c29aea");
assert.equal(schema.target.solutionUniqueName, "AppBetinhos");
assert.equal(schema.target.publisherPrefix, "new");
assert.deepEqual(schema.tables.new_telemetriadiariainfleet.alternateKey, ["new_chavetelemetria"]);
assert.deepEqual(schema.tables.new_eventoinfleet.alternateKey, ["new_infleeteventid"]);
assert.equal(schema.tables.new_telemetriadiariainfleet.lookups.new_veiculo.required, true);
assert.equal(schema.tables.new_eventoinfleet.lookups.new_motorista.required, false);
console.log("Infleet schema contract OK");
```

- [ ] **Step 2: Run the test and verify failure**

Run: `node scripts/test-infleet-schema.mjs`

Expected: failure because `schema.dev.json` does not exist.

- [ ] **Step 3: Add exact schema manifest**

Define these logical names and types in `schema.dev.json`:

```json
{
  "target": {
    "environmentId": "25a2ab78-cf07-ee41-a124-457aa2c29aea",
    "orgUrl": "https://org23b93544.crm2.dynamics.com",
    "solutionUniqueName": "AppBetinhos",
    "solutionId": "31b604cb-5afc-f011-8406-7ced8da87992",
    "publisherPrefix": "new"
  },
  "existingTables": {
    "cr40f_veiculos": ["new_infleetvehicleid", "new_placanormalizada", "new_ultimasincronizacaoinfleet"],
    "cr40f_funcionarios": ["new_infleetdriverid", "new_cpfnormalizado", "new_ultimasincronizacaoinfleet"]
  },
  "tables": {
    "new_telemetriadiariainfleet": {
      "primaryName": "new_nome",
      "alternateKey": ["new_chavetelemetria"],
      "lookups": {
        "new_veiculo": { "target": "cr40f_veiculos", "required": true }
      }
    },
    "new_eventoinfleet": {
      "primaryName": "new_nome",
      "alternateKey": ["new_infleeteventid"],
      "lookups": {
        "new_veiculo": { "target": "cr40f_veiculos", "required": true },
        "new_motorista": { "target": "cr40f_funcionarios", "required": false }
      }
    }
  }
}
```

The full manifest must include every approved metric with Dataverse-compatible precision: distance/speed/odometer/autonomy as decimal, costs as money, durations/counts as integer, coordinates as decimal, source timestamps as date-time, local day as date-only, and mapping status as text.

- [ ] **Step 4: Implement idempotent metadata provisioning**

`scripts/provision-infleet-dev.ps1` must:

```powershell
param(
  [Parameter(Mandatory = $true)][string]$AccessToken,
  [switch]$Apply
)
$ErrorActionPreference = 'Stop'
$OrgUrl = 'https://org23b93544.crm2.dynamics.com'
$Solution = 'AppBetinhos'
$Headers = @{
  Authorization = "Bearer $AccessToken"
  Accept = 'application/json'
  'Content-Type' = 'application/json; charset=utf-8'
  'MSCRM.SolutionUniqueName' = $Solution
}
```

It must GET metadata before each create, skip compatible existing components, stop on incompatible types, pass `MSCRM.SolutionUniqueName: AppBetinhos`, create both tables/columns/lookups, and create alternate keys through `EntityDefinitions(<MetadataId>)/Keys`.

- [ ] **Step 5: Add npm verification command**

Add without changing other scripts:

```json
"test:infleet-schema": "node scripts/test-infleet-schema.mjs"
```

- [ ] **Step 6: Run local schema verification**

Run: `npm run test:infleet-schema`

Expected: `Infleet schema contract OK` and exit `0`.

- [ ] **Step 7: Run provisioning dry-run, then DEV apply**

Dry-run must list planned creates without mutation. Apply must create only missing compatible metadata. Rerun dry-run and expect no pending schema changes.

- [ ] **Step 8: Commit Task 1**

```powershell
git add power-platform/infleet/README.md power-platform/infleet/schema.dev.json scripts/provision-infleet-dev.ps1 scripts/test-infleet-schema.mjs package.json package-lock.json
git commit -m "feat(dataverse): provisionar telemetria Infleet no DEV" -m "Adiciona schema idempotente, relacionamentos, chaves alternativas e validação local para AppBetinhos."
```

---

### Task 2: Create solution-aware Infleet synchronization flow

**Files:**
- Create: `power-platform/infleet/flow-definition.dev.json`
- Create: `scripts/provision-infleet-flow-dev.ps1`
- Test: `scripts/test-infleet-flow-definition.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: schema from Task 1, Infleet GraphQL endpoint, secret environment variable `new_InfleetBearerToken`, DEV Dataverse connection reference.
- Produces: solution-aware flow `Flow Sincronizar Telemetria Infleet` with recurrence concurrency `1` and three-day idempotent reprocessing.

- [ ] **Step 1: Add failing flow-definition test**

The test must assert:

```js
assert.equal(definition.triggers.Recurrence.runtimeConfiguration.concurrency.runs, 1);
assert.equal(definition.metadata.targetEnvironmentId, "25a2ab78-cf07-ee41-a124-457aa2c29aea");
assert.equal(definition.metadata.solutionUniqueName, "AppBetinhos");
assert.ok(serialized.includes("https://api.infleet.com.br/v1/graphql"));
assert.ok(serialized.includes("routeVehicleDetails"));
assert.ok(serialized.includes("listEventsWithCursor"));
assert.ok(serialized.includes("listFuellings"));
assert.ok(!serialized.match(/Bearer\s+[A-Za-z0-9._-]{20,}/));
```

Run and expect failure before the definition exists.

- [ ] **Step 2: Build flow definition**

Create a Logic Apps definition with these exact boundaries:

```graphql
query RouteVehicleDetails($filter: ListVehiclePositionsFilterInput!) {
  routeVehicleDetails(filter: $filter) {
    averageSpeed maximumSpeed totalDistanceTraveled
    totalTimeStopped totalTimeStoppedWithIgnitionOn totalTimeWithIgnitionOn
  }
}
```

```graphql
query Events($filter: ListEventsFilterInput!, $first: Int, $after: String) {
  listEventsWithCursor(filter: $filter, first: $first, after: $after,
    orderBy: ["reportedAt"], orderDirections: [ASC]) {
    edges { cursor node { id reportedAt slugName isAlarm address latitude longitude
      attributes driverId vehicleId driver { id name cpf }
      vehicle { id plate } geofence { name maxSpeed } } }
    pageInfo { endCursor hasNextPage }
  }
}
```

```graphql
query Fuellings($filter: ListFuellingsFilterInput, $limit: Int, $offset: Int) {
  listFuellings(filter: $filter, limit: $limit, offset: $offset) {
    id occurredAt amount cost autonomyInKilometersPerLiter
    distanceTraveledInKilometers odometer driverId vehicleId
  }
}
```

Use alternate-key PATCH URLs:

```text
new_telemetriadiariainfleets(new_chavetelemetria='<escaped vehicleId|yyyy-MM-dd>')
new_eventoinfleets(new_infleeteventid='<escaped eventId>')
```

Use `new_veiculo@odata.bind` always and `new_motorista@odata.bind` only when resolved.

- [ ] **Step 3: Create secret variable and connection reference in DEV/AppBetinhos**

`provision-infleet-flow-dev.ps1` must create metadata only when missing, never read or output the secret current value, and require the secret value through a `SecureString` runtime parameter when it must be set.

- [ ] **Step 4: Create flow and add it to AppBetinhos**

POST the definition to the South America Power Automate endpoint for DEV, then invoke Dataverse `AddSolutionComponent` for component type `29` and the returned workflow ID. Keep the flow off until validation prerequisites pass.

- [ ] **Step 5: Run definition tests**

Run: `npm run test:infleet-flow`

Expected: all structural, pagination, concurrency, environment, and secret-leak assertions pass.

- [ ] **Step 6: Validate DEV flow without activation**

Confirm the flow belongs to AppBetinhos, references only DEV connections, contains no literal Bearer token, and uses alternate-key PATCH actions.

- [ ] **Step 7: Commit Task 2**

```powershell
git add power-platform/infleet/flow-definition.dev.json scripts/provision-infleet-flow-dev.ps1 scripts/test-infleet-flow-definition.mjs package.json package-lock.json
git commit -m "feat(flow): sincronizar telemetria Infleet no DEV" -m "Adiciona fluxo solution-aware paginado, concorrência controlada e upserts sem duplicação."
```

---

### Task 3: Add telemetry to the dashboard Frota tab

**Files:**
- Modify: `Dashboard.html`
- Modify: `scripts/test-dashboard-tv-build.cjs`

**Interfaces:**
- Consumes: `new_telemetriadiariainfleets` and `new_eventoinfleets` produced by Tasks 1-2.
- Produces: Frota KPIs, trend/ranking/event charts, mapping diagnostic, and searchable per-plate table.

- [ ] **Step 1: Add failing build assertions**

Assert generated `dist/Dashboard.html` contains:

```js
assert.match(html, /new_telemetriadiariainfleets/);
assert.match(html, /new_eventoinfleets/);
assert.match(html, /loadTelemetriaInfleet/);
assert.match(html, /renderInfleetTelemetry/);
assert.match(html, /Infleet/);
```

Run: `npm run build && npm run test:tv`

Expected: assertion failure before implementation.

- [ ] **Step 2: Extend the data contract surgically**

Add table constants, exact field maps, `DB.telemetriaInfleet`, `DB.eventosInfleet`, loaders with explicit `$select`, and Frota lazy dependencies. Do not change unrelated datasets.

- [ ] **Step 3: Filter and aggregate once**

Add a pure helper that accepts daily/event rows plus active dates and returns:

```js
{
  distanceKm, weightedAverageSpeed, maximumSpeed, speedingCount,
  stoppedWithIgnitionMinutes, staleVehicleCount,
  dailyTrend, vehicleRanking, eventsByType, unmappedDriverCount, vehicleRows
}
```

Weight average speed by distance when distance is positive. Never average averages without a weight.

- [ ] **Step 4: Render Frota telemetry UI**

Add compact KPI cards, one daily trend chart, one vehicle ranking table/chart, event distribution, mapping diagnostic, and per-plate table. Reuse existing chart/table helpers, colors, date filters, loading behavior, and responsive contracts.

- [ ] **Step 5: Run dashboard verification**

Run:

```powershell
npm run build
npm run test:tv
npm run test:tv-compat
```

Expected: all commands exit `0`; generated HTML contains telemetry loaders/renderers and no Infleet credential.

- [ ] **Step 6: Commit Task 3**

```powershell
git add Dashboard.html dist/Dashboard.html build-info.json scripts/test-dashboard-tv-build.cjs
git commit -m "feat(dashboard): exibir telemetria Infleet da frota" -m "Adiciona KPIs, tendências, ranking e diagnóstico usando dados agregados do Dataverse."
```

---

### Task 4: Validate idempotency and temporal attribution in DEV

**Files:**
- Create: `scripts/validate-infleet-dev.ps1`
- Create: `power-platform/infleet/VALIDATION.md`

**Interfaces:**
- Consumes: deployed schema, flow, Infleet token, DEV sample rows.
- Produces: reproducible validation report without secrets or personal identifiers.

- [ ] **Step 1: Implement read-only validation script**

The script must query counts and sampled hashes by alternate key, detect duplicate technical keys, verify required vehicle lookups, count empty driver lookups by mapping status, and compare before/after reruns.

- [ ] **Step 2: Execute first controlled three-day run**

Enable flow only after schema/connection validation, run once, and record counts by table and date.

- [ ] **Step 3: Execute identical rerun**

Run the same window again. Expected: zero duplicate keys and unchanged row counts, except legitimate source additions during the interval.

- [ ] **Step 4: Validate temporal driver cases**

Sample a vehicle with multiple drivers at different event times. Verify each event lookup matches its Infleet driver ID; daily row shows distinct driver count and multiple-driver flag without claiming one driver.

- [ ] **Step 5: Validate unknown mappings**

Confirm unknown driver events persist with empty lookup and diagnostic status. Confirm unknown vehicle events do not create orphan telemetry.

- [ ] **Step 6: Record evidence and final checks**

`VALIDATION.md` must contain timestamps, environment/solution IDs, counts, commands, and pass/fail results, but no token, CPF, coordinates, or raw payloads.

Run final:

```powershell
npm run test:infleet-schema
npm run test:infleet-flow
npm run build
npm run test:tv
npm run test:tv-compat
git diff --check
```

- [ ] **Step 7: Commit Task 4**

```powershell
git add scripts/validate-infleet-dev.ps1 power-platform/infleet/VALIDATION.md
git commit -m "test(infleet): validar idempotência no DEV" -m "Registra evidências de chaves únicas, reprocessamento e atribuição temporal sem dados sensíveis."
```

