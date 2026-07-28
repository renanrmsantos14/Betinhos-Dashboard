import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync(new URL("../Dashboard.html", import.meta.url), "utf8");

assert.match(
  html,
  /function markpointRecordKey\(record\)[\s\S]*record\.employeeKey/,
  "Chave estável por data e colaborador ausente.",
);
assert.match(
  html,
  /cr40f_chavedeimportacao:\s*markpointRecordKey\(record\)/,
  "Payload deve usar chave estável, não hash do arquivo.",
);
assert.match(
  html,
  /async function markpointExistingRecords\(\)/,
  "Consulta de registros existentes ausente.",
);
assert.match(
  html,
  /xrm\.WebApi\.updateRecord\(MARKPOINT_TABLE,\s*recordId,\s*payload\)/,
  "Caminho Xrm deve atualizar registros existentes.",
);
assert.match(
  html,
  /method:\s*recordId\s*\?\s*"PATCH"\s*:\s*"POST"/,
  "Caminho Web API deve alternar entre PATCH e POST.",
);
assert.match(
  html,
  /while\s*\(nextUrl\)[\s\S]*page\["@odata\.nextLink"\]/,
  "Carregamento paginado do Dataverse ausente.",
);
assert.match(
  html,
  /fileName:\s*item\.cr40f_nomedoarquivo\s*\|\|\s*""/,
  "Nome do arquivo não é restaurado do Dataverse.",
);

assert.match(
  html,
  /async function markpointLatestUploadedDate\(\)[\s\S]*\$orderby=cr40f_data desc[\s\S]*\$top=1/,
  "Consulta da ultima jornada enviada ausente.",
);
assert.match(
  html,
  /function markpointOpenMarq\(\)[\s\S]*latest\.getDate\(\) \+ 1[\s\S]*relatorio-de-jornada\?p=1&i=/,
  "Atalho MarQ deve iniciar no dia seguinte a ultima jornada.",
);

console.log("MarQPonto Dataverse: idempotência, lote e paginação OK");
