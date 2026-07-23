import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync(new URL("../Dashboard.html", import.meta.url), "utf8");
const snapshotExporter = fs.readFileSync(new URL("./export-prod-snapshot.ps1", import.meta.url), "utf8");

for (const expected of [
  'telemetriaInfleet: "new_telemetriadiariainfleets"',
  'eventosInfleet: "new_eventoinfleets"',
  'viagensInfleet: "new_viageminfleets"',
  'function loadTelemetriaInfleet()',
  'function loadEventosInfleet()',
  'function loadViagensInfleet()',
  'function renderInfleetTelemetry(dvDisabled, vehicleScopeIds = null)',
  'id="infKm"',
  'id="infVelMedia"',
  'id="infVelMax"',
  'id="infExcessos"',
  'id="tblInfleetVeiculos"',
  'id="tblInfleetEventos"',
  'id="tblInfleetMotoristas"',
  'id="tblInfleetHealth"',
  'id="tblInfleetMapping"',
  'id="cInfleetKm"',
  'id="metaInfleetHealth"',
  'id="metaInfleetMapping"',
  'id="metaInfleetTrend"',
  'infleetDriverId: "new_infleetdriverid"',
  'id="infAutonomia"',
  'id="infOciosidade"',
]) {
  assert.ok(html.includes(expected), `Contrato ausente: ${expected}`);
}

assert.match(html, /Requer identificador InFleet\/CPF/, "Diagnostico deve manter mapeamento seguro por ID ou CPF");

assert.match(
  html,
  /frota:\s*\[[^\]]*"telemetriaInfleet"[^\]]*"eventosInfleet"[^\]]*"viagensInfleet"[^\]]*\]/,
  "Telemetria deve carregar somente como dependencia da aba Frota",
);
assert.match(html, /\$filter=\$\{F\.infleetDiaria\.data\} ge 2026-01-01/);
assert.match(html, /\$filter=\$\{F\.infleetEvento\.reportadoEm\} ge 2026-01-01T00:00:00Z/);
assert.doesNotMatch(html, /api\.infleet\.com\.br/, "Dashboard nao pode chamar a Infleet diretamente");
assert.doesNotMatch(html, /Bearer\s+[A-Za-z0-9._-]{20,}/, "Dashboard nao pode conter token Bearer");

for (const expected of [
  'telemetriaInfleet = "$api/new_telemetriadiariainfleets?',
  'eventosInfleet = "$api/new_eventoinfleets?',
  'viagensInfleet = "$api/new_viageminfleets?',
  '$optionalQueries = @("telemetriaInfleet", "eventosInfleet", "viagensInfleet")',
  "if ($Optional -and $lastStatusCode -eq 404)",
  "warnings = $warnings.ToArray()",
]) {
  assert.ok(snapshotExporter.includes(expected), `Contrato de snapshot Infleet ausente: ${expected}`);
}

console.log("Infleet dashboard contract OK");
