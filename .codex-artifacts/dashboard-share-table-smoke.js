const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const html = path.resolve("Dashboard.html");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e.message || e)));
  await page.addInitScript(() => {
    class ChartStub {
      constructor() {}
      destroy() {}
    }
    window.Chart = ChartStub;
    window.ChartDataLabels = {};
  });
  await page.goto(`file:///${html.replace(/\\/g, "/")}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.click(`[onclick*="nav('servicos'"]`);
  await page.waitForTimeout(250);

  const before = await page.$$eval("#tblServicosTipo tbody tr", (trs) =>
    trs.map((tr) => [...tr.children].map((td) => td.textContent.trim())),
  );
  await page.click("#tblServicosTipo thead th:nth-child(2)");
  const afterDesc = await page.$$eval("#tblServicosTipo tbody tr", (trs) =>
    trs.map((tr) => [...tr.children].map((td) => td.textContent.trim())),
  );
  await page.click("#tblServicosTipo thead th:nth-child(2)");
  const afterAsc = await page.$$eval("#tblServicosTipo tbody tr", (trs) =>
    trs.map((tr) => [...tr.children].map((td) => td.textContent.trim())),
  );

  const first = afterDesc[0] || [];
  const hasQtyAbs = /%\s*\|\s*\d/.test(first[1] || "");
  const hasMoneyAbs = /%\s*\|\s*R\$/.test(first[2] || "");
  const hasParticipationAbs = /%\s*\|\s*R\$/.test(first[3] || "");
  const descClass = await page.$eval("#tblServicosTipo thead th:nth-child(2)", (th) => th.className);
  const changed = JSON.stringify(afterDesc) !== JSON.stringify(afterAsc);
  await browser.close();

  const result = {
    errors,
    first,
    hasQtyAbs,
    hasMoneyAbs,
    hasParticipationAbs,
    descClass,
    changed,
  };
  console.log(JSON.stringify(result, null, 2));
  if (errors.length || !hasQtyAbs || !hasMoneyAbs || !hasParticipationAbs || !changed) {
    process.exit(2);
  }
})();
