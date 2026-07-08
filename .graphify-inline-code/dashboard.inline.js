// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      // DADOS HARDCODED
      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      const fat2023 = [
        148127.05, 218779.86, 344114.51, 280122.75, 363727.08, 298182.52,
        282676.23, 434144.06, 314675.09, 365644.26, 366559.39, 281865.47,
      ];
      const fat2024 = [
        213816.57, 301775.6, 431967.33, 375306.13, 368946.6, 351496.37,
        296388.78, 476702.85, 401841.79, 553994.72, 413078.59, 330595.71,
      ];
      const fat2025 = [
        336469.65, 454025.84, 519102.26, 490267.63, 627708.67, 458813.7,
        450734.61, 426814.08, 419071.97, 434559.4, 421781.78, 438377.83,
      ];

      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      // DADOS FICTÃCIOS (MOCK) â€” DESENVOLVIMENTO LOCAL
      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      let USING_MOCK_DATA = false;

      function generateMockData() {
        const now = new Date();
        const motores = [
          "JoÃ£o Silva",
          "Carlos Oliveira",
          "Maria Santos",
          "Pedro Costa",
          "Ana Pereira",
          "Lucas Mendes",
          "Fernanda Lima",
          "Ricardo Souza",
          "Juliana Rocha",
          "Bruno Alves",
        ];
        const clientes = [
          "Empresa Alpha",
          "Beta Transportes",
          "Gamma LogÃ­stica",
          "Delta Corp",
          "Epsilon ServiÃ§os",
          "Zeta Holdings",
          "Eta ComÃ©rcio",
          "Theta IndÃºstria",
          "Iota Ltda",
          "Kappa Group",
        ];
        const tiposServ = [
          "Transfer",
          "DisposiÃ§Ã£o",
          "Evento",
          "Aeroporto",
          "Intermunicipal",
          "City Tour",
          "Road Show",
          "Viagem Longa",
        ];
        const tiposVei = [
          "Sedan",
          "SUV",
          "Van",
          "Blindado",
          "Executivo",
          "Standard",
        ];
        const statusRes = [
          "ConcluÃ­do",
          "Pendente",
          "Programado",
          "Cancelado",
          "Em Andamento",
        ];
        const statusFat = ["Faturado", "Pendente", "Pago", "Cancelado"];
        const marcas = [
          "Toyota",
          "Honda",
          "Chevrolet",
          "Volkswagen",
          "Hyundai",
          "Ford",
          "BMW",
          "Mercedes",
        ];
        const modelos = [
          "Corolla",
          "Civic",
          "Onix",
          "Golf",
          "HB20",
          "Fusion",
          "320i",
          "C180",
        ];
        const formasPag = [
          "CartÃ£o",
          "Boleto",
          "PIX",
          "TransferÃªncia",
          "Dinheiro",
        ];
        const tiposMan = [
          "RevisÃ£o",
          "Pneu",
          "ElÃ©trica",
          "MecÃ¢nica",
          "Funilaria",
          "Ar Condicionado",
          "Troca de Ã“leo",
        ];
        const tiposTroca = [
          "Troca Programada",
          "Quebra",
          "ManutenÃ§Ã£o",
          "Upgrade",
        ];
        const catsMkt = [
          "Instagram",
          "LinkedIn",
          "Email",
          "Blog",
          "Folder",
          "Parceria",
        ];
        const statusMkt = ["Publicado", "Em ProduÃ§Ã£o", "Rascunho", "Aprovado"];

        const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const rand = (min, max) =>
          Math.floor(Math.random() * (max - min + 1)) + min;
        const randF = (min, max) =>
          parseFloat((Math.random() * (max - min) + min).toFixed(2));
        const dt = (diasAtras) => {
          const d = new Date(now);
          d.setDate(d.getDate() - diasAtras);
          d.setHours(rand(6, 22), rand(0, 59), 0, 0);
          return d.toISOString();
        };

        const mock = {
          reservas: [],
          precos: [],
          manutencoes: [],
          multas: [],
          trocas: [],
          pagantes: [],
          veiculos: [],
          funcionarios: [],
          marketing: [],
        };

        // PreÃ§os
        for (let i = 0; i < 60; i++) {
          const id = `mock-preco-${i}`;
          const st = r(["Faturado", "Pendente", "Pago"]);
          mock.precos.push({
            cr40f_composicaodeprecosid: id,
            new_valortotal: randF(150, 3500),
            new_status: st,
            "new_status@OData.Community.Display.V1.FormattedValue": st,
          });
        }

        // FuncionÃ¡rios
        for (let i = 0; i < motores.length; i++) {
          const cnh = new Date(now);
          cnh.setFullYear(cnh.getFullYear() + rand(0, 3));
          cnh.setMonth(rand(0, 11));
          mock.funcionarios.push({
            cr40f_funcionariosid: `mock-func-${i}`,
            cr40f_nomecompleto: motores[i],
            new_apelido: motores[i].split(" ")[0],
            cr40f_funcao: r([
              "Motorista",
              "Gerente",
              "Operacional",
              "Administrativo",
            ]),
            cr40f_validadedacnh: cnh.toISOString(),
          });
        }

        // Pagantes (deve vir antes de Reservas para que possam ser referenciados)
        for (let i = 0; i < 40; i++) {
          const st = r(["Pago", "Pendente"]);
          mock.pagantes.push({
            cr40f_pagantesid: `mock-pag-${i}`,
            _cr40f_financeiro_value: `mock-op-${i}`,
            cr40f_status: st,
            "cr40f_status@OData.Community.Display.V1.FormattedValue": st,
            cr40f_valor: randF(150, 3500),
            cr40f_formadepagamento: r(formasPag),
            "cr40f_formadepagamento@OData.Community.Display.V1.FormattedValue":
              r(formasPag),
          });
        }

        // VeÃ­culos
        for (let i = 0; i < 15; i++) {
          const st = r(["DisponÃ­vel", "Em ManutenÃ§Ã£o", "Ativo", "Reservado"]);
          mock.veiculos.push({
            cr40f_veiculosid: `mock-vei-${i}`,
            cr40f_placa: `ABC${rand(1000, 9999)}`,
            cr40f_marca: r(marcas),
            cr40f_modelo: r(modelos),
            cr40f_anodefabricacao: rand(2018, 2024),
            cr40f_blindado: Math.random() > 0.7,
            cr40f_statusdoveiculo: st,
            "cr40f_statusdoveiculo@OData.Community.Display.V1.FormattedValue":
              st,
          });
        }

        // Reservas
        for (let i = 0; i < 120; i++) {
          const dias = rand(0, 180);
          const st = r(statusRes);
          const fatSt = r(statusFat);
          const tipo = r(tiposServ);
          const vei = r(tiposVei);
          const cli = r(clientes);
          const mot = r(motores);
          const precoId =
            mock.precos[i % mock.precos.length]["cr40f_composicaodeprecosid"];
          mock.reservas.push({
            cr40f_reservadeveculosid: `mock-res-${i}`,
            cr40f_dataehorriodesada: dt(dias),
            cr40f_status: st,
            "cr40f_status@OData.Community.Display.V1.FormattedValue": st,
            cr40f_statusdefaturamento: fatSt,
            "cr40f_statusdefaturamento@OData.Community.Display.V1.FormattedValue":
              fatSt,
            cr40f_tipodoservico: tipo,
            "cr40f_tipodoservico@OData.Community.Display.V1.FormattedValue":
              tipo,
            cr40f_tipodeveiculo: vei,
            "cr40f_tipodeveiculo@OData.Community.Display.V1.FormattedValue":
              vei,
            new_categoriadoitem: r(["Standard", "Premium", "Luxo"]),
            _new_composicaodepreco_value: precoId,
            _cr40f_financeiro_value: mock.pagantes[i % mock.pagantes.length]["_cr40f_financeiro_value"],
            cr40f_Motorista: {
              cr40f_nomecompleto: mot,
              new_apelido: mot.split(" ")[0],
            },
            cr40f_Cliente: { cr40f_nomedocliente: cli },
          });
        }

        // ManutenÃ§Ãµes
        for (let i = 0; i < 25; i++) {
          const st = r(["ConcluÃ­do", "Em Andamento", "Pendente"]);
          mock.manutencoes.push({
            cr40f_manutencoesid: `mock-man-${i}`,
            cr40f_datamanutencao: dt(rand(0, 90)),
            cr40f_valor: randF(200, 4500),
            cr40f_status: st,
            "cr40f_status@OData.Community.Display.V1.FormattedValue": st,
            cr40f_tipodoreparo: r(tiposMan),
            "cr40f_tipodoreparo@OData.Community.Display.V1.FormattedValue":
              r(tiposMan),
            _cr40f_placa_carro_value: `mock-vei-${rand(0, 14)}`,
            "_cr40f_placa_carro_value@OData.Community.Display.V1.FormattedValue": `ABC${rand(1000, 9999)}`,
          });
        }

        // Multas
        for (let i = 0; i < 12; i++) {
          const st = r(["Pendente", "Pago", "Indicado"]);
          mock.multas.push({
            cr40f_multasesid: `mock-mul-${i}`,
            cr40f_dataehorario: dt(rand(0, 120)),
            cr40f_status: st,
            "cr40f_status@OData.Community.Display.V1.FormattedValue": st,
            _cr40f_motorista_value: `mock-func-${rand(0, 9)}`,
            "_cr40f_motorista_value@OData.Community.Display.V1.FormattedValue":
              r(motores),
            _cr40f_placa_value: `mock-vei-${rand(0, 14)}`,
            "_cr40f_placa_value@OData.Community.Display.V1.FormattedValue": `ABC${rand(1000, 9999)}`,
          });
        }

        // Trocas
        for (let i = 0; i < 18; i++) {
          const st = r(["ConcluÃ­da", "Pendente", "Aguardando"]);
          mock.trocas.push({
            cr40f_trocasdecarrosid: `mock-trc-${i}`,
            cr40f_dataehorariodatroca: dt(rand(0, 60)),
            cr40f_statusdatroca: st,
            "cr40f_statusdatroca@OData.Community.Display.V1.FormattedValue": st,
            new_tipodetroca: r(tiposTroca),
            "new_tipodetroca@OData.Community.Display.V1.FormattedValue":
              r(tiposTroca),
          });
        }

        // Marketing
        for (let i = 0; i < 30; i++) {
          const st = r(statusMkt);
          mock.marketing.push({
            new_marketingid: `mock-mkt-${i}`,
            new_status: st,
            "new_status@OData.Community.Display.V1.FormattedValue": st,
            new_categoria: r(catsMkt),
            "new_categoria@OData.Community.Display.V1.FormattedValue":
              r(catsMkt),
            new_datadepublicacao: dt(rand(0, 90)).split("T")[0] + "T12:00:00Z",
          });
        }

        return mock;
      }

      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      // CONFIGURAÃ‡Ã•ES DO DATAVERSE
      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      const ENVS = {
        orgf261ae8e: {
          label: "PROD",
          url: "https://orgf261ae8e.crm2.dynamics.com",
          cls: "env-prod",
        },
        appbetinhosdev: {
          label: "DEV",
          url: "https://appbetinhosdev.crm2.dynamics.com",
          cls: "env-dev",
        },
      };
      let BASE = "";
      const API = () => `${BASE}/api/data/v9.2`;

      function makeHeaders(wantAnno, wantPage) {
        const h = new Headers({
          Accept: "application/json",
          "OData-MaxVersion": "4.0",
          "OData-Version": "4.0",
        });
        if (wantAnno) h.append("Prefer", 'odata.include-annotations="*"');
        if (wantPage) h.append("Prefer", "odata.maxpagesize=5000");
        return h;
      }

      const T = {
        reservas: "cr40f_reservadeveculoses",
        precos: "cr40f_composicaodeprecoses",
        manutencoes: "cr40f_manutencoeses",
        multas: "cr40f_multases",
        trocas: "cr40f_trocasdecarros",
        pagantes: "cr40f_paganteses",
        veiculos: "cr40f_veiculoses",
        funcionarios: "cr40f_funcionarioses",
        marketing: "new_marketings",
      };
      const F = {
        res: {
          id: "cr40f_reservadeveculosid",
          data: "cr40f_dataehorriodesada",
          status: "cr40f_status",
          fatStatus: "cr40f_statusdefaturamento",
          tipo: "cr40f_tipodoservico",
          veiTipo: "cr40f_tipodeveiculo",
          navMot: "cr40f_Motorista",
          navCli: "cr40f_Cliente",
          catItem: "new_categoriadoitem",
          lookupPreco: "_new_composicaodepreco_value",
          lookupOP: "_cr40f_financeiro_value",
        },
        preco: { valorTotal: "new_valortotal", status: "new_status" },
        man: {
          data: "cr40f_datamanutencao",
          valor: "cr40f_valor",
          status: "cr40f_status",
          tipo: "cr40f_tipodoreparo",
          veiculo: "cr40f_placa_carro",
        },
        mul: {
          data: "cr40f_dataehorario",
          mot: "cr40f_motorista",
          placa: "cr40f_placa",
          status: "cr40f_status",
        },
        trc: {
          data: "cr40f_dataehorariodatroca",
          status: "cr40f_statusdatroca",
          tipo: "new_tipodetroca",
        },
        pag: {
          lookupOP: "_cr40f_financeiro_value",
          status: "cr40f_status",
          valor: "cr40f_valor",
          forma: "cr40f_formadepagamento",
        },
        vei: {
          placa: "cr40f_placa",
          marca: "cr40f_marca",
          modelo: "cr40f_modelo",
          status: "cr40f_statusdoveiculo",
          blindado: "cr40f_blindado",
          ano: "cr40f_anodefabricacao",
        },
        fun: {
          nome: "cr40f_nomecompleto",
          funcao: "cr40f_funcao",
          cnh: "cr40f_validadedacnh",
          apelido: "new_apelido",
        },
        mkt: {
          status: "new_status",
          cat: "new_categoria",
          data: "new_datadepublicacao",
        },
      };

      let DB = {
        reservas: [],
        precos: [],
        manutencoes: [],
        multas: [],
        trocas: [],
        pagantes: [],
        veiculos: [],
        funcionarios: [],
        marketing: [],
      };
      let VW = { reservas: [], manutencoes: [], multas: [], trocas: [] };
      let charts = {},
        sparks = {},
        srtSt = {},
        tblCache = {};
      let msState = { St: [], Cl: [], Mo: [], Tp: [] };
      let funcMapGlobal = new Map();

      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      // UTILS
      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      const brl = (v) =>
        v == null
          ? "â€”"
          : Number(v).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            });
      const brlS = (v) => {
        if (v == null) return "â€”";
        if (v >= 1e6) return "R$\u00a0" + (v / 1e6).toFixed(2) + "M";
        if (v >= 1e3) return "R$\u00a0" + (v / 1e3).toFixed(1) + "k";
        return brl(v);
      };
      const fmtDt = (v) =>
        v
          ? new Date(v).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "â€”";
      const fmtD = (v) => (v ? new Date(v).toLocaleDateString("pt-BR") : "â€”");
      const pct = (v, t) => (t ? Math.round((v / t) * 100) : 0);

      function mK(v) {
        if (!v) return null;
        // Extrai ano-mÃªs diretamente da string ISO para evitar problemas de fuso horÃ¡rio
        const match = String(v).match(/^(\d{4})-(\d{2})/);
        if (match) return `${match[1]}-${match[2]}`;
        const d = new Date(v);
        return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
      }
      const mL = (k) => {
        if (!k) return "â€”";
        const [y, m] = k.split("-");
        const date = new Date(parseInt(y), parseInt(m) - 1, 1);
        return date
          .toLocaleString("pt-BR", { month: "short", year: "2-digit" })
          .replace(".", "");
      };
      const fv = (r, f) =>
        r[`${f}@OData.Community.Display.V1.FormattedValue`] ?? r[f];
      const sumV = (a) => a.reduce((s, r) => s + (r._valor || 0), 0);
      async function copyToClipboard(text) {
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            showAlert("suc", "âœ… Copiado para a Ã¡rea de transferÃªncia!");
            return true;
          }
        } catch (err) {
          console.warn("Clipboard API failed:", err);
        }
        try {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
          showAlert("suc", "âœ… Copiado para a Ã¡rea de transferÃªncia!");
          return true;
        } catch (err) {
          console.error("Copy failed:", err);
          showAlert("err", "âŒ NÃ£o foi possÃ­vel copiar. Tente manualmente.");
          return false;
        }
      }
      function grp(arr, fn) {
        const m = {};
        for (const r of arr) {
          const k = fn(r) ?? "__null__";
          (m[k] = m[k] || []).push(r);
        }
        return m;
      }
      function mKeys(byM) {
        return Object.keys(byM)
          .filter((k) => k !== "__null__")
          .sort((a, b) => a.localeCompare(b));
      }
      const trunc = (s, n = 22) =>
        s && s.length > n ? s.substring(0, n) + "â€¦" : s || "â€”";
      const stL = (s) => s.toLowerCase();
      const normL = (s) =>
        String(s ?? "")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
      const pad2 = (n) => String(n).padStart(2, "0");
      const ymd = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
      const parseBRDate = (s) => {
        if (!s) return null;
        const [y, m, d] = s.split("-").map(Number);
        return new Date(y, m - 1, d);
      };
      const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
      const clampDate = (year, month, day) =>
        new Date(year, month, Math.min(day, daysInMonth(year, month)));
      const samePeriodLastMonth = (startStr, endStr) => {
        const s = parseBRDate(startStr);
        const e = parseBRDate(endStr);
        if (!s || !e) return null;
        if (s.getDate() === 1 && e.getDate() === daysInMonth(e.getFullYear(), e.getMonth())) {
          const ps = new Date(s.getFullYear(), s.getMonth() - 1, 1);
          const pe = new Date(e.getFullYear(), e.getMonth(), 0);
          return { start: ymd(ps), end: ymd(pe) };
        }
        return {
          start: ymd(clampDate(s.getFullYear(), s.getMonth() - 1, s.getDate())),
          end: ymd(clampDate(e.getFullYear(), e.getMonth() - 1, e.getDate())),
        };
      };
      const samePeriodLastYear = (startStr, endStr) => {
        const s = parseBRDate(startStr);
        const e = parseBRDate(endStr);
        if (!s || !e) return null;
        return {
          start: ymd(clampDate(s.getFullYear() - 1, s.getMonth(), s.getDate())),
          end: ymd(clampDate(e.getFullYear() - 1, e.getMonth(), e.getDate())),
        };
      };
      const inDateRange = (dateValue, startStr, endStr) => {
        if (!dateValue || !startStr || !endStr) return false;
        const day = String(dateValue).slice(0, 10);
        return day >= startStr && day <= endStr;
      };

      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      // REGRA GLOBAL: Dados Dataverse prÃ©-2026 suprimidos
      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      function isDataverseDisabled() {
        // Removida a restriÃ§Ã£o de 2026 para permitir visualizaÃ§Ã£o dos dados
        return false;
      }

      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      // FETCH
      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      async function fetchAll(url) {
        let res = [],
          next = url;
        while (next) {
          const r = await fetch(next, {
            credentials: "same-origin",
            headers: makeHeaders(true, true),
          });
          if (!r.ok) {
            const t = await r.text();
            let msg = `HTTP ${r.status}`;
            try {
              const j = JSON.parse(t);
              msg = j?.error?.message || msg;
            } catch (e) {}
            throw new Error(msg);
          }
          const j = await r.json();
          res = res.concat(j.value || []);
          next = j["@odata.nextLink"] || null;
        }
        return res;
      }

      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      // ENV DETECTION
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ENV DETECTION
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
let IS_LOCAL = false;
function detectEnv(){
  const h=window.location.hostname;
  for(const[k,e] of Object.entries(ENVS)){
    if(h.includes(k)){
      BASE=e.url;
      const p=document.getElementById('envPill');
      p.textContent=e.label;p.className='env-pill '+e.cls;
      IS_LOCAL = false;
      return;
    }
  }
  BASE=window.location.origin;
  const p=document.getElementById('envPill');
  p.textContent='LOCAL';p.className='env-pill env-local';
  IS_LOCAL = true;
}

      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      // LOAD
      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      async function loadAll() {
        clearAlerts();
        setLoading(true, "Iniciando cargaâ€¦");
        const btn = document.getElementById("btnRef");
        btn.disabled = true;
        btn.classList.add("spin");
        try {
          if (IS_LOCAL) {
            // Usar dados fictÃ­cios para desenvolvimento local
            USING_MOCK_DATA = true;
            const mock = generateMockData();
            DB = { ...mock };
            showAlert(
              "warn",
              "<strong>âš ï¸ MODO DESENVOLVIMENTO:</strong> VocÃª estÃ¡ visualizando dados <strong>FICTÃCIOS</strong> gerados apenas para testes. Nenhum dado real estÃ¡ sendo exibido.",
            );
            console.log("[MOCK] Dados fictÃ­cios gerados:", {
              reservas: DB.reservas.length,
              precos: DB.precos.length,
              manutencoes: DB.manutencoes.length,
              multas: DB.multas.length,
              trocas: DB.trocas.length,
              pagantes: DB.pagantes.length,
              veiculos: DB.veiculos.length,
              funcionarios: DB.funcionarios.length,
              marketing: DB.marketing.length,
            });
          } else {
            USING_MOCK_DATA = false;
            await Promise.all([
              loadReservas(),
              loadPrecos(),
              loadManutencoes(),
              loadMultas(),
              loadTrocas(),
              loadPagantes(),
              loadVeiculos(),
              loadFuncionarios(),
              loadMarketing(),
            ]);
          }
          console.log("Dados carregados:", {
            reservas: DB.reservas.length,
            precos: DB.precos.length,
            manutencoes: DB.manutencoes.length,
            multas: DB.multas.length,
            trocas: DB.trocas.length,
            pagantes: DB.pagantes.length,
            veiculos: DB.veiculos.length,
            funcionarios: DB.funcionarios.length,
            marketing: DB.marketing.length,
          });
          buildFuncMap();
          enrichReservas();
          populateFilters();
          quickFilter("esteAno", document.querySelector(".btn-qf.active"));
          const now = new Date().toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });
          document.getElementById("ts").textContent = `Atualizado ${now}`;
        } catch (e) {
          showAlert(
            "err",
            `<strong>Erro ao carregar dados:</strong> ${e.message}`,
          );
          console.error("Erro no loadAll:", e);
        } finally {
          setLoading(false);
          btn.disabled = false;
          btn.classList.remove("spin");
        }
      }

      async function loadReservas() {
        setLoading(true, "Carregando serviÃ§osâ€¦");
        const sel = [
          F.res.id,
          F.res.data,
          F.res.status,
          F.res.fatStatus,
          F.res.tipo,
          F.res.veiTipo,
          F.res.catItem,
          F.res.lookupPreco,
          F.res.lookupOP,
        ].filter(Boolean).join(",");
        const exp = [
          `${F.res.navMot}($select=cr40f_funcionariosid,${F.fun.nome},${F.fun.apelido})`,
          `${F.res.navCli}($select=cr40f_nomedocliente)`,
        ].join(",");
        DB.reservas = await fetchAll(
          `${API()}/${T.reservas}?$select=${sel}&$expand=${exp}&$orderby=${F.res.data} desc`,
        );
      }
      async function loadPrecos() {
        const sel = [
          `cr40f_composicaodeprecosid`,
          F.preco.valorTotal,
          F.preco.status,
        ].join(",");
        DB.precos = await fetchAll(`${API()}/${T.precos}?$select=${sel}`);
      }
      async function loadManutencoes() {
        DB.manutencoes = await fetchAll(
          `${API()}/${T.manutencoes}?$select=${F.man.data},${F.man.valor},${F.man.status},${F.man.tipo},_${F.man.veiculo}_value&$orderby=${F.man.data} desc`,
        );
      }
      async function loadMultas() {
        DB.multas = await fetchAll(
          `${API()}/${T.multas}?$select=${F.mul.data},${F.mul.status},_${F.mul.mot}_value,_${F.mul.placa}_value&$orderby=${F.mul.data} desc`,
        );
      }
      async function loadTrocas() {
        DB.trocas = await fetchAll(
          `${API()}/${T.trocas}?$select=${F.trc.data},${F.trc.status},${F.trc.tipo}&$orderby=${F.trc.data} desc`,
        );
      }
      async function loadPagantes() {
        DB.pagantes = await fetchAll(
          `${API()}/${T.pagantes}?$select=cr40f_pagantesid,${F.pag.lookupOP},${F.pag.status},${F.pag.valor},${F.pag.forma}`,
        );
      }
      async function loadVeiculos() {
        DB.veiculos = await fetchAll(
          `${API()}/${T.veiculos}?$select=${F.vei.placa},${F.vei.marca},${F.vei.modelo},${F.vei.status},${F.vei.blindado},${F.vei.ano}`,
        );
      }
      async function loadFuncionarios() {
        DB.funcionarios = await fetchAll(
          `${API()}/${T.funcionarios}?$select=cr40f_funcionariosid,${F.fun.nome},${F.fun.funcao},${F.fun.cnh},${F.fun.apelido}`,
        );
      }
      async function loadMarketing() {
        DB.marketing = await fetchAll(
          `${API()}/${T.marketing}?$select=${F.mkt.status},${F.mkt.cat},${F.mkt.data}&$orderby=${F.mkt.data} desc`,
        );
      }

      function buildFuncMap() {
        funcMapGlobal.clear();
        for (const f of DB.funcionarios) {
          const nome = f[F.fun.nome] || "";
          const apelido = f[F.fun.apelido] || nome;
          const id = f["cr40f_funcionariosid"];
          if (id) funcMapGlobal.set(id.toLowerCase(), apelido);
          funcMapGlobal.set(nome.toLowerCase(), apelido);
        }
      }

      function enrichReservas() {
        const precoMap = new Map();
        for (const p of DB.precos) {
          const id = p["cr40f_composicaodeprecosid"]?.toLowerCase();
          if (id) {
            const valor = parseFloat(p[F.preco.valorTotal]) || 0;
            const pendente = normL(fv(p, F.preco.status)).includes("pend");
            precoMap.set(id, { valor, pendente });
          }
        }
        console.log(
          "Enriquecendo reservas - precoMap size:",
          precoMap.size,
          "reservas:",
          DB.reservas.length,
        );
        DB.reservas = DB.reservas.map((r) => {
          const entry =
            precoMap.get((r[F.res.lookupPreco] || "").toLowerCase());
          const valor = entry?.valor || 0;
          const cpPendente = entry?.pendente ?? false;
          const nomeMot = r[F.res.navMot]?.[F.fun.nome] || "Sem motorista";
          const motId = String(r[F.res.navMot]?.cr40f_funcionariosid || "").toLowerCase();
          const motDisplay =
            funcMapGlobal.get(nomeMot.toLowerCase()) || nomeMot;
          const motKey = motId || `nome:${motDisplay.toLowerCase()}`;
          return {
            ...r,
            _id: (r[F.res.id] || "").toLowerCase(),
            _motId: motId,
            _motKey: motKey,
            _mot: motDisplay,
            _cli: r[F.res.navCli]?.cr40f_nomedocliente || "Sem cliente",
            _stL: String(fv(r, F.res.status) || "Sem status"),
            _fatStL: String(fv(r, F.res.fatStatus) || "â€”"),
            _tipoL: String(fv(r, F.res.tipo) || "â€”"),
            _veiL: String(fv(r, F.res.veiTipo) || "â€”"),
            _valor: valor,
            _cpPendente: cpPendente,
            _opId: F.res.lookupOP ? (r[F.res.lookupOP] || "").toLowerCase() : "",
            _ts: r[F.res.data] ? new Date(r[F.res.data]).getTime() : 0,
          };
        });
        console.log(
          "Reservas enriquecidas:",
          DB.reservas.length,
          "com valores:",
          DB.reservas.filter((r) => r._valor > 0).length,
        );
      }

      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      // FILTERS
      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      function populateFilters() {
        const setMS = (id, vals, ph) => {
          const btn = document.getElementById(`${id}-btn`);
          const dd = document.getElementById(`${id}-dd`);
          btn.textContent = ph;
          msState[id.replace("ms", "")] = [];
          const opts = vals
            .map((v) => typeof v === "object" ? v : { value: v, label: v })
            .filter((v) => v.value && v.label);
          const unique = [...new Map(opts.map((v) => [v.value, v])).values()]
            .sort((a, b) => a.label.localeCompare(b.label));
          dd.innerHTML = `
      <input type="text" class="ms-search" placeholder="ðŸ” Filtrar opÃ§Ãµesâ€¦" oninput="filterMSOptions('${id}', this.value)">
      <div class="ms-options-container" id="${id}-options">
        ${unique.map((v) => `<label><input type="checkbox" value="${String(v.value).replace(/"/g, "&quot;")}" onchange="msToggle('${id}','${String(v.value).replace(/'/g, "\\'").replace(/"/g, '\\"')}')"><span>${v.label}</span></label>`).join("")}
      </div>
      <div class="ms-actions">
        <button onclick="msSelectAll('${id}',true)">Todos</button>
        <button onclick="msSelectAll('${id}',false)">Nenhum</button>
      </div>
    `;
        };
        setMS(
          "msSt",
          DB.reservas.map((r) => r._stL),
          "Todos status",
        );
        setMS(
          "msCl",
          DB.reservas.map((r) => r._cli),
          "Todos clientes",
        );
        setMS(
          "msMo",
          DB.reservas.map((r) => ({ value: r._motKey || r._mot, label: r._mot })),
          "Todos motoristas",
        );
        setMS(
          "msTp",
          DB.reservas.map((r) => r._veiL),
          "Todos tipos",
        );
      }
      function filterMSOptions(id, query) {
        const container = document.getElementById(`${id}-options`);
        if (!container) return;
        const labels = container.querySelectorAll("label");
        const lowerQ = query.toLowerCase();
        labels.forEach((lbl) => {
          const span = lbl.querySelector("span");
          const text = span.textContent.toLowerCase();
          lbl.style.display = text.includes(lowerQ) ? "flex" : "none";
        });
      }
      function toggleMS(id) {
        const dd = document.getElementById(`${id}-dd`);
        const btn = document.getElementById(`${id}-btn`);
        const isOpen = dd.classList.contains("open");
        document
          .querySelectorAll(".ms-dd")
          .forEach((d) => d.classList.remove("open"));
        document
          .querySelectorAll(".ms-btn")
          .forEach((b) => b.classList.remove("open"));
        if (!isOpen) {
          dd.classList.add("open");
          btn.classList.add("open");
          const inp = dd.querySelector(".ms-search");
          if (inp) setTimeout(() => inp.focus(), 50);
        }
      }
      function msToggle(id, val) {
        const key = id.replace("ms", "");
        const state = msState[key];
        const idx = state.indexOf(val);
        if (idx > -1) state.splice(idx, 1);
        else state.push(val);
        updateMSButton(id);
      }
      function msSelectAll(id, sel) {
        const key = id.replace("ms", "");
        const dd = document.getElementById(`${id}-dd`);
        const opts = dd.querySelectorAll(
          ".ms-options-container input[type=checkbox]",
        );
        if (sel) {
          msState[key] = [...new Set([...opts].map((o) => o.value))];
          opts.forEach((o) => (o.checked = true));
        } else {
          msState[key] = [];
          opts.forEach((o) => (o.checked = false));
        }
        updateMSButton(id);
      }
      function updateMSButton(id) {
        const key = id.replace("ms", "");
        const state = msState[key];
        const btn = document.getElementById(`${id}-btn`);
        const ph = {
          msSt: "Todos status",
          msCl: "Todos clientes",
          msMo: "Todos motoristas",
          msTp: "Todos tipos",
        };
        if (state.length === 0) btn.innerHTML = ph[id];
        else
          btn.innerHTML = `${ph[id]} <span class="sel-count">${state.length}</span>`;
      }
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".ms-wrap")) {
          document
            .querySelectorAll(".ms-dd")
            .forEach((d) => d.classList.remove("open"));
          document
            .querySelectorAll(".ms-btn")
            .forEach((b) => b.classList.remove("open"));
        }
      });

      function applyF() {
        document
          .querySelectorAll(".ms-dd")
          .forEach((d) => d.classList.remove("open"));
        document
          .querySelectorAll(".ms-btn")
          .forEach((b) => b.classList.remove("open"));
        const dS = document.getElementById("fS").value;
        const dE = document.getElementById("fE").value;
        let d = [...DB.reservas];
        if (dS)
          d = d.filter(
            (r) =>
              r[F.res.data] &&
              r[F.res.data] >= new Date(dS + "T00:00:00-03:00").toISOString(),
          );
        if (dE)
          d = d.filter(
            (r) =>
              r[F.res.data] &&
              r[F.res.data] <= new Date(dE + "T23:59:59-03:00").toISOString(),
          );
        if (msState.St.length > 0)
          d = d.filter((r) => msState.St.includes(r._stL));
        if (msState.Cl.length > 0)
          d = d.filter((r) => msState.Cl.includes(r._cli));
        if (msState.Mo.length > 0)
          d = d.filter((r) => msState.Mo.includes(r._motKey || r._mot));
        if (msState.Tp.length > 0)
          d = d.filter((r) => msState.Tp.includes(r._veiL));
        VW.reservas = d;
        tblCache = {};
        renderAll();
      }
      function clearF() {
        ["fS", "fE"].forEach((x) => (document.getElementById(x).value = ""));
        msState = { St: [], Cl: [], Mo: [], Tp: [] };
        ["msSt", "msCl", "msMo", "msTp"].forEach((id) => {
          const btn = document.getElementById(`${id}-btn`);
          btn.innerHTML = {
            msSt: "Todos status",
            msCl: "Todos clientes",
            msMo: "Todos motoristas",
            msTp: "Todos tipos",
          }[id];
          const dd = document.getElementById(`${id}-dd`);
          dd.querySelectorAll("input[type=checkbox]").forEach(
            (i) => (i.checked = false),
          );
          const search = dd.querySelector(".ms-search");
          if (search) {
            search.value = "";
            filterMSOptions(id, "");
          }
        });
        document
          .querySelectorAll(".btn-qf")
          .forEach((b) => b.classList.remove("active"));
        VW.reservas = [...DB.reservas];
        tblCache = {};
        renderAll();
      }
      function quickFilter(period, btnEl) {
        document
          .querySelectorAll(".btn-qf")
          .forEach((b) => b.classList.remove("active"));
        if (btnEl) btnEl.classList.add("active");
        const now = new Date();
        const nowBR = new Date(now.getTime() - 3 * 60 * 60 * 1000);
        const y = nowBR.getFullYear(),
          m = nowBR.getMonth();
        let sDate = "",
          eDate = nowBR.toISOString().split("T")[0];
        switch (period) {
          case "hoje":
            sDate = eDate;
            break;
          case "ult7":
            {
              const d = new Date(nowBR);
              d.setDate(d.getDate() - 6);
              sDate = d.toISOString().split("T")[0];
            }
            break;
          case "ult30":
            {
              const d = new Date(nowBR);
              d.setDate(d.getDate() - 29);
              sDate = d.toISOString().split("T")[0];
            }
            break;
          case "esteMes":
            sDate = `${y}-${String(m + 1).padStart(2, "0")}-01`;
            break;
          case "mesAnt":
            {
              const s = new Date(y, m - 1, 1),
                e = new Date(y, m, 0);
              sDate = s.toISOString().split("T")[0];
              eDate = e.toISOString().split("T")[0];
            }
            break;
          case "esteAno":
            sDate = `${y}-01-01`;
            break;
          case "anoAnt":
            sDate = `${y - 1}-01-01`;
            eDate = `${y - 1}-12-31`;
            break;
        }
        document.getElementById("fS").value = sDate;
        document.getElementById("fE").value = eDate;
        applyF();
      }

      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      // META INTELIGENTE
      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      function getHistoricalFat(ano, mes) {
        if (ano === 2023 && typeof fat2023 !== "undefined") return fat2023[mes] || 0;
        if (ano === 2024 && typeof fat2024 !== "undefined") return fat2024[mes] || 0;
        if (ano === 2025 && typeof fat2025 !== "undefined") return fat2025[mes] || 0;
        return 0;
      }
      function calcularMetaMensal(ano, mes) {
        // Meta = 50% ano anterior + 40% 2 anos atrÃ¡s + 10% 3 anos atrÃ¡s, +13%
        const v1 = getHistoricalFat(ano - 1, mes);
        const v2 = getHistoricalFat(ano - 2, mes);
        const v3 = getHistoricalFat(ano - 3, mes);
        const base = v1 * 0.5 + v2 * 0.4 + v3 * 0.1;
        return Math.round(base * 1.13);
      }
      function getMetaParaPeriodo(startStr, endStr) {
        if (!startStr || !endStr) return 0;

        const start = new Date(startStr + "T00:00:00-03:00");
        const end = new Date(endStr + "T23:59:59-03:00");
        const startMonth = start.getMonth();
        const startYear = start.getFullYear();
        const endMonth = end.getMonth();
        const endYear = end.getFullYear();

        let meta = 0;

        if (startYear === endYear && startMonth === endMonth) {
          // Mesmo mÃªs - retorna a meta mensal
          return calcularMetaMensal(startYear, startMonth);
        } else {
          // MÃºltiplos meses - soma as metas mensais
          let current = new Date(startYear, startMonth, 1);
          const endDate = new Date(endYear, endMonth, 1);

          while (current <= endDate) {
            const year = current.getFullYear();
            const month = current.getMonth();
            meta += calcularMetaMensal(year, month);
            current.setMonth(current.getMonth() + 1);
          }
          return meta;
        }
      }

      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      // FUNÃ‡Ã•ES AUXILIARES PARA DADOS HARDCODED
      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      function getMetaParaPeriodoProporcional(startStr, endStr) {
        if (!startStr || !endStr) return 0;
        const start = parseBRDate(startStr);
        const end = parseBRDate(endStr);
        if (!start || !end || start > end) return 0;
        let meta = 0;
        let current = new Date(start.getFullYear(), start.getMonth(), 1);
        const endMonthRef = new Date(end.getFullYear(), end.getMonth(), 1);
        while (current <= endMonthRef) {
          const year = current.getFullYear();
          const month = current.getMonth();
          const monthStart = new Date(year, month, 1);
          const monthEnd = new Date(year, month + 1, 0);
          const rangeStart = start > monthStart ? start : monthStart;
          const rangeEnd = end < monthEnd ? end : monthEnd;
          const usedDays = Math.max(0, Math.floor((rangeEnd - rangeStart) / 86400000) + 1);
          meta += (calcularMetaMensal(year, month) / daysInMonth(year, month)) * usedDays;
          current.setMonth(current.getMonth() + 1);
        }
        return Math.round(meta);
      }

      function getFilteredMonthlyData(
        yearArray,
        year,
        startDateStr,
        endDateStr,
      ) {
        const months = [
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12",
        ];
        const result = [];
        for (let i = 0; i < 12; i++) {
          const monthStr = months[i];
          const dateStr = `${year}-${monthStr}-15`;
          const date = new Date(dateStr + "T12:00:00-03:00");
          let include = true;
          if (startDateStr) {
            const start = new Date(startDateStr + "T00:00:00-03:00");
            if (date < start) include = false;
          }
          if (endDateStr) {
            const end = new Date(endDateStr + "T23:59:59-03:00");
            if (date > end) include = false;
          }
          result.push(include ? yearArray[i] : null);
        }
        return result;
      }
      function getTotalForPeriod(yearArray, year, startDateStr, endDateStr) {
        if (!startDateStr || !endDateStr) {
          return yearArray.reduce((sum, val) => sum + (val || 0), 0);
        }
        const start = parseBRDate(startDateStr);
        const end = parseBRDate(endDateStr);
        if (!start || !end || start > end) return 0;
        let total = 0;
        for (let month = 0; month < 12; month++) {
          const monthStart = new Date(year, month, 1);
          const monthEnd = new Date(year, month + 1, 0);
          const rangeStart = start > monthStart ? start : monthStart;
          const rangeEnd = end < monthEnd ? end : monthEnd;
          const usedDays = Math.max(0, Math.floor((rangeEnd - rangeStart) / 86400000) + 1);
          if (usedDays > 0) {
            total += ((yearArray[month] || 0) / daysInMonth(year, month)) * usedDays;
          }
        }
        return total;
      }

      // Calcula faturamento mensal do Dataverse para um ano especÃ­fico
      function getMonthlyDataFromDataverse(year, startDateStr, endDateStr) {
        const result = [];
        for (let month = 0; month < 12; month++) {
          const monthStr = String(month + 1).padStart(2, "0");
          const dateStr = `${year}-${monthStr}-15`;
          const date = new Date(dateStr + "T12:00:00-03:00");
          let include = true;
          if (startDateStr) {
            const start = new Date(startDateStr + "T00:00:00-03:00");
            if (date < start) include = false;
          }
          if (endDateStr) {
            const end = new Date(endDateStr + "T23:59:59-03:00");
            if (date > end) include = false;
          }

          if (!include) {
            result.push(null);
            continue;
          }

          const monthReservas = DB.reservas.filter(r => {
            const rDate = r[F.res.data];
            if (!rDate) return false;
            const rYear = new Date(rDate).getFullYear();
            const rMonth = new Date(rDate).getMonth();
            return rYear === year && rMonth === month;
          });

          result.push(sumV(monthReservas) || null);
        }
        return result;
      }

      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      // LÃ“GICA DE LM/LY COM RESPEITO A FILTROS
      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      function getLMValueAndCount(lmYear, lmMonth) {
        const lmMk = `${lmYear}-${String(lmMonth + 1).padStart(2, "0")}`;
        const lmReservas = DB.reservas.filter(r => {
          const rDate = r[F.res.data];
          if (!rDate) return false;
          const rYear = new Date(rDate).getFullYear();
          const rMonth = new Date(rDate).getMonth();
          return rYear === lmYear && rMonth === lmMonth &&
                 (msState.St.length === 0 || msState.St.includes(r._stL)) &&
                 (msState.Cl.length === 0 || msState.Cl.includes(r._cli)) &&
                 (msState.Mo.length === 0 || msState.Mo.includes(r._mot)) &&
                 (msState.Tp.length === 0 || msState.Tp.includes(r._veiL));
        });

        const lmValue = sumV(lmReservas);
        const lmCount = lmReservas.length;

        // Se nÃ£o tem dados do Dataverse, tenta hardcoded (apenas 2025 pra trÃ¡s)
        if (lmValue === 0 && lmYear <= 2025) {
          const yearDataMap = {
            2023: typeof fat2023 !== "undefined" ? fat2023 : [],
            2024: typeof fat2024 !== "undefined" ? fat2024 : [],
            2025: typeof fat2025 !== "undefined" ? fat2025 : [],
          };
          const hardcodedValue = (yearDataMap[lmYear] || [])[lmMonth] || 0;
          return { value: hardcodedValue, count: null, hasData: hardcodedValue > 0 };
        }

        return { value: lmValue, count: lmCount, hasData: lmValue > 0 };
      }

      function getLYValueAndCount(startStr, endStr, lyYear) {
        if (!startStr || !endStr) return { value: 0, count: null, hasData: false };

        const startDate = new Date(startStr + "T00:00:00-03:00");
        const endDate = new Date(endStr + "T23:59:59-03:00");
        const startMonth = startDate.getMonth();
        const startDay = startDate.getDate();
        const endMonth = endDate.getMonth();
        const endDay = endDate.getDate();

        const lyStartDate = new Date(lyYear, startMonth, startDay);
        const lyEndDate = new Date(lyYear, endMonth, endDay);

        const lyReservas = DB.reservas.filter(r => {
          const rDate = r[F.res.data];
          if (!rDate) return false;
          const rDateObj = new Date(rDate);
          const inRange = rDateObj >= lyStartDate && rDateObj <= lyEndDate;
          return inRange &&
                 (msState.St.length === 0 || msState.St.includes(r._stL)) &&
                 (msState.Cl.length === 0 || msState.Cl.includes(r._cli)) &&
                 (msState.Mo.length === 0 || msState.Mo.includes(r._mot)) &&
                 (msState.Tp.length === 0 || msState.Tp.includes(r._veiL));
        });

        const lyValue = sumV(lyReservas);
        const lyCount = lyReservas.length;

        // Se nÃ£o tem dados do Dataverse, tenta hardcoded (apenas 2025 pra trÃ¡s)
        if (lyValue === 0 && lyYear <= 2025) {
          const yearDataMap = {
            2023: typeof fat2023 !== "undefined" ? fat2023 : [],
            2024: typeof fat2024 !== "undefined" ? fat2024 : [],
            2025: typeof fat2025 !== "undefined" ? fat2025 : [],
          };
          const hardcodedValue = getTotalForPeriod(
            yearDataMap[lyYear] || [],
            lyYear,
            startStr,
            endStr,
          );
          return { value: hardcodedValue, count: null, hasData: hardcodedValue > 0 };
        }

        return { value: lyValue, count: lyCount, hasData: lyValue > 0 };
      }

      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      // RENDER PRINCIPAL
      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      function passesActiveFilters(r) {
        return (msState.St.length === 0 || msState.St.includes(r._stL)) &&
               (msState.Cl.length === 0 || msState.Cl.includes(r._cli)) &&
               (msState.Mo.length === 0 || msState.Mo.includes(r._motKey || r._mot)) &&
               (msState.Tp.length === 0 || msState.Tp.includes(r._veiL));
      }

      function getPeriodValueAndCount(startStr, endStr) {
        if (!startStr || !endStr) return { value: 0, count: null, hasData: false };
        const reservas = DB.reservas.filter((r) =>
          inDateRange(r[F.res.data], startStr, endStr) && passesActiveFilters(r)
        );
        const value = sumV(reservas);
        if (value === 0) {
          const year = parseInt(startStr.slice(0, 4), 10);
          const yearDataMap = {
            2023: typeof fat2023 !== "undefined" ? fat2023 : [],
            2024: typeof fat2024 !== "undefined" ? fat2024 : [],
            2025: typeof fat2025 !== "undefined" ? fat2025 : [],
          };
          if (yearDataMap[year]?.length) {
            const hardcodedValue = getTotalForPeriod(yearDataMap[year], year, startStr, endStr);
            return { value: hardcodedValue, count: null, hasData: hardcodedValue > 0 };
          }
        }
        return { value, count: reservas.length, hasData: value > 0 || reservas.length > 0 };
      }

      Chart.register(ChartDataLabels);
      const PAL = [
        "#1a6cf5",
        "#0a9396",
        "#6c4fd8",
        "#e07000",
        "#1a7a40",
        "#c9a227",
        "#c0392b",
        "#004e8c",
        "#00b294",
        "#c239b3",
      ];
const monthsLabelsAll = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

      function ensureExecutiveLayout() {
        const page = document.getElementById("page-resumo");
        if (!page || page.dataset.execLayout === "1") return;
        const rows = page.querySelectorAll(":scope > .kpi-row");
        if (rows.length < 2) return;
        rows[0].remove();
        rows[1].remove();
        page.insertAdjacentHTML("afterbegin", `
          <div class="kpi-row kpi-6">
            <div class="kpi executive kpi-tone-blue">
              <div class="kpi-accent" style="background: var(--blue-g)"></div>
              <div class="kpi-main"><div class="kpi-left"><div class="kpi-lbl">Faturamento</div><div class="kpi-val sm" id="kFat">&mdash;</div></div><div class="kpi-right"><div class="kpi-delta" id="kFatD"></div></div></div>
              <div class="kpi-spark"><canvas id="spFat"></canvas></div>
            </div>
            <div class="kpi executive kpi-tone-teal">
              <div class="kpi-accent" style="background: linear-gradient(135deg, #0a9396, #3dbdc1)"></div>
              <div class="kpi-main"><div class="kpi-left"><div class="kpi-lbl">Servicos</div><div class="kpi-val" id="kSrv">&mdash;</div></div><div class="kpi-right"><div class="kpi-delta" id="kSrvD"></div></div></div>
              <div class="kpi-spark"><canvas id="spSrv"></canvas></div>
            </div>
            <div class="kpi executive kpi-tone-purple">
              <div class="kpi-accent" style="background: linear-gradient(135deg, #6c4fd8, #9b7df0)"></div>
              <div class="kpi-main"><div class="kpi-left"><div class="kpi-lbl">Ticket medio</div><div class="kpi-val sm" id="kTk">&mdash;</div></div><div class="kpi-right"><div class="kpi-delta" id="kTkD"></div></div></div>
              <div class="kpi-spark"><canvas id="spTk"></canvas></div>
            </div>
            <div class="kpi executive kpi-tone-green">
              <div class="kpi-accent" style="background: linear-gradient(135deg, #1a7a40, #2ecc71)"></div>
              <div class="kpi-main"><div class="kpi-left"><div class="kpi-lbl">A receber</div><div class="kpi-val sm" id="kPPend">&mdash;</div></div><div class="kpi-right"><div class="kpi-delta" id="kPPendD"></div></div></div>
              <div class="kpi-spark"><canvas id="spReceber"></canvas></div>
            </div>
            <div class="kpi executive kpi-tone-orange">
              <div class="kpi-accent" style="background: linear-gradient(135deg, #e07000, #f59532)"></div>
              <div class="kpi-main"><div class="kpi-left"><div class="kpi-lbl">Sem valor</div><div class="kpi-val" id="kSemVal">&mdash;</div></div><div class="kpi-right"><div class="kpi-delta" id="kSemValD"></div></div></div>
              <div class="kpi-spark"><canvas id="spSemValor"></canvas></div>
            </div>
            <div class="kpi executive kpi-tone-red">
              <div class="kpi-accent" style="background: linear-gradient(135deg, #c0392b, #e05a4e)"></div>
              <div class="kpi-main"><div class="kpi-left"><div class="kpi-lbl">Custo frota</div><div class="kpi-val sm" id="kFrotaCusto">&mdash;</div></div><div class="kpi-right"><div class="kpi-delta" id="kFrotaCustoD"></div></div></div>
              <div class="kpi-spark"><canvas id="spCusto"></canvas></div>
            </div>
          </div>
          <div class="exec-alerts">
            <div class="exec-alert" id="alertSemValor"><div><strong>&mdash;</strong><span>Sem valor</span></div><b>Conferir</b></div>
            <div class="exec-alert" id="alertReceber"><div><strong>&mdash;</strong><span>A receber</span></div><b>Financeiro</b></div>
            <div class="exec-alert" id="alertCnh"><div><strong>&mdash;</strong><span>CNH</span></div><b>Operacao</b></div>
            <div class="exec-alert" id="alertMultas"><div><strong>&mdash;</strong><span>Multas</span></div><b>Risco</b></div>
          </div>
          <div class="exec-alerts">
            <div class="exec-alert" id="dqSemPreco"><div><strong>&mdash;</strong><span>Sem preco</span></div><b>Dados</b></div>
            <div class="exec-alert" id="dqSemOP"><div><strong>&mdash;</strong><span>Sem OP</span></div><b>Dados</b></div>
            <div class="exec-alert" id="dqSemMotorista"><div><strong>&mdash;</strong><span>Sem motorista</span></div><b>Dados</b></div>
            <div class="exec-alert" id="dqSemCliente"><div><strong>&mdash;</strong><span>Sem cliente</span></div><b>Dados</b></div>
          </div>
        `);
        page.dataset.execLayout = "1";
      }

      function setExecAlert(id, value, label, status, tone) {
        const el = document.getElementById(id);
        if (!el) return;
        el.className = `exec-alert ${tone || ""}`.trim();
        el.innerHTML = `<div><strong>${value}</strong><span>${label}</span></div><b>${status}</b>`;
      }

      function renderAll() {
        ensureExecutiveLayout();
        const dvDisabled = isDataverseDisabled();
        const rv = dvDisabled ? [] : VW.reservas;
        const fat = sumV(rv);
        const byM = grp(rv, (r) => mK(r[F.res.data]));
        const mks = mKeys(byM);
        const mls = mks.map(mL);
        const byCli = grp(rv, (r) => r._cli);

        // Aplicar filtros de data Ã s outras abas
        const start = document.getElementById("fS").value;
        const end = document.getElementById("fE").value;
        const filterByDate = (records, dateField) => {
          if (!start && !end) return records;
          return records.filter(r => {
            const rDate = r[dateField];
            if (!rDate) return true; // Incluir se nÃ£o tem data
            if (start) {
              const startDate = new Date(start + "T00:00:00-03:00");
              if (new Date(rDate) < startDate) return false;
            }
            if (end) {
              const endDate = new Date(end + "T23:59:59-03:00");
              if (new Date(rDate) > endDate) return false;
            }
            return true;
          });
        };
        VW.manutencoes = filterByDate(DB.manutencoes, F.man.data);
        VW.multas = filterByDate(DB.multas, F.mul.data);
        VW.trocas = filterByDate(DB.trocas, F.trc.data);

        // Construir opPagoSet â€” OP com status pago/recebido
        const opPagoSet = new Set(
          DB.pagantes
            .filter(p => {
              const st = (fv(p, F.pag.status) || "").toLowerCase();
              return st.includes("pago") || st.includes("receb");
            })
            .map(p => (p[F.pag.lookupOP] || "").toLowerCase())
            .filter(Boolean)
        );

        // Badges
        document.getElementById("nbSrv").textContent = rv.length;
        document.getElementById("nbSrv2").textContent = rv.length;
        document.getElementById("nbPag").textContent = dvDisabled
          ? 0
          : DB.pagantes.length;
        document.getElementById("nbFrota").textContent = dvDisabled
          ? 0
          : DB.veiculos.length;
        document.getElementById("nbMot").textContent = dvDisabled
          ? 0
          : DB.funcionarios.length;
        document.getElementById("nbMan").textContent = dvDisabled
          ? 0
          : DB.manutencoes.length;
        document.getElementById("nbMul").textContent = dvDisabled
          ? 0
          : DB.multas.length;
        document.getElementById("nbTrc").textContent = dvDisabled
          ? 0
          : DB.trocas.length;
        document.getElementById("nbMkt").textContent = dvDisabled
          ? 0
          : DB.marketing.length;

        const isConc = (r) =>
          stL(r._stL).includes("conclu") ||
          stL(r._stL).includes("realiz") ||
          stL(r._stL).includes("finaliz");
        const conclServices = rv.filter(isConc);
        const getSemValorRows = (rows) => {
          const seen = new Set();
          return rows.filter((r) => {
            const precoId = String(r[F.res.lookupPreco] || "").toLowerCase();
            if (!precoId || seen.has(precoId)) return false;
            const match =
              r._cpPendente === true &&
              isConc(r) &&
              normL(r._fatStL).includes("pend") &&
              normL(fv(r, F.res.catItem)).includes("servico");
            if (match) seen.add(precoId);
            return match;
          });
        };
        const semValor = getSemValorRows(rv);
        const pendentes = rv.filter(
          (r) =>
            stL(r._stL).includes("pend") ||
            stL(r._stL).includes("progr") ||
            stL(r._stL).includes("solicit") ||
            stL(r._stL).includes("aprova") ||
            stL(r._stL).includes("program"),
        );
        const cancelados = rv.filter(
          (r) =>
            stL(r._stL).includes("cancel") || stL(r._stL).includes("recus"),
        );

        const now = new Date();
        const brNow = new Date(now.getTime() - 3 * 60 * 60 * 1000);
        const currentYear = brNow.getFullYear();
        const currentMonth = brNow.getMonth();
        const lmYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        const lmMonth = currentMonth === 0 ? 11 : currentMonth - 1;

        // Mapeamento dos dados hardcoded para todos os anos
        const yearDataMap = {
          2023: typeof fat2023 !== "undefined" ? fat2023 : [],
          2024: typeof fat2024 !== "undefined" ? fat2024 : [],
          2025: typeof fat2025 !== "undefined" ? fat2025 : [],
        };

        // Calcula LM e LY respeitando filtros ativos
        const activeStart = start || `${currentYear}-01-01`;
        const activeEnd = end || `${currentYear}-12-31`;
        const lmPeriod = samePeriodLastMonth(activeStart, activeEnd);
        const lyPeriod = samePeriodLastYear(activeStart, activeEnd);
        const lmData = lmPeriod ? getPeriodValueAndCount(lmPeriod.start, lmPeriod.end) : { value: 0, count: null, hasData: false };
        const lmValue = lmData.hasData ? lmData.value : 0;
        const lmSrvCount = lmData.count !== null ? lmData.count : 0;

        // LY deve comparar o perÃ­odo atual com o mesmo perÃ­odo do ano anterior
        let lyValue = 0;
        let lySrvCount = null;
        if (start && end) {
          const startDate = new Date(start + "T00:00:00-03:00");
          const endDate = new Date(end + "T23:59:59-03:00");
          const startYear = startDate.getFullYear();
          const lyYear = startYear - 1;

          const lyData = getLYValueAndCount(start, end, lyYear);
          lyValue = lyData.hasData ? lyData.value : 0;
          lySrvCount = lyData.count;
        } else {
          // Se nÃ£o hÃ¡ filtro, comparar o ano completo
          const lyData = getLYValueAndCount(
            `${currentYear - 1}-01-01`,
            `${currentYear - 1}-12-31`,
            currentYear - 1
          );
          lyValue = lyData.hasData ? lyData.value : 0;
          lySrvCount = lyData.count;
        }

        // Chip helpers â€” value + % delta
        const lyDataScoped = lyPeriod ? getPeriodValueAndCount(lyPeriod.start, lyPeriod.end) : { value: 0, count: null, hasData: false };
        lyValue = lyDataScoped.hasData ? lyDataScoped.value : 0;
        lySrvCount = lyDataScoped.count;

        const fmtKpiChip = (cur, prev, label, cls) => {
          if (!prev) return "";
          const pct = ((cur - prev) / prev) * 100;
          const up = pct >= 0;
          return `<span class="badge-kpi ${cls}"><span class="bk-label">${label}</span><span class="bk-val">${brlS(prev)}</span><span class="bk-pct ${up ? "du" : "dd"}">${up ? "â–²" : "â–¼"}${Math.abs(pct).toFixed(1)}%</span></span>`;
        };
        // Count chip â€” shows count + % delta (no currency)
        const fmtCntChip = (cur, prev, label, cls) => {
          if (!prev) return "";
          const pct = ((cur - prev) / prev) * 100;
          const up = pct >= 0;
          return `<span class="badge-kpi ${cls}"><span class="bk-label">${label}</span><span class="bk-val">${prev.toLocaleString("pt-BR")}</span><span class="bk-pct ${up ? "du" : "dd"}">${up ? "â–²" : "â–¼"}${Math.abs(pct).toFixed(1)}%</span></span>`;
        };
        // No-data chip â€” shown when the metric can't be computed for a given period
        const ndChip = (label, cls) =>
          `<span class="badge-kpi ${cls}" style="opacity:.45;"><span class="bk-label">${label}</span><span class="bk-val">â€”</span><span class="bk-pct" style="letter-spacing:.5px;">s/dado</span></span>`;

        // Last-month ticket value (valor / count)
        const lmTkVal = lmSrvCount > 0 ? lmValue / lmSrvCount : 0;

        // KPIs
        set("kSrv", dvDisabled ? "â€”" : rv.length.toLocaleString("pt-BR"));
        html("kSrvD", dvDisabled ? "" :
          (lmSrvCount ? fmtCntChip(rv.length, lmSrvCount, "LM", "badge-lm") : ndChip("LM", "badge-lm")) +
          (lySrvCount ? fmtCntChip(rv.length, lySrvCount, "LY", "badge-ly") : ndChip("LY", "badge-ly")));
        set("kFat", dvDisabled ? "â€”" : brlS(fat));
        html("kFatD", dvDisabled ? "" :
          fmtKpiChip(fat, lmValue, "LM", "badge-lm") + fmtKpiChip(fat, lyValue, "LY", "badge-ly"));
        const curTk = rv.length ? fat / rv.length : 0;
        const lyTkVal = lySrvCount > 0 ? lyValue / lySrvCount : 0;
        set("kTk", dvDisabled ? "â€”" : brl(curTk));
        html("kTkD", dvDisabled ? "" :
          (lmTkVal ? fmtKpiChip(curTk, lmTkVal, "LM", "badge-lm") : ndChip("LM", "badge-lm")) +
          (lyTkVal ? fmtKpiChip(curTk, lyTkVal, "LY", "badge-ly") : ndChip("LY", "badge-ly")));
        set("kMan", dvDisabled ? "â€”" : VW.manutencoes.length);
        const custoTotal = dvDisabled
          ? 0
          : VW.manutencoes.reduce(
              (s, r) => s + (parseFloat(r[F.man.valor]) || 0),
              0,
            );
        const cfPctRec = fat > 0 ? (custoTotal / fat * 100).toFixed(1) : 0;
        html("kManD", dvDisabled ? "" :
          `<span class="badge-kpi badge-lm"><span class="bk-label">CUSTO</span><span class="bk-val">${brlS(custoTotal)}</span><span class="bk-pct ${custoTotal <= fat * 0.1 ? "du" : "dd"}">${cfPctRec}% rec</span></span>`);
        set("kFrotaCusto", dvDisabled ? "Ã¢â‚¬â€" : brlS(custoTotal));
        html("kFrotaCustoD", dvDisabled ? "" :
          `<span class="badge-kpi badge-lm"><span class="bk-label">% REC</span><span class="bk-val">${cfPctRec}%</span><span class="bk-pct ${parseFloat(cfPctRec) <= 10 ? "du" : "dd"}">${parseFloat(cfPctRec) <= 10 ? "OK" : "alto"}</span></span>`);
        set("kMul", dvDisabled ? "â€”" : VW.multas.length);
        const mulFv2 = (r, f) =>
          r[`${f}@OData.Community.Display.V1.FormattedValue`] ?? r[f];
        const mulPen2 = VW.multas.filter(
          (r) =>
            stL(String(mulFv2(r, F.mul.status) || "")).includes("pend") ||
            stL(String(mulFv2(r, F.mul.status) || "")).includes("indicad"),
        );
        const mulPenPct = VW.multas.length ? (mulPen2.length / VW.multas.length * 100).toFixed(0) : 0;
        html("kMulD", dvDisabled ? "" :
          `<span class="badge-kpi badge-meta${mulPen2.length > 0 ? " below" : ""}"><span class="bk-label">PEND</span><span class="bk-val">${mulPen2.length}</span><span class="bk-pct">${mulPenPct}%</span></span>`);
        set("kSemVal", dvDisabled ? "â€”" : semValor.length);
        const semValPct = rv.length ? (semValor.length / rv.length * 100).toFixed(1) : 0;
        const projecao = dvDisabled ? 0 : curTk * semValor.length;
        html("kSemValD", dvDisabled ? "" :
          `<span class="badge-kpi badge-meta${semValor.length > 0 ? " below" : ""}"><span class="bk-label">%</span><span class="bk-val">${semValor.length}</span><span class="bk-pct">${semValPct}% tot</span></span>` +
          (semValor.length > 0 ? `<span class="badge-kpi badge-lm"><span class="bk-label">PROJ</span><span class="bk-val">${brlS(projecao)}</span><span class="bk-pct">potencial</span></span>` : ""));
        const aReceber = dvDisabled ? 0 :
          VW.reservas
            .filter(r => r._opId && !opPagoSet.has(r._opId) && r._valor > 0)
            .reduce((s, r) => s + r._valor, 0);
        set("kPPend", dvDisabled ? "â€”" : brlS(aReceber));
        const aReceberPct = fat > 0 ? (aReceber / fat * 100).toFixed(0) : 0;
        html("kPPendD", dvDisabled ? "" :
          `<span class="badge-kpi badge-ly"><span class="bk-label">%FAT</span><span class="bk-val">${aReceberPct}%</span><span class="bk-pct">pendente</span></span>`);
        const cnhWarn = DB.funcionarios.filter((r) => {
          if (!r[F.fun.cnh]) return true;
          return (
            (new Date(r[F.fun.cnh]) - new Date()) / (1000 * 60 * 60 * 24) < 90
          );
        });
        set("kCnhW", dvDisabled ? "â€”" : cnhWarn.length);
        html("kCnhWD", dvDisabled
          ? ""
          : cnhWarn.length
            ? `<span class="dd">${cnhWarn.length} atenÃ§Ã£o</span>`
            : `<span class="du">OK</span>`);
        const veiAtivos = DB.veiculos.filter(
          (r) =>
            stL(String(fv(r, F.vei.status) || "")).includes("dispon") ||
            stL(String(fv(r, F.vei.status) || "")).includes("ativo"),
        ).length;
        set("kFrotaAtiva", dvDisabled ? "â€”" : veiAtivos);
        html("kFrotaAtivaD", dvDisabled
          ? ""
          : `Total: ${DB.veiculos.length}`);

        // Total Produzido - usando ano atual, anterior e penÃºltimo
        const trendKeys = mks.length > 0
          ? mks.slice(-8)
          : monthsLabelsAll.map((_, i) => `${currentYear}-${String(i + 1).padStart(2, "0")}`).slice(-8);
        const trendLabels = trendKeys.map((k) => {
          const parts = k.split("-");
          return monthsLabelsAll[(parseInt(parts[1], 10) || 1) - 1] || k;
        });
        const trendFat = trendKeys.map((k) => byM[k] ? sumV(byM[k]) : (yearDataMap[currentYear]?.[parseInt(k.split("-")[1], 10) - 1] || 0));
        const trendSrv = trendKeys.map((k) => (byM[k] || []).length);
        const trendTk = trendKeys.map((k) => {
          const rows = byM[k] || [];
          return rows.length ? sumV(rows) / rows.length : 0;
        });
        const trendReceber = trendKeys.map((k) =>
          (byM[k] || [])
            .filter((r) => r._opId && !opPagoSet.has(r._opId) && r._valor > 0)
            .reduce((s, r) => s + r._valor, 0)
        );
        const trendSemValor = trendKeys.map((k) =>
          getSemValorRows(byM[k] || []).length
        );
        const manByMExec = grp(dvDisabled ? [] : VW.manutencoes, (r) => mK(r[F.man.data]));
        const trendCusto = trendKeys.map((k) =>
          (manByMExec[k] || []).reduce((s, r) => s + (parseFloat(r[F.man.valor]) || 0), 0)
        );
        mkSpark("spFat", trendLabels, trendFat, "#1a6cf5");
        mkSpark("spSrv", trendLabels, trendSrv, "#0a9396");
        mkSpark("spTk", trendLabels, trendTk, "#6c4fd8");
        mkSpark("spReceber", trendLabels, trendReceber, "#1a7a40");
        mkSpark("spSemValor", trendLabels, trendSemValor, "#e07000");
        mkSpark("spCusto", trendLabels, trendCusto, "#c0392b");

        setExecAlert("alertSemValor", semValor.length, "Sem valor", semValor.length ? `${brlS(projecao)} potencial` : "OK", semValor.length ? "warn" : "ok");
        setExecAlert("alertReceber", brlS(aReceber), "A receber", `${aReceberPct}% do fat.`, aReceber > 0 ? "warn" : "ok");
        setExecAlert("alertCnh", cnhWarn.length, "CNH", cnhWarn.length ? "Atencao" : "OK", cnhWarn.length ? "danger" : "ok");
        setExecAlert("alertMultas", mulPen2.length, "Multas", `${mulPenPct}% pend.`, mulPen2.length ? "danger" : "ok");
        const dqSemPreco = rv.filter((r) => !r[F.res.lookupPreco]).length;
        const dqSemOP = rv.filter((r) => !r._opId).length;
        const dqSemMotorista = rv.filter((r) => r._mot === "Sem motorista").length;
        const dqSemCliente = rv.filter((r) => r._cli === "Sem cliente").length;
        setExecAlert("dqSemPreco", dqSemPreco, "Sem preco", dqSemPreco ? "Corrigir" : "OK", dqSemPreco ? "warn" : "ok");
        setExecAlert("dqSemOP", dqSemOP, "Sem OP", dqSemOP ? "Corrigir" : "OK", dqSemOP ? "warn" : "ok");
        setExecAlert("dqSemMotorista", dqSemMotorista, "Sem motorista", dqSemMotorista ? "Corrigir" : "OK", dqSemMotorista ? "warn" : "ok");
        setExecAlert("dqSemCliente", dqSemCliente, "Sem cliente", dqSemCliente ? "Corrigir" : "OK", dqSemCliente ? "warn" : "ok");

        const monthsLabels = [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
        ];
        const year1 = currentYear; // Ano atual
        const year2 = currentYear - 1; // Ãšltimo ano completo
        const year3 = currentYear - 2; // Ano anterior ao Ãºltimo

        // Para 2026 em diante, usar dados do Dataverse; para 2025 ou antes, usar hardcoded
        const dataYear1 = year1 >= 2026 && dvDisabled === false
          ? getMonthlyDataFromDataverse(year1, start, end)
          : getFilteredMonthlyData(yearDataMap[year1] || [], year1, start, end);
        const dataYear2 = year2 >= 2026 && dvDisabled === false
          ? getMonthlyDataFromDataverse(year2, start, end)
          : getFilteredMonthlyData(yearDataMap[year2] || [], year2, start, end);
        const dataYear3 = year3 >= 2026 && dvDisabled === false
          ? getMonthlyDataFromDataverse(year3, start, end)
          : getFilteredMonthlyData(yearDataMap[year3] || [], year3, start, end);

        const validIndices = [];
        for (let i = 0; i < 12; i++)
          if (
            dataYear3[i] !== null ||
            dataYear2[i] !== null ||
            dataYear1[i] !== null
          )
            validIndices.push(i);
        const displayLabels =
          validIndices.length > 0
            ? validIndices.map((i) => monthsLabels[i])
            : monthsLabels;
        const seriesYear3 =
          validIndices.length > 0
            ? validIndices.map((i) => dataYear3[i])
            : dataYear3;
        const seriesYear2 =
          validIndices.length > 0
            ? validIndices.map((i) => dataYear2[i])
            : dataYear2;
        const seriesYear1 =
          validIndices.length > 0
            ? validIndices.map((i) => dataYear1[i])
            : dataYear1;

        mkChart("cTotalProd", {
          type: "line",
          data: {
            labels: displayLabels,
            datasets: [
              {
                label: String(year3),
                data: seriesYear3,
                borderColor: "#c9a227",
                backgroundColor: "rgba(201,162,39,0.18)",
                fill: true,
                tension: 0.4,
                pointRadius: 2,
                pointBackgroundColor: "#c9a227",
                borderWidth: 2,
                borderDash: [4, 3],
              },
              {
                label: String(year2),
                data: seriesYear2,
                borderColor: "#1a6cf5",
                backgroundColor: "rgba(26,108,245,0.18)",
                fill: true,
                tension: 0.4,
                pointRadius: 2,
                pointBackgroundColor: "#1a6cf5",
                borderWidth: 2,
              },
              {
                label: String(year1),
                data: seriesYear1,
                borderColor: "#1a7a40",
                backgroundColor: "rgba(26,122,64,0.22)",
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: "#1a7a40",
                borderWidth: 2.5,
              },
            ],
          },
          options: opts0({ noLegend: false, yBrl: true, datalabels: false }),
        });

        // Cards de Total Produzido
        const meta = getMetaParaPeriodoProporcional(start, end);
        const accumulated = dvDisabled ? 0 : fat;
        const metaProgress = meta ? (accumulated / meta) * 100 : 0;
        const lyDelta = lyValue ? ((accumulated - lyValue) / lyValue) * 100 : 0;
        const lmDelta = lmValue ? ((accumulated - lmValue) / lmValue) * 100 : 0;

        const mkChip = (label, value, delta, cls) => {
          if (!value) return "";
          const up = delta >= 0;
          const pctClass = up ? "du" : "dd";
          const arrow = up ? "â–²" : "â–¼";
          return `<span class="badge-kpi ${cls}"><span class="bk-label">${label}</span><span class="bk-val">${brlS(value)}</span><span class="bk-pct ${pctClass}">${arrow}${Math.abs(delta).toFixed(1)}%</span></span>`;
        };
        const metaAchieved = metaProgress >= 100;
        const metaChip = meta > 0
          ? `<span class="badge-kpi badge-meta${metaAchieved ? "" : " below"}"><span class="bk-label">META</span><span class="bk-val">${brlS(meta)}</span><span class="bk-pct" style="font-weight:800;">${metaProgress.toFixed(0)}%${metaAchieved ? " âœ“" : ""}</span></span>`
          : "";

        if (document.getElementById("v_totalProd"))
          document.getElementById("v_totalProd").textContent = dvDisabled ? "â€”" : brlS(accumulated);
        document.getElementById("indicatorsLM_LY_META").innerHTML =
          mkChip("LM", lmValue, lmDelta, "badge-lm") +
          mkChip("LY", lyValue, lyDelta, "badge-ly") +
          metaChip;

        // Barra de progresso da meta
        const barColor = metaProgress >= 100 ? "var(--green)" : metaProgress >= 75 ? "var(--blue)" : metaProgress >= 50 ? "var(--orange)" : "var(--red)";
        const barW = Math.min(metaProgress, 100).toFixed(1);
        document.getElementById("metaProgressWrap").innerHTML = meta > 0 ? `
          <div class="meta-kpi-pills">
            <div class="meta-kpi-pill"><span>Realizado</span><strong>${brlS(accumulated)}</strong></div>
            <div class="meta-kpi-pill"><span>Meta</span><strong>${brlS(meta)}</strong></div>
            <div class="meta-kpi-pill"><span>${metaAchieved ? "Superado" : "Falta"}</span><strong style="color:${metaAchieved ? "var(--green)" : "var(--red)"};">${brlS(Math.abs(meta - accumulated))}</strong></div>
            <div class="meta-kpi-pill" style="flex:1;min-width:160px;"><span>${metaProgress.toFixed(1)}% da meta</span><div class="meta-progress-bar-outer" style="margin-top:4px;"><div class="meta-progress-bar-inner" style="width:${barW}%;background:${barColor};"></div></div></div>
          </div>` : "";

        // Ticket MÃ©dio mensal
        const tmLabels = mks.length > 0
          ? mks.map(mL).map(label => label.split(" ")[0])
          : monthsLabelsAll;
        const ticketMedioMensal = (mks.length > 0 ? mks : monthsLabelsAll).map((k, idx) => {
          if (mks.length > 0) {
            const md = byM[k];
            return md.length ? sumV(md) / md.length : 0;
          }
          return null;
        });
        mkChart("cTicketMedio", {
          type: "bar",
          data: {
            labels: tmLabels,
            datasets: [
              {
                label: "Ticket MÃ©dio",
                data: ticketMedioMensal,
                backgroundColor: "#6c4fd8",
                borderRadius: 5,
              },
            ],
          },
          options: opts0({ noLegend: true, yBrl: true }),
        });
        set("sub_tm", dvDisabled ? "â€”" : `${mks.length} meses`);
        set("v_tm", dvDisabled ? "â€”" : brl(curTk));
        // Ticket MÃ©dio chips: LM only if last month is in current period; LY not available (count unknown)
        document.getElementById("ind_tm").innerHTML = dvDisabled ? "" :
          (lmTkVal ? fmtKpiChip(curTk, lmTkVal, "LM", "badge-lm") : ndChip("LM", "badge-lm")) +
          ndChip("LY", "badge-ly");

        // Meta x Realizado por MÃªs
        {
          const allMks = mks.length > 0 ? mks : monthsLabelsAll.map((_, i) => {
            const m = String(i + 1).padStart(2, "0");
            return `${currentYear}-${m}`;
          });
          const mvrLabels = allMks.map(k => {
            const [y, m] = k.split("-");
            const d = new Date(parseInt(y), parseInt(m) - 1, 1);
            return d.toLocaleString("pt-BR", { month: "short" }).replace(".", "");
          });
          const mvrReal = allMks.map(k => mks.length > 0 ? sumV(byM[k] || []) : (yearDataMap[currentYear]?.[parseInt(k.split("-")[1]) - 1] || 0));
          const mvrMeta = allMks.map(k => {
            const [y, m] = k.split("-");
            return calcularMetaMensal(parseInt(y), parseInt(m) - 1);
          });
          const totalMvrMeta = mvrMeta.reduce((a, b) => a + b, 0);
          const totalMvrReal = mvrReal.reduce((a, b) => a + b, 0);
          const pctGlobal = totalMvrMeta > 0 ? (totalMvrReal / totalMvrMeta * 100) : 0;
          const mvrAchieved = pctGlobal >= 100;
          set("sub_mvr", `${allMks.length} meses Â· ${pctGlobal.toFixed(1)}% da meta`);
          set("v_totalMvr", dvDisabled ? "â€”" : brlS(totalMvrReal));
          document.getElementById("ind_mvr").innerHTML = dvDisabled ? "" :
            (totalMvrMeta > 0 ? `<span class="badge-kpi badge-meta${mvrAchieved ? "" : " below"}"><span class="bk-label">META</span><span class="bk-val">${brlS(totalMvrMeta)}</span><span class="bk-pct" style="font-weight:800;">${pctGlobal.toFixed(0)}%${mvrAchieved ? " âœ“" : ""}</span></span>` : "") +
            fmtKpiChip(totalMvrReal, lyValue, "LY", "badge-ly");
          mkChart("cMetaVsReal", {
            type: "bar",
            data: {
              labels: mvrLabels,
              datasets: [
                { label: "Realizado", data: mvrReal, backgroundColor: "#1a6cf5", borderRadius: 4 },
                { label: "Meta", data: mvrMeta, backgroundColor: "rgba(201,162,39,0.35)", borderColor: "#c9a227", borderWidth: 1.5, borderRadius: 4, type: "bar" },
              ],
            },
            options: opts0({ yBrl: true, datalabels: false }),
          });
        }

        // Faturamento por Cliente por MÃªs
        {
          const allMks2 = mks.length > 0 ? mks : monthsLabelsAll.map((_, i) => `${currentYear}-${String(i + 1).padStart(2, "0")}`);
          const fcLabels = allMks2.map(k => {
            const [y, m] = k.split("-");
            return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleString("pt-BR", { month: "short" }).replace(".", "");
          });
          const cliEntries = Object.entries(byCli)
            .filter(([k]) => k !== "__null__" && k !== "Sem cliente")
            .sort((a, b) => sumV(b[1]) - sumV(a[1]))
            .slice(0, 6);
          const cliColors = ["#1a6cf5","#0a9396","#6c4fd8","#e07000","#1a7a40","#c9a227"];
          const fcDatasets = cliEntries.map(([cliName, recs], i) => {
            const byMCli = grp(recs, r => mK(r[F.res.data]));
            return {
              label: trunc(cliName, 14),
              data: allMks2.map(k => sumV(byMCli[k] || [])),
              backgroundColor: cliColors[i % cliColors.length],
              stack: "c",
              borderRadius: 3,
            };
          });
          if (cliEntries.length > 0) {
            const top1Fat = sumV(cliEntries[0][1]);
            const top1Pct = fat > 0 ? (top1Fat / fat * 100).toFixed(1) : 0;
            set("v_fatCliTop", dvDisabled ? "â€”" : brlS(top1Fat));
            set("sub_fatcli", trunc(cliEntries[0][0], 26));
            document.getElementById("ind_fatcli").innerHTML = dvDisabled ? "" :
              `<span class="badge-kpi badge-lm"><span class="bk-label">1Â°</span><span class="bk-val">${brlS(top1Fat)}</span><span class="bk-pct">${top1Pct}%</span></span>` +
              (cliEntries.length > 1 ? `<span class="badge-kpi badge-ly"><span class="bk-label">2Â°</span><span class="bk-val">${brlS(sumV(cliEntries[1][1]))}</span><span class="bk-pct">${fat > 0 ? (sumV(cliEntries[1][1])/fat*100).toFixed(1) : 0}%</span></span>` : "");
          } else {
            set("sub_fatcli", `${cliEntries.length} clientes`);
          }
          if (fcDatasets.length > 0) {
            mkChart("cFatCli", {
              type: "bar",
              data: { labels: fcLabels, datasets: fcDatasets },
              options: opts0({ yBrl: true, datalabels: false }),
            });
          }
        }

        // Status dos serviÃ§os
        const bySt = grp(rv, (r) => r._stL);
        const stKeys = Object.keys(bySt)
          .filter((k) => k !== "__null__")
          .sort((a, b) => bySt[b].length - bySt[a].length);
        const concluPct = rv.length ? (conclServices.length / rv.length * 100).toFixed(1) : 0;
        set("v_stTotal", dvDisabled ? "â€”" : rv.length.toLocaleString("pt-BR"));
        set("sub_st", dvDisabled ? "â€”" : `${conclServices.length} concluÃ­dos Â· ${cancelados.length} cancelados`);
        document.getElementById("ind_st").innerHTML = dvDisabled ? "" :
          `<span class="badge-kpi badge-meta${concluPct >= 75 ? "" : " below"}"><span class="bk-label">CONC</span><span class="bk-val">${conclServices.length}</span><span class="bk-pct">${concluPct}%</span></span>` +
          (cancelados.length ? `<span class="badge-kpi" style="background:var(--red-l);color:var(--red);"><span class="bk-label" style="background:var(--red);color:#fff;">CAN</span><span class="bk-val">${cancelados.length}</span><span class="bk-pct">${rv.length ? (cancelados.length/rv.length*100).toFixed(1) : 0}%</span></span>` : "");
        mkChart("cSt", {
          type: "bar",
          data: {
            labels: stKeys.map((k) => trunc(k, 16)),
            datasets: [
              {
                label: "Qtd",
                data: stKeys.map((k) => bySt[k].length),
                backgroundColor: PAL,
                borderRadius: 5,
              },
            ],
          },
          options: opts0({ noLegend: true, hBar: true }),
        });

        // Custo frota
        const manByM = grp(dvDisabled ? [] : VW.manutencoes, (r) =>
          mK(r[F.man.data]),
        );
        const manMks = mKeys(manByM);
        const cfLabels = manMks.length > 0 ? manMks.map(mL).map(l => l.split(" ")[0]) : monthsLabelsAll;
        const cfData =
          manMks.length > 0
            ? manMks.map((k) =>
                manByM[k].reduce(
                  (s, r) => s + (parseFloat(r[F.man.valor]) || 0),
                  0,
                ),
              )
            : [];
        set("v_cf", dvDisabled ? "â€”" : brlS(custoTotal));
        set("sub_cf", dvDisabled ? "â€”" : `${VW.manutencoes.length} manutenÃ§Ãµes Â· ${cfPctRec}% da receita`);
        document.getElementById("ind_cf").innerHTML = dvDisabled ? "" :
          `<span class="badge-kpi badge-lm"><span class="bk-label">% REC</span><span class="bk-val">${cfPctRec}%</span><span class="bk-pct ${parseFloat(cfPctRec) <= 10 ? "du" : "dd"}">${parseFloat(cfPctRec) <= 10 ? "âœ“ OK" : "âš  alto"}</span></span>` +
          (VW.manutencoes.length ? `<span class="badge-kpi badge-ly"><span class="bk-label">MAN</span><span class="bk-val">${VW.manutencoes.length}</span><span class="bk-pct">serviÃ§os</span></span>` : "");
        mkChart("cCF", {
          type: "bar",
          data: {
            labels: cfLabels,
            datasets: [
              {
                label: "Custo R$",
                data: cfData,
                backgroundColor: "#e07000",
                borderRadius: 5,
              },
            ],
          },
          options: opts0({ noLegend: true, yBrl: true }),
        });

        // Top clientes
        const top10v = Object.entries(byCli)
          .sort((a, b) => b[1].length - a[1].length)
          .slice(0, 10);
        if (top10v.length > 0) {
          const t1vPct = rv.length ? (top10v[0][1].length / rv.length * 100).toFixed(1) : 0;
          set("v_topVol", dvDisabled ? "â€”" : top10v[0][1].length.toLocaleString("pt-BR"));
          set("sub_topVol", trunc(top10v[0][0], 26));
          document.getElementById("ind_topVol").innerHTML = dvDisabled ? "" :
            `<span class="badge-kpi badge-lm"><span class="bk-label">1Â°</span><span class="bk-val">${top10v[0][1].length}</span><span class="bk-pct">${t1vPct}%</span></span>` +
            (top10v.length > 1 ? `<span class="badge-kpi badge-ly"><span class="bk-label">2Â°</span><span class="bk-val">${top10v[1][1].length}</span><span class="bk-pct">${rv.length ? (top10v[1][1].length/rv.length*100).toFixed(1) : 0}%</span></span>` : "");
        }
        mkChart("cTC", {
          type: "bar",
          data: {
            labels: top10v.map(([k]) => trunc(k)),
            datasets: [
              { data: top10v.map(([, v]) => v.length), backgroundColor: PAL },
            ],
          },
          options: opts0({ noLegend: true, hBar: true }),
        });
        const top10f = Object.entries(byCli)
          .sort((a, b) => sumV(b[1]) - sumV(a[1]))
          .slice(0, 10);
        if (top10f.length > 0) {
          const t1fPct = fat > 0 ? (sumV(top10f[0][1]) / fat * 100).toFixed(1) : 0;
          set("v_topFat", dvDisabled ? "â€”" : brlS(sumV(top10f[0][1])));
          set("sub_topFat", trunc(top10f[0][0], 26));
          document.getElementById("ind_topFat").innerHTML = dvDisabled ? "" :
            `<span class="badge-kpi badge-lm"><span class="bk-label">1Â°</span><span class="bk-val">${brlS(sumV(top10f[0][1]))}</span><span class="bk-pct">${t1fPct}%</span></span>` +
            (top10f.length > 1 ? `<span class="badge-kpi badge-ly"><span class="bk-label">2Â°</span><span class="bk-val">${brlS(sumV(top10f[1][1]))}</span><span class="bk-pct">${fat > 0 ? (sumV(top10f[1][1])/fat*100).toFixed(1) : 0}%</span></span>` : "");
        }
        mkChart("cTCF", {
          type: "bar",
          data: {
            labels: top10f.map(([k]) => trunc(k)),
            datasets: [
              { data: top10f.map(([, v]) => sumV(v)), backgroundColor: PAL },
            ],
          },
          options: opts0({ noLegend: true, hBar: true, xBrl: true }),
        });

        // Motoristas
        const motMap = new Map();
        rv.forEach((r) => {
          if (r._mot !== "Sem motorista") motMap.set(r._motKey || r._mot, r._mot);
        });
        const mots = [...motMap.entries()].map(([key, label]) => ({ key, label }));
        const moLabels = mks.length > 0
          ? mls.map(label => label.split(" ")[0])
          : monthsLabelsAll;
        const moDatasets =
          mots.length > 0
            ? mots.map((m, i) => ({
                label: trunc(m.label, 16),
                data: (mks.length > 0 ? mks : monthsLabelsAll).map((k, idx) =>
                  mks.length > 0
                    ? (byM[k] || []).filter((r) => (r._motKey || r._mot) === m.key).length
                    : null,
                ),
                backgroundColor: PAL[i % PAL.length],
                stack: "m",
              }))
            : [] || [
                {
                  label: "Dados mÃ©dios",
                  data: monthsLabelsAll.map((m, i) =>
                    Math.round((yearDataMap[2025]?.[i] || 0) / 50),
                  ),
                  backgroundColor: "#1a6cf5",
                  stack: "m",
                },
              ];
        const motCount = mots.length > 0 ? mots.length : 0;
        set("v_topMot", dvDisabled ? "â€”" : motCount.toLocaleString("pt-BR"));
        set("sub_mm", dvDisabled ? "â€”" : `${motCount > 0 ? motCount : "â€”"} motoristas ativos`);
        if (!dvDisabled && mots.length > 0) {
          // Find top motorista by total services
          const motTotals = mots.map(m => ({
            name: m.label,
            count: mks.length > 0
              ? mks.reduce((s, k) => s + (byM[k]||[]).filter(r=>(r._motKey || r._mot)===m.key).length, 0)
              : 0,
          })).sort((a, b) => b.count - a.count);
          const topMot = motTotals[0];
          const topMotPct = rv.length ? (topMot.count / rv.length * 100).toFixed(1) : 0;
          document.getElementById("ind_mot").innerHTML =
            `<span class="badge-kpi badge-lm"><span class="bk-label">1Â°</span><span class="bk-val">${topMot.count}</span><span class="bk-pct">${topMotPct}%</span></span>` +
            (motTotals.length > 1 ? `<span class="badge-kpi badge-ly"><span class="bk-label">2Â°</span><span class="bk-val">${motTotals[1].count}</span><span class="bk-pct">${rv.length ? (motTotals[1].count/rv.length*100).toFixed(1) : 0}%</span></span>` : "");
        }
        mkChart("cMM", {
          type: "bar",
          data: { labels: moLabels, datasets: moDatasets },
          options: opts0({ legendRight: true }),
        });

        // ===== PÃGINA SERVIÃ‡OS =====
        set("sT", dvDisabled ? "â€”" : rv.length.toLocaleString("pt-BR"));
        set("sCon", dvDisabled ? "â€”" : conclServices.length);
        set("sPen", dvDisabled ? "â€”" : pendentes.length);
        set("sCan", dvDisabled ? "â€”" : cancelados.length);
        set("sTk", dvDisabled ? "â€”" : brl(curTk));
        set("sSemVal", dvDisabled ? "â€”" : semValor.length);
        set("sFat", dvDisabled ? "â€”" : brlS(fat));
        const byTipo = grp(rv, (r) => r._tipoL);
        const tipoKeys = Object.keys(byTipo)
          .filter((k) => k !== "__null__")
          .sort((a, b) => byTipo[b].length - byTipo[a].length);
        const totalServicos = rv.length;
        const tipoData = tipoKeys.map((k) => ({
          label: k,
          count: byTipo[k].length,
          pct: totalServicos
            ? ((byTipo[k].length / totalServicos) * 100).toFixed(1)
            : "0.0",
        }));
        mkChart("cServicosTipo", {
          type: "bar",
          data: {
            labels: tipoData.map((d) => `${d.label} (${d.pct}%)`),
            datasets: [
              {
                data: tipoData.map((d) => d.count),
                backgroundColor: PAL,
                borderRadius: 5,
              },
            ],
          },
          options: opts0({ noLegend: true, hBar: true }),
        });
        const byVei = grp(rv, (r) => r._veiL);
        const vK = Object.keys(byVei)
          .filter((k) => k !== "__null__")
          .sort((a, b) => byVei[b].length - byVei[a].length);
        mkChart("cTipoVei", {
          type: "bar",
          data: {
            labels: vK.map((k) => trunc(k, 16)),
            datasets: [
              { data: vK.map((k) => byVei[k].length), backgroundColor: PAL },
            ],
          },
          options: opts0({ noLegend: true, hBar: true }),
        });
        tblCache.tbSrv = rv;
        set(
          "metaSrv",
          dvDisabled ? "â€”" : `${rv.length.toLocaleString("pt-BR")} registros`,
        );
        renderSrvTable(rv);

        // Demais abas
        renderFaturamento(dvDisabled, rv, fat, curTk, mks, mls, byM, byCli, currentYear, yearDataMap);
        renderPagamentos(dvDisabled, aReceber);
        renderFrota(dvDisabled);
        renderMotoristas(dvDisabled, rv, fat, mks, mls, byM, currentYear, yearDataMap);
        renderManutencoes(dvDisabled, custoTotal, manByM, manMks, yearDataMap);
        renderMultas(dvDisabled);
        renderTrocas(dvDisabled);
        renderMarketing(dvDisabled);
      }

      // FunÃ§Ãµes de renderizaÃ§Ã£o das outras abas (implementaÃ§Ã£o funcional)
      function renderFaturamento(
        dvDisabled,
        rv,
        fat,
        curTk,
        mks,
        mls,
        byM,
        byCli,
        currentYear,
        yearDataMap,
      ) {
        set("fT", dvDisabled ? "â€”" : brlS(fat));
        set("fTk", dvDisabled ? "â€”" : brlS(curTk));
        const maxVal = rv.length ? Math.max(...rv.map((r) => r._valor)) : 0;
        set("fMax", dvDisabled ? "â€”" : brlS(maxVal));
        const cliAtivos = new Set(
          rv.map((r) => r._cli).filter((x) => x !== "Sem cliente"),
        ).size;
        set("fCli", dvDisabled ? "â€”" : cliAtivos);
        const fmLabels = mks.length > 0
          ? mls.map(label => label.split(" ")[0])
          : monthsLabelsAll;
        const fmData =
          mks.length > 0
            ? mks.map((k) => sumV(byM[k]))
            : monthsLabelsAll.map((m, i) => yearDataMap[currentYear]?.[i] || 0);
        mkChart("cFM2", {
          type: "line",
          data: {
            labels: fmLabels,
            datasets: [
              {
                label: "Fat.",
                data: fmData,
                borderColor: "#0a9396",
                backgroundColor: "rgba(10,147,150,.08)",
                fill: true,
                tension: 0.45,
                pointRadius: 2,
                pointBackgroundColor: "#0a9396",
              },
            ],
          },
          options: opts0({ noLegend: true, yBrl: true }),
        });
        const byFatSt = grp(rv, (r) => r._fatStL);
        const fsK = Object.keys(byFatSt)
          .filter((k) => k !== "__null__")
          .sort((a, b) => byFatSt[b].length - byFatSt[a].length);
        mkChart("cFatSt", {
          type: "bar",
          data: {
            labels: fsK.map((k) => trunc(k, 16)),
            datasets: [
              { data: fsK.map((k) => byFatSt[k].length), backgroundColor: PAL },
            ],
          },
          options: opts0({ noLegend: true, hBar: true }),
        });
        const cliRows = Object.entries(byCli)
          .map(([n, v]) => ({
            nome: n,
            qtd: v.length,
            fat: sumV(v),
            ticket: v.length ? sumV(v) / v.length : 0,
          }))
          .sort((a, b) => b.fat - a.fat);
        tblCache.tbFat = cliRows;
        set("metaFat", dvDisabled ? "â€”" : `${cliRows.length} clientes`);
        renderSumTable("tbFat", cliRows, fat);
      }
      function renderPagamentos(dvDisabled, aReceber) {
        const pags = dvDisabled ? [] : DB.pagantes;
        const pgFv = (r, f) =>
          r[`${f}@OData.Community.Display.V1.FormattedValue`] ?? r[f];
        const pagReceb = pags.filter(
          (r) =>
            stL(String(pgFv(r, F.pag.status) || "")).includes("pago") ||
            stL(String(pgFv(r, F.pag.status) || "")).includes("receb"),
        );
        set(
          "pTot",
          dvDisabled
            ? "â€”"
            : brlS(
                pagReceb.reduce(
                  (s, r) => s + (parseFloat(r[F.pag.valor]) || 0),
                  0,
                ),
              ),
        );
        set("pPend", dvDisabled ? "â€”" : brlS(aReceber));
        set("pQtd", dvDisabled ? "â€”" : pags.length);
        const byForma = grp(pags, (r) => String(pgFv(r, F.pag.forma) || "â€”"));
        const byPagSt = grp(pags, (r) => String(pgFv(r, F.pag.status) || "â€”"));
        const fmK = Object.keys(byForma)
          .filter((k) => k !== "__null__")
          .sort((a, b) => byForma[b].length - byForma[a].length);
        const psK = Object.keys(byPagSt)
          .filter((k) => k !== "__null__")
          .sort((a, b) => byPagSt[b].length - byPagSt[a].length);
        mkChart("cForma", {
          type: "bar",
          data: {
            labels: fmK.map((k) => trunc(k, 16)),
            datasets: [
              { data: fmK.map((k) => byForma[k].length), backgroundColor: PAL },
            ],
          },
          options: opts0({ noLegend: true, hBar: true }),
        });
        mkChart("cPagSt", {
          type: "bar",
          data: {
            labels: psK.map((k) => trunc(k, 16)),
            datasets: [
              { data: psK.map((k) => byPagSt[k].length), backgroundColor: PAL },
            ],
          },
          options: opts0({ noLegend: true, hBar: true }),
        });
        set("metaPag", dvDisabled ? "â€”" : `${pags.length} registros`);
        document.getElementById("tbPag").innerHTML =
          pags
            .slice(0, 300)
            .map(
              (r) =>
                `<tr><td>${badge(String(pgFv(r, F.pag.status) || "â€”"))}</td><td>${String(pgFv(r, F.pag.forma) || "â€”")}</td><td class="r em">${brl(parseFloat(r[F.pag.valor]) || 0)}</td></tr>`,
            )
            .join("") || emptyRow(3);
      }
      function renderFrota(dvDisabled) {
        const vei = dvDisabled ? [] : DB.veiculos;
        const vFv = (r, f) =>
          r[`${f}@OData.Community.Display.V1.FormattedValue`] ?? r[f];
        const disp = vei.filter(
          (r) =>
            stL(String(vFv(r, F.vei.status) || "")).includes("dispon") ||
            stL(String(vFv(r, F.vei.status) || "")).includes("ativo") ||
            stL(String(vFv(r, F.vei.status) || "")).includes("livre"),
        );
        const blin = vei.filter(
          (r) =>
            r[F.vei.blindado] === true ||
            r[F.vei.blindado] === "true" ||
            r[F.vei.blindado] === 1,
        );
        const vManF = vei.filter((r) =>
          stL(String(vFv(r, F.vei.status) || "")).includes("manut"),
        );
        set("vTot", dvDisabled ? "â€”" : vei.length);
        set("vDisp", dvDisabled ? "â€”" : disp.length);
        set("vBlin", dvDisabled ? "â€”" : blin.length);
        set("vMan", dvDisabled ? "â€”" : vManF.length);
        const byVSt = grp(vei, (r) => String(vFv(r, F.vei.status) || "â€”"));
        const byMarca = grp(vei, (r) => r[F.vei.marca] || "â€”");
        const vsK = Object.keys(byVSt)
          .filter((k) => k !== "__null__")
          .sort((a, b) => byVSt[b].length - byVSt[a].length);
        const mkK = Object.keys(byMarca)
          .filter((k) => k !== "__null__")
          .sort((a, b) => byMarca[b].length - byMarca[a].length);
        mkChart("cFrotaSt", {
          type: "bar",
          data: {
            labels: vsK.map((k) => trunc(k, 16)),
            datasets: [
              { data: vsK.map((k) => byVSt[k].length), backgroundColor: PAL },
            ],
          },
          options: opts0({ noLegend: true, hBar: true }),
        });
        mkChart("cFrotaMarca", {
          type: "bar",
          data: {
            labels: mkK,
            datasets: [
              { data: mkK.map((k) => byMarca[k].length), backgroundColor: PAL },
            ],
          },
          options: opts0({ noLegend: true }),
        });
        tblCache.tbFrota = vei.map((r) => ({
          placa: r[F.vei.placa] || "â€”",
          marca: r[F.vei.marca] || "â€”",
          modelo: r[F.vei.modelo] || "â€”",
          ano: r[F.vei.ano] || "â€”",
          blindado: r[F.vei.blindado],
          status: String(vFv(r, F.vei.status) || "â€”"),
        }));
        set("metaFrota", dvDisabled ? "â€”" : `${vei.length} veÃ­culos`);
        renderFrotaTable(tblCache.tbFrota);
      }
      function renderMotoristas(dvDisabled, rv, fat, mks, mls, byM, currentYear, yearDataMap) {
        set("mTot", dvDisabled ? "â€”" : DB.funcionarios.length);
        const cnhWarn = DB.funcionarios.filter((r) => {
          if (!r[F.fun.cnh]) return true;
          return (
            (new Date(r[F.fun.cnh]) - new Date()) / (1000 * 60 * 60 * 24) < 90
          );
        });
        set("mCnh", dvDisabled ? "â€”" : cnhWarn.length);
        set("mSrv", dvDisabled ? "â€”" : rv.length);
        const motMap = new Map();
        rv.forEach((r) => {
          if (r._mot !== "Sem motorista") motMap.set(r._motKey || r._mot, r._mot);
        });
        const mots = [...motMap.entries()].map(([key, label]) => ({ key, label }));
        const monthsLabelsAll = [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
        ];
        const motLabels = mks.length > 0
          ? mls.map(label => label.split(" ")[0].charAt(0).toUpperCase() + label.split(" ")[0].slice(1))
          : monthsLabelsAll;
        const motDatasets =
          mots.length > 0
            ? mots.map((m, i) => ({
                label: trunc(m.label, 16),
                data: (mks.length > 0 ? mks : monthsLabelsAll).map((k, idx) =>
                  mks.length > 0
                    ? (byM[k] || []).filter((r) => (r._motKey || r._mot) === m.key).length
                    : null,
                ),
                backgroundColor: PAL[i % PAL.length],
                stack: "m",
              }))
            : [] || [
                {
                  label: "Dados mÃ©dios",
                  data: monthsLabelsAll.map((m, i) =>
                    Math.round((yearDataMap[currentYear]?.[i] || 0) / 50000),
                  ),
                  backgroundColor: "#1a6cf5",
                  stack: "m",
                },
              ];
        mkChart("cMotMes", {
          type: "bar",
          data: { labels: motLabels, datasets: motDatasets },
          options: opts0({ legendRight: true }),
        });
        const motRows = DB.funcionarios
          .map((f) => {
            const funcId = String(f.cr40f_funcionariosid || "").toLowerCase();
            const apelido = f[F.fun.apelido] || "";
            const nome = apelido || f[F.fun.nome] || "â€”";
            const srvs = rv.filter((r) =>
              funcId ? r._motId === funcId : r._mot === nome
            );
            return {
              nome,
              funcao: f[F.fun.funcao] || "â€”",
              qtd: srvs.length,
              fat: sumV(srvs),
              ticket: srvs.length ? sumV(srvs) / srvs.length : 0,
              cnh: f[F.fun.cnh],
            };
          })
          .sort((a, b) => b.qtd - a.qtd);
        tblCache.tbMot = motRows;
        set(
          "metaMot",
          dvDisabled ? "â€”" : `${DB.funcionarios.length} motoristas`,
        );
        renderMotTable(motRows, fat);
      }
      function renderManutencoes(dvDisabled, custoTotal, manByM, manMks, yearDataMap) {
        const mans = dvDisabled ? [] : VW.manutencoes;
        const manFv = (r, f) =>
          r[`${f}@OData.Community.Display.V1.FormattedValue`] ?? r[f];
        const manAnd = mans.filter(
          (r) =>
            stL(String(manFv(r, F.man.status) || "")).includes("andamento") ||
            stL(String(manFv(r, F.man.status) || "")).includes("aberto") ||
            stL(String(manFv(r, F.man.status) || "")).includes("pend"),
        );
        set("manTot", dvDisabled ? "â€”" : mans.length);
        set("manCusto", dvDisabled ? "â€”" : brlS(custoTotal));
        set("manAnd", dvDisabled ? "â€”" : manAnd.length);
        set(
          "manMed",
          dvDisabled ? "â€”" : brlS(mans.length ? custoTotal / mans.length : 0),
        );
        const mmLabels = manMks.length > 0 ? manMks.map(mL) : monthsLabelsAll;
        const mmData =
          manMks.length > 0
            ? manMks.map((k) =>
                manByM[k].reduce(
                  (s, r) => s + (parseFloat(r[F.man.valor]) || 0),
                  0,
                ),
              )
            : [];
        mkChart("cManMes", {
          type: "bar",
          data: {
            labels: mmLabels,
            datasets: [
              {
                label: "Custo",
                data: mmData,
                backgroundColor: "#e07000",
                borderRadius: 5,
              },
            ],
          },
          options: opts0({ noLegend: true, yBrl: true }),
        });
        const byManTp = grp(mans, (r) => String(manFv(r, F.man.tipo) || "â€”"));
        const mtK = Object.keys(byManTp)
          .filter((k) => k !== "__null__")
          .sort((a, b) => byManTp[b].length - byManTp[a].length);
        mkChart("cManTipo", {
          type: "bar",
          data: {
            labels: mtK.map((k) => trunc(k, 16)),
            datasets: [
              { data: mtK.map((k) => byManTp[k].length), backgroundColor: PAL },
            ],
          },
          options: opts0({ noLegend: true, hBar: true }),
        });
        set("metaMan", dvDisabled ? "â€”" : `${mans.length} registros`);
        document.getElementById("tbMan").innerHTML =
          mans
            .slice(0, 300)
            .map(
              (r) =>
                `<tr><td class="dim">${fmtD(r[F.man.data])}</td><td class="em">${r[`_${F.man.veiculo}_value@OData.Community.Display.V1.FormattedValue`] || "â€”"}</td><td>${String(manFv(r, F.man.tipo) || "â€”")}</td><td>${badge(String(manFv(r, F.man.status) || "â€”"))}</td><td class="r em">${brl(parseFloat(r[F.man.valor]) || 0)}</td></tr>`,
            )
            .join("") || emptyRow(5);
      }
      function renderMultas(dvDisabled) {
        const muls = dvDisabled ? [] : VW.multas;
        const mulFv = (r, f) =>
          r[`${f}@OData.Community.Display.V1.FormattedValue`] ?? r[f];
        const mulPen = muls.filter(
          (r) =>
            stL(String(mulFv(r, F.mul.status) || "")).includes("pend") ||
            stL(String(mulFv(r, F.mul.status) || "")).includes("indicad"),
        );
        const mulRes = muls.filter(
          (r) =>
            stL(String(mulFv(r, F.mul.status) || "")).includes("pago") ||
            stL(String(mulFv(r, F.mul.status) || "")).includes("resolvid") ||
            stL(String(mulFv(r, F.mul.status) || "")).includes("conclu"),
        );
        set("mulTot", dvDisabled ? "â€”" : muls.length);
        set("mulPen", dvDisabled ? "â€”" : mulPen.length);
        set("mulRes", dvDisabled ? "â€”" : mulRes.length);
        const byMulSt = grp(muls, (r) => String(mulFv(r, F.mul.status) || "â€”"));
        const byMulMot = grp(muls, (r) => {
          const motId = r[`_${F.mul.mot}_value`];
          const motName =
            r[
              `_${F.mul.mot}_value@OData.Community.Display.V1.FormattedValue`
            ] || "â€”";
          return funcMapGlobal.get(String(motId)?.toLowerCase()) || motName;
        });
        const msK = Object.keys(byMulSt)
          .filter((k) => k !== "__null__")
          .sort((a, b) => byMulSt[b].length - byMulSt[a].length);
        const mmK = Object.keys(byMulMot)
          .filter((k) => k !== "__null__")
          .sort((a, b) => byMulMot[b].length - byMulMot[a].length)
          .slice(0, 10);
        mkChart("cMulSt", {
          type: "bar",
          data: {
            labels: msK.map((k) => trunc(k, 16)),
            datasets: [
              {
                data: msK.map((k) => byMulSt[k].length),
                backgroundColor: "#c0392b",
              },
            ],
          },
          options: opts0({ noLegend: true, hBar: true }),
        });
        mkChart("cMulMot", {
          type: "bar",
          data: {
            labels: mmK.map((k) => trunc(k)),
            datasets: [
              {
                data: mmK.map((k) => byMulMot[k].length),
                backgroundColor: "#c0392b",
              },
            ],
          },
          options: opts0({ noLegend: true, hBar: true }),
        });
        set("metaMul", dvDisabled ? "â€”" : `${muls.length} registros`);
        document.getElementById("tbMul").innerHTML =
          muls
            .slice(0, 300)
            .map((r) => {
              const motId = r[`_${F.mul.mot}_value`];
              const motName =
                r[
                  `_${F.mul.mot}_value@OData.Community.Display.V1.FormattedValue`
                ] || "â€”";
              const motDisplay =
                funcMapGlobal.get(String(motId)?.toLowerCase()) || motName;
              return `<tr><td class="dim">${fmtDt(r[F.mul.data])}</td><td>${motDisplay}</td><td class="em">${r[`_${F.mul.placa}_value@OData.Community.Display.V1.FormattedValue`] || "â€”"}</td><td>${badge(String(mulFv(r, F.mul.status) || "â€”"))}</td></tr>`;
            })
            .join("") || emptyRow(4);
      }
      function renderTrocas(dvDisabled) {
        const trcs = dvDisabled ? [] : VW.trocas;
        const trcFv = (r, f) =>
          r[`${f}@OData.Community.Display.V1.FormattedValue`] ?? r[f];
        const trcPen = trcs.filter(
          (r) =>
            stL(String(trcFv(r, F.trc.status) || "")).includes("pend") ||
            stL(String(trcFv(r, F.trc.status) || "")).includes("aguard"),
        );
        const trcCon = trcs.filter(
          (r) =>
            stL(String(trcFv(r, F.trc.status) || "")).includes("conclu") ||
            stL(String(trcFv(r, F.trc.status) || "")).includes("realiz"),
        );
        set("trcTot", dvDisabled ? "â€”" : trcs.length);
        set("trcPen", dvDisabled ? "â€”" : trcPen.length);
        set("trcCon", dvDisabled ? "â€”" : trcCon.length);
        const byTrcSt = grp(trcs, (r) => String(trcFv(r, F.trc.status) || "â€”"));
        const byTrcTp = grp(trcs, (r) => String(trcFv(r, F.trc.tipo) || "â€”"));
        const tsK = Object.keys(byTrcSt)
          .filter((k) => k !== "__null__")
          .sort((a, b) => byTrcSt[b].length - byTrcSt[a].length);
        const ttK = Object.keys(byTrcTp)
          .filter((k) => k !== "__null__")
          .sort((a, b) => byTrcTp[b].length - byTrcTp[a].length);
        mkChart("cTrcSt", {
          type: "bar",
          data: {
            labels: tsK.map((k) => trunc(k, 16)),
            datasets: [
              { data: tsK.map((k) => byTrcSt[k].length), backgroundColor: PAL },
            ],
          },
          options: opts0({ noLegend: true, hBar: true }),
        });
        mkChart("cTrcTp", {
          type: "bar",
          data: {
            labels: ttK.map((k) => trunc(k, 16)),
            datasets: [
              { data: ttK.map((k) => byTrcTp[k].length), backgroundColor: PAL },
            ],
          },
          options: opts0({ noLegend: true, hBar: true }),
        });
        set("metaTrc", dvDisabled ? "â€”" : `${trcs.length} registros`);
        document.getElementById("tbTrc").innerHTML =
          trcs
            .slice(0, 200)
            .map(
              (r) =>
                `<tr><td class="dim">${fmtDt(r[F.trc.data])}</td><td>${String(trcFv(r, F.trc.tipo) || "â€”")}</td><td>${badge(String(trcFv(r, F.trc.status) || "â€”"))}</td></tr>`,
            )
            .join("") || emptyRow(3);
      }
      function renderMarketing(dvDisabled) {
        const mkts = dvDisabled ? [] : DB.marketing;
        const mktFv = (r, f) =>
          r[`${f}@OData.Community.Display.V1.FormattedValue`] ?? r[f];
        const mktPub = mkts.filter(
          (r) =>
            stL(String(mktFv(r, F.mkt.status) || "")).includes("public") ||
            stL(String(mktFv(r, F.mkt.status) || "")).includes("ativo"),
        );
        const mktProd = mkts.filter(
          (r) =>
            stL(String(mktFv(r, F.mkt.status) || "")).includes("produc") ||
            stL(String(mktFv(r, F.mkt.status) || "")).includes("pend") ||
            stL(String(mktFv(r, F.mkt.status) || "")).includes("rascunho"),
        );
        set("mktTot", dvDisabled ? "â€”" : mkts.length);
        set("mktPub", dvDisabled ? "â€”" : mktPub.length);
        set("mktProd", dvDisabled ? "â€”" : mktProd.length);
        const byMktCat = grp(mkts, (r) => String(mktFv(r, F.mkt.cat) || "â€”"));
        const byMktSt = grp(mkts, (r) => String(mktFv(r, F.mkt.status) || "â€”"));
        const mcK = Object.keys(byMktCat)
          .filter((k) => k !== "__null__")
          .sort((a, b) => byMktCat[b].length - byMktCat[a].length);
        const msKm = Object.keys(byMktSt)
          .filter((k) => k !== "__null__")
          .sort((a, b) => byMktSt[b].length - byMktSt[a].length);
        mkChart("cMktCat", {
          type: "bar",
          data: {
            labels: mcK.map((k) => trunc(k, 16)),
            datasets: [
              {
                data: mcK.map((k) => byMktCat[k].length),
                backgroundColor: PAL,
              },
            ],
          },
          options: opts0({ noLegend: true, hBar: true }),
        });
        mkChart("cMktSt", {
          type: "bar",
          data: {
            labels: msKm.map((k) => trunc(k, 16)),
            datasets: [
              {
                data: msKm.map((k) => byMktSt[k].length),
                backgroundColor: PAL,
              },
            ],
          },
          options: opts0({ noLegend: true, hBar: true }),
        });
        set("metaMkt", dvDisabled ? "â€”" : `${mkts.length} publicaÃ§Ãµes`);
        document.getElementById("tbMkt").innerHTML =
          mkts
            .slice(0, 200)
            .map(
              (r) =>
                `<tr><td class="dim">${fmtD(r[F.mkt.data])}</td><td>${String(mktFv(r, F.mkt.cat) || "â€”")}</td><td>${badge(String(mktFv(r, F.mkt.status) || "â€”"))}</td></tr>`,
            )
            .join("") || emptyRow(3);
      }

      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      // CHART HELPERS
      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      const FONT = { family: "'Plus Jakarta Sans',system-ui,sans-serif" };
      function opts0({
        noLegend,
        yBrl,
        xBrl,
        hBar,
        legendRight,
        datalabels = true,
      } = {}) {
        let baseOpts = {
          responsive: true,
          maintainAspectRatio: true,
          animation: { duration: 400 },
          plugins: {
            legend: {
              display: !noLegend,
              position: legendRight ? "right" : "top",
              labels: {
                color: "#4a5068",
                font: { ...FONT, size: 11 },
                boxWidth: 10,
                boxHeight: 10,
                padding: 12,
              },
            },
            tooltip: {
              backgroundColor: "#0f1117",
              titleColor: "#ffffff",
              bodyColor: "#a0a8c0",
              borderColor: "#2a2d3a",
              borderWidth: 1,
              padding: 12,
              cornerRadius: 8,
              titleFont: { ...FONT, weight: "700", size: 12 },
              bodyFont: { ...FONT, size: 11 },
              callbacks: yBrl || xBrl ? { label: (c) => brl(c.raw) } : {},
            },
            datalabels: datalabels
              ? {
                  anchor: hBar ? "end" : "end",
                  align: hBar ? "right" : "top",
                  offset: 4,
                  color: "#4a5068",
                  font: { ...FONT, size: 9, weight: "600" },
                  formatter: (value) => {
                    if (value === 0 || value === null || value === undefined)
                      return "";
                    if (yBrl || xBrl) return brlS(value);
                    if (value >= 1000) return (value / 1000).toFixed(1) + "k";
                    return value.toLocaleString("pt-BR");
                  },
                }
              : { display: false },
          },
          scales: {
            x: {
              type: "category",
              ticks: {
                color: "#8a91a8",
                font: { ...FONT, size: 10 },
                callback: xBrl ? (v) => brlS(v) : function(value) { return this.getLabelForValue(value); },
              },
              grid: { color: "#f0f2f5", drawBorder: false },
            },
            y: {
              ticks: {
                color: "#8a91a8",
                font: { ...FONT, size: 10 },
                callback: yBrl ? (v) => brlS(v) : undefined,
              },
              grid: { color: "#f0f2f5", drawBorder: false },
              beginAtZero: true,
            },
          },
        };
        if (hBar) {
          baseOpts.indexAxis = "y";
          baseOpts.scales.y = {
            type: "category",
            ticks: { color: "#8a91a8", font: { ...FONT, size: 10 } },
            grid: { display: false },
          };
          baseOpts.scales.x = {
            type: "linear",
            ticks: {
              color: "#8a91a8",
              font: { ...FONT, size: 10 },
              callback: xBrl ? (v) => brlS(v) : undefined,
            },
            grid: { color: "#f0f2f5" },
            beginAtZero: true,
          };
        }
        return baseOpts;
      }
      function mkChart(id, cfg) {
        const el = document.getElementById(id);
        if (!el) return;
        if (charts[id]) charts[id].destroy();
        setChartEmptyState(el, !chartHasData(cfg?.data?.datasets || []));
        charts[id] = new Chart(el, cfg);
      }
      function chartHasData(datasets) {
        return datasets.some((ds) =>
          (ds.data || []).some((v) => v !== null && v !== undefined && Number(v) !== 0)
        );
      }
      function setChartEmptyState(canvas, show) {
        const parent = canvas.parentElement;
        if (!parent) return;
        let empty = parent.querySelector(".chart-empty");
        if (show) {
          if (!empty) {
            empty = document.createElement("div");
            empty.className = "chart-empty";
            empty.textContent = "sem dados";
            parent.appendChild(empty);
          }
        } else if (empty) {
          empty.remove();
        }
      }
      function mkSpark(id, labels, data, color) {
        const el = document.getElementById(id);
        if (!el) return;
        if (charts[id]) charts[id].destroy();
        setChartEmptyState(el, !data.some((v) => v !== null && v !== undefined && Number(v) !== 0));
        charts[id] = new Chart(el, {
          type: "line",
          data: {
            labels,
            datasets: [{
              data,
              borderColor: color,
              backgroundColor: color + "1f",
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 0,
              tension: 0.42,
              fill: true,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 300 },
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false },
              datalabels: { display: false },
            },
            scales: {
              x: { display: false },
              y: { display: false, beginAtZero: false },
            },
            elements: { line: { capBezierPoints: true } },
          },
        });
      }

      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      // TABLE RENDERERS
      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      function renderSrvTable(rows) {
        document.getElementById("tbSrv").innerHTML =
          rows
            .slice(0, 500)
            .map(
              (r) => `<tr>
    <td class="dim">${fmtDt(r[F.res.data])}</td><td class="em">${r._cli}</td><td>${r._mot}</td>
    <td class="dim">${r._tipoL}</td><td class="dim">${r._veiL}</td><td>${badge(r._stL)}</td><td>${badge(r._fatStL)}</td>
    <td class="r em">${r._valor ? brl(r._valor) : '<span class="dim">â€”</span>'}</td>
  </tr>`,
            )
            .join("") || emptyRow(8);
      }
      function renderSumTable(id, rows, totalFat) {
        document.getElementById(id).innerHTML =
          rows
            .map(
              (r, i) => `<tr>
    <td><span class="rn ${i === 0 ? "r1" : i === 1 ? "r2" : i === 2 ? "r3" : ""}">${i + 1}</span></td>
    <td class="em">${r.nome}</td><td class="r">${r.qtd.toLocaleString("pt-BR")}</td>
    <td class="r em">${brl(r.fat)}</td><td class="r dim">${brl(r.ticket)}</td>
    <td><div class="prg"><div class="prg-bg"><div class="prg-fill" style="width:${totalFat ? Math.min(100, Math.round((r.fat / totalFat) * 100)) : 0}%;background:${PAL[i % PAL.length]}"></div></div><span class="prg-pct">${totalFat ? Math.round((r.fat / totalFat) * 100) : 0}%</span></div></td>
  </tr>`,
            )
            .join("") || emptyRow(6);
      }
      function renderFrotaTable(rows) {
        document.getElementById("tbFrota").innerHTML =
          rows
            .map(
              (r) => `<tr>
    <td class="em">${r.placa}</td><td>${r.marca}</td><td>${r.modelo}</td><td class="dim">${r.ano}</td>
    <td class="c">${r.blindado === true || r.blindado === "true" || r.blindado === 1 ? "ðŸ›¡ï¸ Sim" : "â€”"}</td><td>${badge(r.status)}</td>
  </tr>`,
            )
            .join("") || emptyRow(6);
      }
      function renderMotTable(rows, totalFat) {
        const hoje = new Date();
        document.getElementById("tbMot").innerHTML =
          rows
            .map((r, i) => {
              let cnhCls = "dim",
                cnhTxt = "â€”";
              if (r.cnh) {
                const d = new Date(r.cnh);
                const diff = (d - hoje) / (1000 * 60 * 60 * 24);
                cnhTxt = fmtD(r.cnh);
                if (diff < 0) cnhCls = 'em" style="color:var(--red)';
                else if (diff < 90) cnhCls = 'em" style="color:var(--yellow)';
              }
              return `<tr>
      <td><span class="rn ${i === 0 ? "r1" : i === 1 ? "r2" : i === 2 ? "r3" : ""}">${i + 1}</span></td>
      <td class="em">${r.nome}</td><td class="dim">${r.funcao}</td><td class="r">${r.qtd.toLocaleString("pt-BR")}</td>
      <td class="r em">${brl(r.fat)}</td><td class="r dim">${brl(r.ticket)}</td><td class="${cnhCls}">${cnhTxt}</td>
      <td><div class="prg"><div class="prg-bg"><div class="prg-fill" style="width:${totalFat ? Math.min(100, Math.round((r.fat / totalFat) * 100)) : 0}%;background:var(--blue)"></div></div><span class="prg-pct">${totalFat ? Math.round((r.fat / totalFat) * 100) : 0}%</span></div></td>
    </tr>`;
            })
            .join("") || emptyRow(8);
      }

      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      // TABLE SORT + SEARCH
      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      function srt(tbId, field, th) {
        th.closest("thead")
          .querySelectorAll("th")
          .forEach((t) => t.classList.remove("sa", "sd"));
        const key = tbId + field;
        const asc = srtSt[key] !== true;
        srtSt[key] = asc;
        th.classList.add(asc ? "sa" : "sd");
        const fat = sumV(VW.reservas);
        const sortFn = (a, b, f) =>
          typeof a[f] === "string"
            ? asc
              ? a[f].localeCompare(b[f])
              : b[f].localeCompare(a[f])
            : asc
              ? a[f] - b[f]
              : b[f] - a[f];
        if (tbId === "tbFat") {
          let r = [...(tblCache.tbFat || [])];
          r.sort((a, b) => sortFn(a, b, field));
          renderSumTable("tbFat", r, fat);
        }
        if (tbId === "tbMot") {
          let r = [...(tblCache.tbMot || [])];
          r.sort((a, b) => {
            if (field === "cnh") {
              const a2 = a.cnh ? new Date(a.cnh).getTime() : 0,
                b2 = b.cnh ? new Date(b.cnh).getTime() : 0;
              return asc ? a2 - b2 : b2 - a2;
            }
            return sortFn(a, b, field);
          });
          renderMotTable(r, fat);
        }
        if (tbId === "tbSrv") {
          const fm = {
            data: "_ts",
            cliente: "_cli",
            motorista: "_mot",
            tipo: "_tipoL",
            veiculo: "_veiL",
            status: "_stL",
            fatStatus: "_fatStL",
            valor: "_valor",
          };
          const f = fm[field] || field;
          let r = [...(tblCache.tbSrv || VW.reservas)];
          r.sort((a, b) => sortFn(a, b, f));
          tblCache.tbSrv = r;
          renderSrvTable(r);
        }
        if (tbId === "tbFrota") {
          let r = [...(tblCache.tbFrota || [])];
          r.sort((a, b) => sortFn(a, b, field));
          renderFrotaTable(r);
        }
      }
      function srchReg(q) {
        const lq = (q || "").toLowerCase();
        const rows = VW.reservas.filter(
          (r) =>
            !lq ||
            r._cli.toLowerCase().includes(lq) ||
            r._mot.toLowerCase().includes(lq),
        );
        tblCache.tbSrv = rows;
        renderSrvTable(rows);
      }
      function srchTbl(id, q, field) {
        const lq = (q || "").toLowerCase();
        const fat = sumV(VW.reservas);
        if (id === "tbFat") {
          const r = (tblCache.tbFat || []).filter(
            (r) => !lq || r.nome.toLowerCase().includes(lq),
          );
          renderSumTable("tbFat", r, fat);
        }
        if (id === "tbMot") {
          const r = (tblCache.tbMot || []).filter(
            (r) => !lq || r.nome.toLowerCase().includes(lq),
          );
          renderMotTable(r, fat);
        }
        if (id === "tbFrota") {
          const r = (tblCache.tbFrota || []).filter(
            (r) =>
              !lq ||
              r.placa.toLowerCase().includes(lq) ||
              r.modelo.toLowerCase().includes(lq),
          );
          renderFrotaTable(r);
        }
      }

      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      // UI HELPERS
      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      function badge(s) {
        if (!s || s === "â€”") return '<span class="dim">â€”</span>';
        const k = s.toLowerCase();
        let bg, c;
        if (
          k.includes("cancel") ||
          k.includes("recus") ||
          k.includes("vencid") ||
          k.includes("irregular")
        ) {
          bg = "var(--red-l)";
          c = "var(--red)";
        } else if (
          k.includes("conclu") ||
          k.includes("realiz") ||
          k.includes("finaliz") ||
          k.includes("pago") ||
          k.includes("receb") ||
          k.includes("public") ||
          k.includes("ativo")
        ) {
          bg = "var(--green-l)";
          c = "var(--green)";
        } else if (
          k.includes("andamento") ||
          k.includes("execu") ||
          k.includes("transit")
        ) {
          bg = "var(--blue-l)";
          c = "var(--blue)";
        } else if (
          k.includes("pend") ||
          k.includes("aguard") ||
          k.includes("solicit") ||
          k.includes("aprova") ||
          k.includes("indicad") ||
          k.includes("program")
        ) {
          bg = "var(--yellow-l)";
          c = "var(--yellow)";
        } else if (k.includes("manut")) {
          bg = "var(--orange-l)";
          c = "var(--orange)";
        } else {
          bg = "var(--bg)";
          c = "var(--t2)";
        }
        return `<span class="bd" style="background:${bg};color:${c}"><span class="dot" style="background:${c}"></span>${s}</span>`;
      }
      function nav(id, el) {
        document
          .querySelectorAll(".sb-item")
          .forEach((n) => n.classList.remove("act"));
        document
          .querySelectorAll(".page")
          .forEach((p) => p.classList.remove("on"));
        el.classList.add("act");
        document.getElementById("page-" + id).classList.add("on");
      }
      function set(id, v) {
        const el = document.getElementById(id);
        if (el) el.textContent = v;
      }
      function html(id, v) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = v;
      }
      function setLoading(on, msg) {
        document.getElementById("ov").classList.toggle("on", on);
        if (msg) document.getElementById("ovLbl").textContent = msg;
      }
      function showAlert(type, html) {
        document.getElementById("alertArea").innerHTML =
          `<div class="alert al-${type}"><span>${type === "err" ? "âš ï¸" : "â„¹ï¸"}</span><div>${html}</div></div>`;
      }
      function clearAlerts() {
        document.getElementById("alertArea").innerHTML = "";
      }
      function emptyRow(n) {
        return `<tr><td colspan="${n}"><div class="empty"><div class="ei">ðŸ“­</div><div class="em-msg">Nenhum registro encontrado</div></div></td></tr>`;
      }

      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      // INIT
      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      detectEnv();
      loadAll();