import assert from "node:assert/strict";
import fs from "node:fs";

const flowPath = new URL("../power-platform/infleet/flow-definition.dev.json", import.meta.url);
const flow = JSON.parse(fs.readFileSync(flowPath, "utf8"));
const actions = flow.definition.actions;
const dailyActions = actions.Processar_Ultimos_3_Dias.actions;
const source = JSON.stringify(flow);

assert.equal(actions.Listar_Motoristas_Infleet.type, "Until");
assert.equal(dailyActions.Listar_Historico_Motoristas_Infleet.type, "Until");
assert.equal(dailyActions.Listar_Eventos_Relevantes_Infleet.type, "Until");
assert.equal(actions.Listar_Motoristas_Infleet.actions.Acumular_Motoristas_Infleet.type, "Foreach");
assert.equal(dailyActions.Listar_Historico_Motoristas_Infleet.actions.Acumular_Historico_Motoristas_Infleet.type, "Foreach");
assert.equal(dailyActions.Listar_Eventos_Relevantes_Infleet.actions.Acumular_Eventos_Infleet.type, "Foreach");
assert.equal(actions.Continuar_Apos_Telemetria.type, "Terminate");
assert.equal(actions.Continuar_Apos_Telemetria.inputs.runStatus, "Failed");
assert.equal(dailyActions.Processar_Veiculos.runtimeConfiguration.concurrency.repetitions, 1);
assert.equal(
  dailyActions.Processar_Veiculos.actions.Veiculo_Canonico_Unico.actions.Upsert_Resumo_Diario.actions
    .Registrar_Falha_Resumo_Diario.inputs.name,
  "telemetryErrors",
);
assert.match(
  actions.Continuar_Apos_Telemetria.inputs.runError.message,
  /telemetryErrors/,
  "Falha de telemetria deve expor o diagnostico capturado",
);
assert.deepEqual(actions.Janela_Viagens_Inicio_UTC.runAfter, {
  Processar_Ultimos_3_Dias: ["Succeeded"],
});
assert.match(
  JSON.stringify(actions.Mapear_Motoristas_Infleet),
  /items\('Mapear_Motoristas_Infleet'\)\?\['cpf'\]/,
  "Motorista deve ser conciliado pelo CPF recebido, nunca pelo nome",
);
assert.match(
  JSON.stringify(actions.Mapear_Motoristas_Infleet),
  /new_infleetdriverid/,
  "Motorista conciliado deve receber o InFleet Driver ID",
);

for (const variableName of [
  "infleetDriversOffset",
  "infleetHistoryOffset",
  "infleetEventsOffset",
]) {
  assert.ok(source.includes(variableName), `Paginacao ausente: ${variableName}`);
}

for (const code of [
  "INFLEET_TELEMETRY_PARTIAL_FAILURE",
  "INFLEET_VEHICLES_PAGINATION_REQUIRED",
]) {
  assert.ok(source.includes(code), `Falha observavel ausente: ${code}`);
}

assert.doesNotMatch(source, /"limit"\s*:\s*10000/, "Consulta InFleet nao pode truncar em 10.000 itens");
assert.doesNotMatch(source, /@union\(variables\('infleet(?:Drivers|History|Events)'\)/, "Fluxo nao pode atualizar variavel com autorreferencia");
assert.doesNotMatch(source, /Bearer\s+[A-Za-z0-9._-]{20,}/, "Flow nao pode conter token Bearer");

console.log("Infleet flow definition contract OK");
