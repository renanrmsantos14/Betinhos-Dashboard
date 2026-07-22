import fs from "node:fs";
import path from "node:path";

const csvPath = process.argv[2];
if (!csvPath) throw new Error("Informe o caminho do CSV de faturamento.");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ";") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows;
}

function parseMoney(value) {
  const text = String(value || "").trim();
  const negative = text.includes("(") && text.includes(")");
  const normalized = text.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const amount = Number.parseFloat(normalized) || 0;
  return negative ? -amount : amount;
}

function isoDateTime(dateValue, timeValue) {
  const match = String(dateValue || "").trim().match(/^(\d{2})\/(\d{2})\/(2026)$/);
  if (!match) return "";
  const time = /^\d{1,2}:\d{2}(?::\d{2})?$/.test(String(timeValue || "").trim())
    ? String(timeValue).trim()
    : "12:00";
  const [hour, minute, second = "00"] = time.split(":");
  return `${match[3]}-${match[2]}-${match[1]}T${hour.padStart(2, "0")}:${minute}:${second}-03:00`;
}

const parsed = parseCsv(fs.readFileSync(csvPath, "utf8").replace(/^\uFEFF/, ""));
const headers = parsed.shift().map((value) => value.trim());
const column = Object.fromEntries(headers.map((name, index) => [name, index]));
const required = ["Data", "hora", "Status", "Motorista", "Carro", "ID", "Cliente", "Tipo do Serviço", "Tipo de Veículo", "VALOR FINAL"];
for (const name of required) {
  if (!(name in column)) throw new Error(`Coluna ausente no CSV: ${name}`);
}

const clean = (value) => String(value || "").trim();
const records = parsed
  .filter((row) => /^\d{2}\/\d{2}\/2026$/.test(clean(row[column.Data])))
  .map((row) => [
    isoDateTime(row[column.Data], row[column.hora]),
    clean(row[column.Status]),
    clean(row[column.Motorista]),
    clean(row[column.Carro]),
    clean(row[column.ID]),
    clean(row[column.Cliente]),
    clean(row[column["Tipo do Serviço"]]),
    clean(row[column["Tipo de Veículo"]]),
    parseMoney(row[column["VALOR FINAL"]]),
  ]);

if (records.length !== 1978) {
  throw new Error(`Quantidade inesperada: ${records.length}; esperado: 1978.`);
}

const dashboardPath = path.resolve("Dashboard.html");
const dashboard = fs.readFileSync(dashboardPath, "utf8");
const startMarker = "      const legacy2026Rows = [";
const endMarker = "      ];";
const start = dashboard.indexOf(startMarker);
const end = dashboard.indexOf(endMarker, start + startMarker.length);
if (start < 0 || end < 0) throw new Error("Marcadores legacy2026Rows não encontrados.");

const body = records.map((record) => `        ${JSON.stringify(record)},`).join("\n");
const updated = `${dashboard.slice(0, start)}${startMarker}\n${body}\n${dashboard.slice(end)}`;
fs.writeFileSync(dashboardPath, updated, "utf8");

const total = records.reduce((sum, record) => sum + record[8], 0);
console.log(`Hardcode 2026 inserido: ${records.length} serviços | R$ ${total.toFixed(2)}`);
