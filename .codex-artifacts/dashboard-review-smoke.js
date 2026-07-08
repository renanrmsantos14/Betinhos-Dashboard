const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const html = path.resolve("Dashboard.html");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const errors = [];

  page.on("pageerror", (e) => errors.push(String(e.message || e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });

  await page.addInitScript(() => {
    class ChartStub {
      constructor(ctx, cfg) {
        this.ctx = ctx;
        this.cfg = cfg;
      }
      destroy() {}
    }
    window.Chart = ChartStub;
    window.ChartDataLabels = {};
  });

  await page.goto(`file:///${html.replace(/\\/g, "/")}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  async function evalTab(id) {
    await page.click(`[onclick*="nav('${id}'"]`);
    await page.waitForTimeout(250);
    return page.evaluate((tabId) => {
      const txt = (sel) => document.querySelector(sel)?.textContent?.trim() || "";
      return {
        id: tabId,
        pageOn: !!document.querySelector(`#page-${tabId}.on`),
        receb: txt("#kRecebPct"),
        aReceberAlerts: [...document.querySelectorAll(".exec-alert span")]
          .map((e) => e.textContent.trim())
          .filter((t) => t.toLowerCase() === "a receber").length,
        statusTable: !!document.querySelector("#tblStatusResumo table"),
        topFat: !!document.querySelector("#tblTopFatResumo table"),
        servTipo: !!document.querySelector("#tblServicosTipo table"),
        tipoVei: !!document.querySelector("#tblTipoVei table"),
        pagOld: !!document.querySelector("#tbPag"),
        payInsight: txt("#paymentInsight"),
        frotaKpi: !![...document.querySelectorAll("#page-frota .tc-title")]
          .find((e) => e.textContent.includes("KPIs de manutencao")),
        multaTipo: !!document.querySelector("#cMulTipo"),
      };
    }, id);
  }

  const results = [];
  for (const id of ["resumo", "servicos", "pagantes", "frota", "multas"]) {
    results.push(await evalTab(id));
  }

  await page.screenshot({ path: ".codex-artifacts/dashboard-review-smoke.png", fullPage: true });
  await browser.close();
  console.log(JSON.stringify({ errors, results }, null, 2));
  if (errors.length) process.exit(2);
})();
