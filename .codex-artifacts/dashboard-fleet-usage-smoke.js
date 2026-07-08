const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e.message || e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.addInitScript(() => {
    class ChartStub {
      constructor() {}
      destroy() {}
    }
    window.Chart = ChartStub;
    window.ChartDataLabels = {};
  });
  const html = path.resolve("Dashboard.html");
  await page.goto(`file:///${html.replace(/\\/g, "/")}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.click(`[onclick*="nav('frota'"]`);
  await page.waitForTimeout(250);
  const result = await page.evaluate(() => {
    const txt = (sel) => document.querySelector(sel)?.textContent?.trim() || "";
    const rows = [...document.querySelectorAll("#tblFrotaUso tr")]
      .map((tr) => [...tr.children].map((td) => td.textContent.trim()));
    return {
      week: txt("#frUsoSemana"),
      weekend: txt("#frUsoFim"),
      weekDetail: txt("#frUsoSemanaD"),
      weekendDetail: txt("#frUsoFimD"),
      meta: txt("#metaFrotaUso"),
      rows,
    };
  });
  await browser.close();
  console.log(JSON.stringify({ errors, result }, null, 2));
  const rowOk = result.rows.some((r) => /%/.test(r[1] || "") && /com/.test(r[1] || "") && /sem/.test(r[1] || ""));
  if (errors.length || !/%/.test(result.week) || !/%/.test(result.weekend) || !rowOk) process.exit(2);
})();
