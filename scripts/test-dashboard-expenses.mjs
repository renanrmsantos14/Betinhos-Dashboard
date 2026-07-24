import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync(new URL("../Dashboard.html", import.meta.url), "utf8");
const snapshotExporter = fs.readFileSync(
  new URL("./export-prod-snapshot.ps1", import.meta.url),
  "utf8",
);

for (const expected of [
  'data-nav="despesas"',
  'id="page-despesas"',
  'id="nbDesp"',
  'id="expenseTotal"',
  'id="expenseFood"',
  'id="expensePending"',
  'id="expenseTicket"',
  'id="expenseNoReceipt"',
  'id="expenseNoReservation"',
  'id="cExpenseMonthly"',
  'id="cExpenseCategories"',
  'id="tblExpenseCompanies"',
  'id="tblExpenseDre"',
  'id="tblExpenseFoodDrivers"',
  'function loadDespesas()',
  'function loadCategoriasDespesas()',
  'function loadFormasPagamentoDespesas()',
  'function loadAnexosDespesas()',
  'function renderDespesas(dvDisabled)',
  'function aggregateFoodExpensesByDriver(rows)',
  'function openExpenseRecord(id)',
  'function updateExpenseFilters()',
  'function searchExpenseTable(query)',
]) {
  assert.ok(html.includes(expected), `Contrato de despesas ausente: ${expected}`);
}

for (const removed of [
  'id="tblExpenseHealth"',
  'id="tblExpenseDrivers"',
  'id="tbDespesas"',
  'id="expenseMobileList"',
]) {
  assert.ok(!html.includes(removed), `Contrato removido ainda presente: ${removed}`);
}

assert.doesNotMatch(
  html,
  /renderDistributionTable\(\s*"tblExpenseDrivers"/,
  "Aba Despesas não pode renderizar ranking geral por motorista",
);

for (const expected of [
  'despesas: "cr40f_despesaoperacionals"',
  'categoriasDespesas: "cr40f_categoriadespesaoperacionals"',
  'formasPagamentoDespesas: "cr40f_formapagamentodespesas"',
  'anexosDespesas: "cr40f_anexodespesaoperacionals"',
  'empresa: "cr40f_nomedaempresa"',
  'categoria: "_cr40f_categoria_value"',
  'formaPagamento: "_cr40f_formapagamento_value"',
  'motorista: "_cr40f_motorista_value"',
  'reserva: "_cr40f_reserva_value"',
  'despesa: "_cr40f_despesa_value"',
  'url: "cr40f_urlsharepoint"',
  'shareLink: "cr40f_sharelink"',
]) {
  assert.ok(html.includes(expected), `Schema Dataverse ausente: ${expected}`);
}

assert.match(
  html,
  /despesas:\s*\[[^\]]*"despesas"[^\]]*"categoriasDespesas"[^\]]*"formasPagamentoDespesas"[^\]]*"anexosDespesas"[^\]]*"funcionarios"[^\]]*"reservas"/,
  "Aba Despesas deve carregar fatos, mestres, funcionários e reservas",
);
assert.match(
  html,
  /const EXPENSE_FOOD_CATEGORIES = new Set\(\[\s*"alimentacao",\s*"almoco",\s*"cafe",\s*"jantar",\s*"lanche"/,
  "Alimentação deve reconhecer categoria atual e categorias legadas",
);
assert.match(
  html,
  /entityName:\s*"cr40f_despesaoperacional"/,
  "Ação deve abrir o formulário da despesa no Dataverse",
);
assert.match(
  html,
  /window\.location\.assign\([\s\S]*?pagetype=entityrecord&etn=cr40f_despesaoperacional/,
  "Ação deve ter fallback no mesmo contexto",
);
assert.doesNotMatch(
  html,
  /function loadDespesas\(\)[\s\S]{0,1800}(?:fetch\(["'`]https?:\/\/|Bearer\s+)/,
  "Integração de despesas não pode depender de API externa ou token embutido",
);

for (const expected of [
  'despesas = "$api/cr40f_despesaoperacionals?',
  'categoriasDespesas = "$api/cr40f_categoriadespesaoperacionals?',
  'formasPagamentoDespesas = "$api/cr40f_formapagamentodespesas?',
  'anexosDespesas = "$api/cr40f_anexodespesaoperacionals?',
  "cr40f_nomedaempresa",
  "_cr40f_despesa_value",
  "cr40f_sharelink",
  "cr40f_urlsharepoint",
]) {
  assert.ok(
    snapshotExporter.includes(expected),
    `Contrato de snapshot de despesas ausente: ${expected}`,
  );
}

console.log("Dashboard Despesas: contratos de UI e Dataverse OK");
