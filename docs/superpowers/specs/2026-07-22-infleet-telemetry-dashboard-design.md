# Infleet Telemetry Dashboard Design

## Objective

Bring Infleet fleet telemetry into Dataverse and expose it in `Dashboard.html` with high read performance, idempotent synchronization, temporal driver attribution, and no credentials in browser code.

## Confirmed source

- Environment: `Default-bed8b3ad-d487-4193-a748-09e16f0e0327` (`Betinhos Executive Service (default)`).
- Region: `brazilsouth`; Flow endpoint: `https://southamerica.api.flow.microsoft.com`.
- Infleet endpoint: `POST https://api.infleet.com.br/v1/graphql` with Bearer authentication.
- Existing flows: `Webhook Infleet`, `API Infleet Autonomia`, `API InFleet Ranking`, and `API InFleet EVENTOS`; all were stopped during discovery.
- Existing flows prove `listFuellings` and `listEvents` access and currently send results to Excel through Office Scripts.

## Architecture

Use a solution-aware scheduled Power Automate flow as the integration boundary:

```text
Infleet GraphQL -> Power Automate -> Dataverse -> Dashboard.html
```

The browser never calls Infleet. Power Automate reads a secret environment variable, normalizes source records, resolves Dataverse lookups, and performs idempotent upserts. The dashboard reads compact Dataverse tables using its existing date filters and lazy tab loading.

The flow reprocesses a rolling three-day window. Trigger concurrency is `1`. Retrying the same period corrects records without increasing row counts.

## Identity and relationship rules

### Vehicle

- Canonical record: `cr40f_veiculos`.
- Add unique `Infleet Vehicle ID` and normalized plate fields.
- Resolve by Infleet ID first; use normalized plate only for initial mapping.
- Never create a vehicle automatically from telemetry.
- Telemetry without a mapped vehicle is rejected into synchronization diagnostics; no orphan telemetry row is created.

### Driver

- Canonical record: `cr40f_funcionarios`.
- Add unique `Infleet Driver ID` and normalized CPF fields.
- Resolve by Infleet ID first, normalized CPF second, and never by name.
- Never create a driver automatically.
- Telemetry with an unknown driver is saved with an empty driver lookup plus external ID, received name, and mapping status.

### Temporal attribution

A vehicle can be used by different drivers, but not simultaneously. `cr40f_veiculos.cr40f_motoristaatual` and `cr40f_funcionarios.cr40f_veiculoatual` remain current-state snapshots and are never used to infer historical attribution.

Each event stores the driver lookup valid at `reportedAt`. A vehicle may therefore have events from multiple drivers on the same day. The daily vehicle summary does not claim a single driver; it stores driver count and a multiple-driver indicator. Driver rankings use temporally attributed events or trips, not the current-driver fields.

## Dataverse model

### Changes to `cr40f_veiculos`

- Infleet Vehicle ID: text; alternate key.
- Normalized plate: text; indexed lookup aid.
- Last Infleet synchronization: date/time.

### Changes to `cr40f_funcionarios`

- Infleet Driver ID: text; alternate key.
- Normalized CPF: text; indexed lookup aid.
- Last Infleet synchronization: date/time.

### New daily telemetry table

Grain: one vehicle per local calendar day.

Alternate key: technical key `InfleetVehicleId|yyyy-MM-dd`.

Fields:

- required vehicle lookup;
- technical key, Infleet vehicle ID, normalized plate, and local date;
- driver count and multiple-driver flag;
- distance traveled;
- initial and final odometer when available;
- average and maximum speed;
- moving time, stopped time, stopped-with-ignition time, and ignition-on time;
- total event count and speeding event count;
- fuel amount, fuel cost, and autonomy metrics;
- source window start/end and synchronized-at timestamp.

### New event table

Grain: one Infleet event.

Alternate key: Infleet Event ID.

Fields:

- required vehicle lookup and optional driver lookup;
- Infleet event, vehicle, and driver IDs;
- normalized plate and received driver name;
- event slug/type and description;
- reported date/time;
- recorded speed and applicable speed limit when provided;
- address, latitude, longitude, and geofence;
- alarm flag;
- driver mapping status;
- synchronized-at timestamp.

Raw GraphQL JSON is not duplicated in Dataverse.

## Synchronization flow

1. Trigger once daily with concurrency `1`.
2. Calculate Brasília-local three-day window and convert boundaries to UTC.
3. Load active Dataverse vehicle and driver maps once with explicit `$select` fields.
4. Query Infleet vehicles and map them by Infleet ID, then normalized plate.
5. For each mapped vehicle/day, call `routeVehicleDetails` and upsert the daily summary.
6. Query Infleet events with cursor pagination for the complete window.
7. Resolve the event driver by Infleet ID, then normalized CPF when supplied.
8. Upsert each event using Infleet Event ID.
9. Aggregate event counts, speeding counts, distinct driver counts, fuelling totals, and autonomy into the daily record.
10. Mark the run successful only after all pages are consumed; otherwise record partial/failure diagnostics.

Dataverse writes use alternate-key upsert, never blind create. Internal parallelism is bounded to avoid connector throttling. HTTP retry applies only to `408`, `429`, and `5xx`, using progressive delay.

## Dashboard design

Extend the current Frota tab without calling Infleet directly. Add Dataverse datasets to the existing lazy dependency map and reuse the existing date filters.

Display:

- kilometers traveled;
- fleet average speed and highest recorded speed;
- speeding event count;
- stopped-with-ignition time;
- vehicles without recent data;
- daily distance trend;
- vehicle ranking;
- event distribution by type;
- per-plate telemetry table;
- driver-mapping diagnostic count.

Queries request only fields required by the active view. Rendering aggregates the already-filtered telemetry dataset and preserves current dashboard behavior and design contracts.

## Failure handling

- Infleet failure: retain last valid Dataverse data and log the run as failed.
- Unmapped vehicle: write diagnostic context and skip telemetry persistence.
- Unmapped driver: persist telemetry with empty lookup and mapping status.
- Incomplete GraphQL pagination: fail the run; do not mark the window complete.
- Individual upsert failure: record external ID, continue the bounded batch, and finish as partial.
- Secret management: Infleet token lives in a secret Dataverse environment variable and never in HTML, ordinary flow variables, logs, or committed files.

## Verification and acceptance

- Execute the same three-day window twice; daily/event row counts remain unchanged.
- Update a source event and rerun; the existing Dataverse row changes in place.
- Assign two drivers to one vehicle at different times; events retain correct temporal lookups.
- Send an unknown driver; telemetry persists with an empty lookup and diagnostic status.
- Send an unknown vehicle; no orphan telemetry row is created.
- Compare sampled Infleet responses with Dataverse rows and dashboard totals.
- Build the dashboard and run its existing smoke checks.
- Confirm no Infleet token appears in flow exports, dashboard source, logs, or Git diff.

## Scope boundaries

- Do not store every GPS position.
- Do not create vehicle or employee records automatically.
- Do not infer historical driver from current vehicle/employee lookups.
- Do not use Excel as the dashboard data source.
- Do not redesign unrelated dashboard sections.
