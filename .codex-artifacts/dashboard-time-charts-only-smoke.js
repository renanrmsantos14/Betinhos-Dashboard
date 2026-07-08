const fs = require("fs");

const html = fs.readFileSync("Dashboard.html", "utf8");
const allowedCanvasIds = new Set([
  "cTotalProd",
  "cMetaVsReal",
  "cFatCli",
  "cTicketMedio",
  "cCF",
  "cMM",
  "cFM2",
  "cMotMes",
  "cManMes",
  "spFat",
  "spSrv",
  "spTk",
  "spReceber",
  "spSemValor",
  "spRecebPct",
]);
const requiredTables = [
  "tblServicosTipo",
  "tblTipoVei",
  "tblTopVolResumo",
  "tblFatStatus",
  "tblFormaPag",
  "tblStatusPag",
  "tblFrotaStatus",
  "tblFrotaMarca",
  "tblManTipo",
  "tblMulStatus",
  "tblMulMot",
  "tblMulTipo",
  "tblTrcStatus",
  "tblTrcTipo",
  "tblMktCat",
  "tblMktStatus",
];

const canvasIds = [...html.matchAll(/<canvas[^>]+id="([^"]+)"/g)].map((m) => m[1]);
const unexpectedCanvas = canvasIds.filter((id) => !allowedCanvasIds.has(id));
const missingTables = requiredTables.filter((id) => !html.includes(`id="${id}"`));
const staleCharts = [
  "cServicosTipo",
  "cTipoVei",
  "cTC",
  "cFatSt",
  "cForma",
  "cPagSt",
  "cFrotaSt",
  "cFrotaMarca",
  "cManTipo",
  "cMulSt",
  "cMulMot",
  "cMulTipo",
  "cTrcSt",
  "cTrcTp",
  "cMktCat",
  "cMktSt",
].filter((id) => html.includes(`mkChart("${id}"`) || html.includes(`id="${id}"`));

const result = { canvasIds, unexpectedCanvas, missingTables, staleCharts };
console.log(JSON.stringify(result, null, 2));
if (unexpectedCanvas.length || missingTables.length || staleCharts.length) process.exit(2);
