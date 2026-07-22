import assert from "node:assert/strict";
import fs from "node:fs";

const schema = JSON.parse(
  fs.readFileSync(new URL("../power-platform/infleet/schema.dev.json", import.meta.url), "utf8"),
);

assert.equal(schema.target.environmentId, "25a2ab78-cf07-ee41-a124-457aa2c29aea");
assert.equal(schema.target.orgUrl, "https://org23b93544.crm2.dynamics.com");
assert.equal(schema.target.solutionUniqueName, "AppBetinhos");
assert.equal(schema.target.publisherPrefix, "new");
assert.deepEqual(schema.tables.new_telemetriadiariainfleet.alternateKey, ["new_chavetelemetria"]);
assert.deepEqual(schema.tables.new_eventoinfleet.alternateKey, ["new_infleeteventid"]);
assert.equal(schema.tables.new_telemetriadiariainfleet.lookups.new_veiculo.required, true);
assert.equal(schema.tables.new_eventoinfleet.lookups.new_motorista.required, false);

const allColumns = Object.values(schema.tables).flatMap((table) => table.columns);
assert.ok(allColumns.some((column) => column.logicalName === "new_velocidademedia"));
assert.ok(allColumns.some((column) => column.logicalName === "new_excessosdevelocidade"));
assert.ok(allColumns.some((column) => column.logicalName === "new_statusmapeamentomotorista"));

for (const [logicalName, table] of Object.entries(schema.tables)) {
  assert.ok(table.entitySetName, `${logicalName}: entitySetName ausente`);
  assert.ok(table.columns.length > 0, `${logicalName}: colunas ausentes`);
  assert.equal(new Set(table.columns.map((column) => column.logicalName)).size, table.columns.length);
}

console.log("Infleet schema contract OK");
