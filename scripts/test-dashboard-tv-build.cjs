const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "dist", "Dashboard.html"), "utf8");

assert.doesNotMatch(html, /<script[^>]+(?:cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net)[^>]*chart/i);
assert.doesNotMatch(html, /<script[^>]+src="tv-compat\.js"/i);
assert.match(html, /<script id="dashboard-tv-compat">/i);
assert.match(html, /id="tvNavigation"/i);
assert.match(html, /function navigateTv\(/i);
const appScripts = Array.from(
  html.matchAll(/<script(?![^>]*id="dashboard-chart-runtime")[^>]*>([\s\S]*?)<\/script>/gi),
  (match) => match[1],
).join("\n");
assert.doesNotMatch(appScripts, /\.flat\s*\(/i, "O código do dashboard ainda depende de Array.prototype.flat.");
assert.doesNotMatch(appScripts, /Object\.values\s*\(/i, "O código do dashboard ainda depende de Object.values.");

const styles = Array.from(html.matchAll(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/gi), (match) => match[1]).join("\n");
assert.doesNotMatch(styles, /\binset\s*:/i, "CSS final ainda depende da propriedade inset.");
assert.match(styles, /\.tv-browser\s+\.filter-body\s*\{[^}]*display:\s*none/i);
assert.match(styles, /\.tv-browser\s+\.fbar\.open\s+\.filter-body\s*\{[^}]*display:\s*block/i);
assert.match(styles, /\.tv-browser\s+\.content\s*\{[^}]*padding:\s*18px\s+64px\s+28px/i, "Area segura 1080p da TV ausente.");
assert.match(styles, /\.tv-browser\s+\.content\s*>\s*\.fbar,[\s\S]*?max-width:\s*none/i, "Dashboard TV ainda esta limitado pelo content-max.");
assert.match(styles, /\.tv-browser\s+\.filter-head\s*\{[^}]*display:\s*flex/i, "Filtro TV ainda depende do empilhamento quebrado.");
assert.match(styles, /\.tv-browser\s+\.filter-body\s+\.quick-filters\s*\{[^}]*display:\s*none/i, "Atalhos rapidos estao duplicados no filtro aberto.");
assert.match(styles, /\.fbar\.ms-open\s*\{[^}]*z-index:\s*5000/i, "Fallback de z-index sem :has ausente.");
assert.match(styles, /@media screen and \(max-width:\s*1600px\)[\s\S]*?\.tv-browser \.kpi-6,[\s\S]*?--metric-columns:\s*3/i, "Grade TV para zoom 125% ausente.");
assert.match(styles, /@media screen and \(max-width:\s*1600px\)[\s\S]*?\.tv-browser \.exec-alerts\s*\{[^}]*grid-template-columns:\s*repeat\(2,/i, "Alertas TV para zoom 125% ausentes.");
assert.match(styles, /html\.tv-browser,[\s\S]*?overflow:\s*hidden/i, "Viewport TV ainda permite scroll da pagina.");
assert.match(styles, /\.tv-browser \.page\.on\s*\{[^}]*height:\s*var\(--tv-page-height/i, "Altura fechada da aba TV ausente.");
assert.match(styles, /\.tv-browser \.fbar\.open\s*\{[^}]*position:\s*fixed/i, "Filtro TV aberto ainda desloca o dashboard.");
assert.match(styles, /body\.filter-sheet-open \.content::before\s*\{[^}]*flex:\s*0\s+0\s+var\(--tv-filter-bar-height\)/i, "Reserva de altura do filtro TV aberto ausente.");
assert.match(styles, /\[data-tv-limit="3"\][\s\S]*?nth-child\(n \+ 4\)/i, "Limite Top 3 da TV ausente.");
assert.match(styles, /\[data-tv-limit="5"\][\s\S]*?nth-child\(n \+ 6\)/i, "Limite Top 5 da TV ausente.");
assert.match(styles, /#page-resumo[\s\S]*?grid-template-rows:\s*104px\s+118px\s+minmax\(0,\s*1fr\)/i, "Composicao TV do Resumo ausente.");
assert.match(appScripts, /function applyTvViewportLayout\(/i, "Medicao da viewport TV ausente.");
assert.match(appScripts, /function markTvTableLimits\(/i, "Marcacao Top 3\/5 da TV ausente.");

const runtimeMatch = html.match(/<script id="dashboard-chart-runtime">([\s\S]*?)<\/script>/i);
assert(runtimeMatch, "Runtime local do Chart.js ausente no HTML final.");

const context = { console };
context.window = context;
context.self = context;
context.globalThis = context;
vm.runInNewContext(runtimeMatch[1], context, { timeout: 10000 });

assert.strictEqual(typeof context.ResizeObserver, "function", "ResizeObserver nao foi incorporado.");
assert.strictEqual(typeof context.Chart, "function", "Chart nao foi exposto globalmente.");
assert(context.ChartDataLabels, "ChartDataLabels nao foi exposto globalmente.");

console.log("Dashboard TV: runtime de graficos incorporado e executavel.");
