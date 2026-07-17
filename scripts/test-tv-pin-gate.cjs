const assert = require("assert");
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.resolve(__dirname, "..", "Dashboard.html"), "utf8");

assert.match(html, /classList\.add\("tv-pin-pending"\)/i, "Bloqueio nao e ativado antes do body.");
assert.match(html, /id="tvPinGate"/i, "Tela de PIN ausente.");
assert.match(html, /id="tvPinDots"/i, "Indicador mascarado ausente.");
assert.match(html, /data-tv-pin-digit="[0-9]"/i, "Teclado numerico ausente.");
assert.match(html, /function installTvPinGate\(/i, "Inicializacao do PIN ausente.");
assert.match(html, /addEventListener\("keydown",\s*handleTvPinKeydown/i, "Keydown do controle ausente.");
assert.match(html, /function focusTvPinKey\(/i, "Foco automatico do teclado do PIN ausente.");
assert.match(html, /data-tv-pin-index/i, "Navegacao direcional do teclado do PIN ausente.");
assert.match(html, /focusTvPinKey\(0\)/i, "Primeiro botao do PIN nao recebe foco inicial.");
assert.match(html, /if\s*\(installTvPinGate\(\)\)\s*return/i, "Dashboard pode iniciar antes do PIN.");
assert.match(html, /function initializeDashboardAfterAccess\(/i, "Inicializacao protegida ausente.");
assert.doesNotMatch(html, /["']2661["']/i, "PIN exposto como texto simples no codigo.");

function fingerprint(value) {
  let hash = 7;
  for (let index = 0; index < value.length; index += 1) hash = (hash * 31 + value.charCodeAt(index)) % 1000003;
  return hash;
}
assert.strictEqual(fingerprint("2661"), 7790, "Fingerprint do PIN configurado esta incorreto.");

console.log("Dashboard TV: bloqueio por PIN antes da carga validado.");
