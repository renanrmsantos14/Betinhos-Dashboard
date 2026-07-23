import assert from "node:assert/strict";
import fs from "node:fs";

const schema = JSON.parse(
  fs.readFileSync(new URL("../power-platform/infleet/schema.dev.json", import.meta.url), "utf8"),
);
const flowText = fs.readFileSync(new URL("../power-platform/infleet/flow-definition.dev.json", import.meta.url), "utf8");
JSON.parse(flowText);

assert.equal(schema.target.environmentId, "25a2ab78-cf07-ee41-a124-457aa2c29aea");
assert.equal(schema.target.orgUrl, "https://org23b93544.crm2.dynamics.com");
assert.equal(schema.target.solutionUniqueName, "AppBetinhos");
assert.equal(schema.target.publisherPrefix, "new");
assert.deepEqual(schema.tables.new_telemetriadiariainfleet.alternateKey, ["new_chavetelemetria"]);
assert.deepEqual(schema.tables.new_eventoinfleet.alternateKey, ["new_infleeteventid"]);
assert.deepEqual(schema.tables.new_viageminfleet.alternateKey, ["new_infleettripid"]);
assert.equal(schema.tables.new_telemetriadiariainfleet.lookups.new_veiculo.required, true);
assert.equal(schema.tables.new_eventoinfleet.lookups.new_motorista.required, false);
assert.equal(schema.tables.new_viageminfleet.lookups.new_veiculo.target, "cr40f_veiculos");
assert.equal(schema.tables.new_viageminfleet.lookups.new_motorista.target, "cr40f_funcionarios");

const allColumns = Object.values(schema.tables).flatMap((table) => table.columns);
assert.ok(allColumns.some((column) => column.logicalName === "new_velocidademedia"));
assert.ok(allColumns.some((column) => column.logicalName === "new_excessosdevelocidade"));
assert.ok(allColumns.some((column) => column.logicalName === "new_statusmapeamentomotorista"));
assert.ok(allColumns.some((column) => column.logicalName === "new_odometrofinal"));
assert.ok(allColumns.some((column) => column.logicalName === "new_combustivelconsumidolitros"));

for (const [logicalName, table] of Object.entries(schema.tables)) {
  assert.ok(table.entitySetName, `${logicalName}: entitySetName ausente`);
  assert.ok(table.columns.length > 0, `${logicalName}: colunas ausentes`);
  assert.equal(new Set(table.columns.map((column) => column.logicalName)).size, table.columns.length);
}

for (const expected of [
  "ListDriversPaginated",
  "Mapear_Veiculos_Infleet",
  "Filtrar_Veiculo_Canonico_Por_Placa",
  "Mapear_Motoristas_Infleet",
  "Filtrar_Funcionario_Canonico_Por_CPF",
  "VehiclesSummaries",
  "DailyWorkMeasures",
  "Processar_Viagens_Por_Veiculo",
  "Atualizar_Mapeamento_Motorista_Viagem",
  "new_viageminfleets",
]) {
  assert.ok(flowText.includes(expected), `Contrato do fluxo ausente: ${expected}`);
}
assert.ok(!flowText.includes("Obter_Detalhes_Rota_Infleet"), "Consulta de rota por veículo/dia não pode permanecer");
assert.ok(
  flowText.includes("formatDateTime(items('Processar_Viagens')?['startedAt'],'yyMMddHHmmss')"),
  "Viagem sem ID da Infleet deve receber GUID determinístico por veículo e início",
);
assert.ok(
  flowText.includes("items('Processar_Viagens_Por_Veiculo')?['id'],'|',items('Processar_Viagens')?['startedAt']"),
  "Chave alternativa da viagem deve ser estável e idempotente",
);
assert.ok(
  flowText.includes("@int(div(coalesce(outputs('Normalizar_Resumo_Veiculo')?['engineIdle'],0),60))"),
  "Motor ocioso decimal da Infleet deve ser convertido para inteiro antes do Dataverse",
);
assert.ok(
  flowText.includes("@int(div(coalesce(items('Processar_Viagens')?['timeAboveMaxConfSpeed'],0),60))"),
  "Tempo acima da velocidade nas viagens deve ser convertido para inteiro",
);
assert.ok(
  flowText.includes("@string(body('Listar_Resumos_Veiculos_Infleet')?['data']?['vehiclesSummaries'])"),
  "Veículo sem resumo Infleet não deve derrubar o processamento diário",
);

assert.ok(
  flowText.includes("\"recordId\": \"@first(body('Filtrar_Motorista_Dataverse_Viagem'))?['cr40f_funcionariosid']\""),
  "Viagem mapeada deve atualizar o cadastro canonico do motorista",
);
assert.ok(
  flowText.includes("\"new_infleetdriverid\": \"@items('Processar_Viagens')?['driver']?['id']\""),
  "Viagem mapeada deve persistir Infleet Driver ID para evitar remapeamento por CPF",
);

console.log("Infleet schema contract OK");
