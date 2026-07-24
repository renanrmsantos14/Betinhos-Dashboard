const assert = require("node:assert/strict");
const fs = require("node:fs");
const XLSX = require("xlsx");

const sourcePath = process.argv[2] || "C:/Users/mendo/Downloads/relatório-de-jornada-e-interjornada-5-6-2026-marqponto.xlsx";
const workbook = XLSX.read(fs.readFileSync(sourcePath), { cellDates: true });
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
const headers = rows[0].map(String);
assert.deepEqual(headers, ["Data", "Funcionário", "Horas necessárias", "Horas trabalhadas", "Horas extras", "Horas faltantes", "Pontos do dia"]);
const records = rows.slice(1).filter((row) => row[0] && row[1]);
assert.equal(records.length, 283);
assert.equal(new Set(records.map((row) => row[1])).size, 11);
assert.equal(records[0][0], "25/06/2026");
assert.equal(records.at(-1)[0], "23/07/2026");

const points = String(records[0][6]).split(/\s*-\s*/).map((value) => {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
});
assert.equal(points.length, 4);
assert.equal(points[1] - points[0] + points[3] - points[2], 810);
console.log(`MarQPonto parser contract OK: ${records.length} registros, ${new Set(records.map((row) => row[1])).size} colaboradores.`);
