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

const styles = Array.from(html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi), (match) => match[1]).join("\n");
assert.doesNotMatch(styles, /\binset\s*:/i, "CSS final ainda depende da propriedade inset.");
assert.match(styles, /\.tv-browser\s+\.filter-body\s*\{[^}]*display:\s*none/i);
assert.match(styles, /\.tv-browser\s+\.fbar\.open\s+\.filter-body\s*\{[^}]*display:\s*block/i);

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
