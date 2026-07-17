const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('Dashboard.html', 'utf8');
const contract = /#page-servicos \.service-summary-card > \.metric-list\s*\{[\s\S]*?align-self:\s*center;[\s\S]*?margin-block:\s*auto;/;

assert.match(html, contract, 'o painel de métricas precisa ser centralizado verticalmente no card pai');
console.log('Vertical alignment contract passed');
