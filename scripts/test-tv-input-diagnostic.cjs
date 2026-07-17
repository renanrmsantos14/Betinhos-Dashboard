const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "Dashboard.html"), "utf8");

assert.match(html, /data-nav="tvdiagnostico"/i, "Aba de diagnostico ausente.");
assert.match(html, /id="page-tvdiagnostico"/i, "Pagina de diagnostico ausente.");
assert.match(html, /function installTvInputDiagnostic\(/i, "Captura de eventos ausente.");
assert.match(html, /location\.hash\s*!==\s*"#tvdiagnostico"/i, "Atalho direto para o diagnostico ausente.");
assert.match(html, /source:\s*"tv-input-diagnostic"/i, "Envio ao App Log ausente.");
assert.match(html, /addEventListener\("keydown"/i, "Captura de teclado ausente.");
assert.match(html, /\["keydown",\s*"keyup",[\s\S]*?"click"[\s\S]*?"mousemove"[\s\S]*?"wheel"/i, "Lista de eventos do controle incompleta.");
assert.match(html, /\.tv-browser\s+\.tv-diagnostic-nav\s*\{[^}]*display:\s*flex/i, "Aba nao esta limitada a TV.");
assert.match(html, /TV_NAV_IDS\s*=\s*\[[\s\S]*?"tvdiagnostico"/i, "Aba nao participa da navegacao da TV.");
assert.match(html, /TV_NUMERIC_NAV\s*=\s*\{/i, "Atalhos numericos da TV ausentes.");
assert.match(html, /"1":\s*"resumo"/i, "Atalho 1 para Resumo ausente.");
assert.match(html, /"0":\s*"marketing"/i, "Atalho 0 para Marketing ausente.");
assert.match(html, /function handleTvPointerNavigation\(/i, "Captura de pointermove ausente.");
assert.match(html, /TV_POINTER_CLICKS_REQUIRED\s*=\s*3/i, "Regra de tres rajadas ausente.");
assert.match(html, /TV_POINTER_MAX_GESTURE_MS/i, "Movimento segurado nao possui limite de duracao.");
assert.match(html, /function finishTvPointerGesture\(/i, "Finalizacao da rajada de movimento ausente.");
assert.match(html, /tvPointerClickCount\s*>=\s*TV_POINTER_CLICKS_REQUIRED/i, "Contador nao exige tres movimentos.");
assert.match(html, /id="sidebarLastUpdated"/i, "Horario da ultima atualizacao ausente no menu.");
assert.match(html, /function handleTvSidebarReveal\(/i, "Abertura do menu pelo canto esquerdo ausente.");
assert.match(html, /\.tv-browser:not\(\.tv-sidebar-revealed\)\s+\.sidebar/i, "Menu da TV nao inicia recolhido.");
assert.match(html, /function rotateTvPage\(/i, "Rotacao automatica das abas ausente.");
assert.match(html, /tv-auto-page-enter/i, "Animacao da rotacao automatica ausente.");
assert.match(html, /loadAll\(\{\s*silent:\s*true\s*\}\)/i, "Atualizacao silenciosa da TV ausente.");
assert.match(html, /id="tvCurrentMenu"/i, "Indicador da aba atual ausente no topbar.");
assert.match(html, /function updateTvCurrentMenu\(/i, "Sincronizacao do indicador da aba atual ausente.");
assert.match(html, /updateTvCurrentMenu\(id\)/i, "Navegacao nao atualiza o indicador da aba atual.");
assert.match(html, /\.tv-browser:not\(\.tv-sidebar-revealed\)\s+\.tv-current-menu\s*\{[^}]*display:\s*flex/i, "Indicador nao aparece com o menu recolhido.");
assert.match(html, /\.tv-browser\.tv-sidebar-revealed\s+\.tv-current-menu\s*\{[^}]*display:\s*none/i, "Indicador nao some com o menu aberto.");
assert.doesNotMatch(html, /Object\.fromEntries\(/i, "Logger ainda usa Object.fromEntries, indisponivel no Chrome 63 da TV.");

console.log("Dashboard TV: diagnostico de controle e App Log validados.");
