const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
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

  for (const id of ["resumo", "servicos", "faturamento", "pagantes", "frota", "motoristas", "manutencoes", "multas", "trocas", "marketing"]) {
    const item = await page.$(`[onclick*="nav('${id}'"]`);
    if (item) {
      await item.click();
      await page.waitForTimeout(120);
    }
  }

  const result = await page.evaluate(() => {
    const tables = [...document.querySelectorAll("table")].filter((t) => t.querySelector("tbody tr"));
    const rows = tables.map((table, idx) => {
      const key = table.tBodies[0]?.id || table.closest("[id]")?.id || `table-${idx}`;
      const ths = [...table.querySelectorAll("thead th")];
      const sorted = ths.filter((th) => th.classList.contains("sa") || th.classList.contains("sd")).map((th) => th.textContent.trim());
      const splitCount = table.querySelectorAll(".metric-split").length;
      return { key, sorted, splitCount, thCount: ths.length };
    });
    return {
      rows,
      missingSort: rows.filter((r) => r.thCount && !r.sorted.length).map((r) => r.key),
      splitCount: document.querySelectorAll(".metric-split").length,
    };
  });

  await page.click("#tbFat").catch(() => {});
  await browser.close();
  console.log(JSON.stringify({ errors, result }, null, 2));
  if (errors.length || result.missingSort.length || result.splitCount < 8) process.exit(2);
})();
