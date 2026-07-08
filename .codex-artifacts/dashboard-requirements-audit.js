const path = require("path");
const { chromium } = require("playwright");

const fileUrl = `file:///${path.resolve("Dashboard.html").replace(/\\/g, "/")}`;

function fail(name, detail) {
  return { name, ok: false, detail };
}

function pass(name, detail = "") {
  return { name, ok: true, detail };
}

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
      constructor(ctx, cfg) {
        this.ctx = ctx;
        this.cfg = cfg;
      }
      destroy() {}
    }
    window.Chart = ChartStub;
    window.ChartDataLabels = {};
  });
  await page.goto(fileUrl, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  async function nav(id) {
    await page.click(`[onclick*="nav('${id}'"]`);
    await page.waitForTimeout(250);
  }

  const checks = [];
  const q = (sel) => page.$eval(sel, (el) => el.textContent.trim()).catch(() => "");
  const exists = (sel) => page.$(sel).then(Boolean);
  const count = (sel) => page.$$eval(sel, (els) => els.length).catch(() => 0);

  await nav("resumo");
  const resumoText = await q("#page-resumo");
  const lmAnnual = await page.$$eval("#page-resumo .badge-lm", (els) =>
    els.filter((el) => getComputedStyle(el).display !== "none" && el.offsetParent !== null).length,
  );
  checks.push((await exists("#kRecebPct")) ? pass("Resumo: KPI Recebimento existe", await q("#kRecebPct")) : fail("Resumo: KPI Recebimento existe", "id #kRecebPct ausente"));
  checks.push(lmAnnual === 0 ? pass("Resumo: LM oculto em filtro anual") : fail("Resumo: LM oculto em filtro anual", `${lmAnnual} badges LM visiveis`));
  checks.push((await count(".exec-alert span")) > 0 && ![...(await page.$$eval(".exec-alert span", (els) => els.map((e) => e.textContent.trim().toLowerCase())))].includes("a receber")
    ? pass("Resumo: alerta A receber duplicado removido")
    : fail("Resumo: alerta A receber duplicado removido", "alerta ainda aparece"));
  checks.push(resumoText.includes("sem tabela preco") ? pass("Resumo: Sem preco explicado") : fail("Resumo: Sem preco explicado", "texto nao encontrado"));
  checks.push(resumoText.includes("sem financeiro vinculado") ? pass("Resumo: Sem OP explicado") : fail("Resumo: Sem OP explicado", "texto nao encontrado"));
  checks.push(resumoText.includes("pend./indic.") ? pass("Resumo: Multas pendentes explicadas") : fail("Resumo: Multas pendentes explicadas", "texto nao encontrado"));
  checks.push((await exists("#mvrSummary table")) ? pass("Resumo: Meta x Realizado em tabela") : fail("Resumo: Meta x Realizado em tabela", "tabela ausente"));
  checks.push((await exists("#tblStatusResumo table")) ? pass("Resumo: Status dos Servicos em tabela") : fail("Resumo: Status dos Servicos em tabela", "tabela ausente"));
  checks.push((await exists("#tblTopFatResumo table")) ? pass("Resumo: Top Clientes em tabela") : fail("Resumo: Top Clientes em tabela", "tabela ausente"));

  await nav("servicos");
  checks.push((await exists("#sOpTotal")) && (await exists("#sFinTotal")) ? pass("Servicos: 7 cards otimizados em 2 cards") : fail("Servicos: 7 cards otimizados em 2 cards", "cards densos ausentes"));
  checks.push((await exists("#tblServicosTipo table")) ? pass("Servicos: tipo em tabela percentual") : fail("Servicos: tipo em tabela percentual", "tabela ausente"));
  checks.push((await exists("#tblTipoVei table")) ? pass("Servicos: tipo veiculo em tabela percentual") : fail("Servicos: tipo veiculo em tabela percentual", "tabela ausente"));

  await nav("faturamento");
  const fatMetricSplit = await page.$$eval("#tbFat .metric-split", (els) =>
    els.some((el) => {
      const primary = el.querySelector(".metric-primary")?.textContent.trim() || "";
      const secondary = el.querySelector(".metric-secondary")?.textContent.trim() || "";
      return /%$/.test(primary) && /\d/.test(secondary);
    }),
  ).catch(() => false);
  checks.push(fatMetricSplit ? pass("Faturamento: percentual e valor absoluto aparecem") : fail("Faturamento: percentual e valor absoluto aparecem", "metric-split nao encontrado em #tbFat"));

  await nav("pagantes");
  const pagText = await q("#page-pagantes");
  checks.push((await exists("#pCartao")) ? pass("Pagamentos: card Cartao existe", await q("#pCartao")) : fail("Pagamentos: card Cartao existe", "id #pCartao ausente"));
  checks.push(!(await exists("#tbPag")) ? pass("Pagamentos: tabela Registros removida") : fail("Pagamentos: tabela Registros removida", "#tbPag ainda existe"));
  checks.push(!pagText.includes("REGISTROS") ? pass("Pagamentos: card Registros removido") : fail("Pagamentos: card Registros removido", "texto REGISTROS encontrado"));
  checks.push(pagText.includes("falta incluir no fetch") ? pass("Pagamentos: tempo de pagamento marcado como pendente de schema") : fail("Pagamentos: tempo de pagamento marcado como pendente de schema", "nota ausente"));

  await nav("frota");
  const frotaText = await q("#page-frota");
  for (const label of ["Preventiva programada", "Preventiva condicao", "Corretiva nao critica", "Corretiva critica", "Conservacao", "Avaria"]) {
    checks.push(frotaText.includes(label) ? pass(`Frota: card ${label}`) : fail(`Frota: card ${label}`, "ausente"));
  }
  checks.push((await exists("#page-frota table")) && frotaText.includes("KPIs de manutencao") ? pass("Frota: tabela de KPIs criada") : fail("Frota: tabela de KPIs criada", "ausente"));

  await nav("multas");
  const multasText = await q("#page-multas");
  checks.push((await exists("#tblMulTipo table")) ? pass("Multas: tipo de multa em tabela") : fail("Multas: tipo de multa em tabela", "tabela ausente"));
  checks.push(multasText.includes("Campo de tipo/infracao nao esta no fetch atual") ? pass("Multas: fallback de schema declarado") : fail("Multas: fallback de schema declarado", "nota ausente"));

  await browser.close();
  const failed = checks.filter((c) => !c.ok);
  console.log(JSON.stringify({ pageErrors: errors, total: checks.length, failed, checks }, null, 2));
  if (errors.length || failed.length) process.exit(2);
})();
