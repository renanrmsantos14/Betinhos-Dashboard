const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "Dashboard.html");
const outputDir = path.join(root, "dist");
const outputPath = path.join(outputDir, "Dashboard.html");
const buildInfoPath = path.join(root, "build-info.json");
const tvCompatPath = path.join(root, "tv-compat.js");
const resizeObserverPath = path.join(
  path.dirname(require.resolve("resize-observer-polyfill")),
  "ResizeObserver.global.js"
);
const chartPath = path.join(path.dirname(require.resolve("chart.js")), "chart.umd.js");
const chartDataLabelsPath = require.resolve("chartjs-plugin-datalabels");
const source = fs.readFileSync(sourcePath, "utf8");
const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, "utf8"));
const resizeObserverRuntime = `if(typeof window.ResizeObserver!=="function"){${fs.readFileSync(resizeObserverPath, "utf8")}}`;
const chartRuntime = [
  resizeObserverRuntime,
  fs.readFileSync(chartPath, "utf8"),
  fs.readFileSync(chartDataLabelsPath, "utf8")
]
  .join("\n")
  .replace(/<\/script/gi, "<\\/script");
const sourceWithBuildInfo = source.replace(
  /<script id="dashboard-build-info">[\s\S]*?<\/script>/i,
  `<script id="dashboard-build-info">window.__DASHBOARD_BUILD_INFO=${JSON.stringify(buildInfo)};</script>`
);

if (sourceWithBuildInfo === source) throw new Error("Placeholder dashboard-build-info ausente.");

const sourceWithVersion = sourceWithBuildInfo.replace(
  /(<small\s+id="appVersion"[^>]*>)[\s\S]*?(<\/small>)/i,
  (_match, openingTag, closingTag) => `${openingTag}${buildInfo.label}${closingTag}`
);

if (sourceWithVersion === sourceWithBuildInfo) throw new Error("Elemento appVersion ausente.");

const sourceWithChartRuntime = sourceWithVersion.replace(
  /<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/Chart\.js\/[^\"]+"><\/script>\s*<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/chartjs-plugin-datalabels@[^\"]+"><\/script>/i,
  `<script id="dashboard-chart-runtime">${chartRuntime}</script>`
);

if (sourceWithChartRuntime === sourceWithVersion) throw new Error("Referencias externas do Chart.js ausentes.");

const sourceWithTvCompat = sourceWithChartRuntime.replace(
  /<script src="tv-compat\.js"><\/script>/i,
  `<script id="dashboard-tv-compat">${fs.readFileSync(tvCompatPath, "utf8").replace(/<\/script/gi, "<\\/script")}</script>`
);

if (sourceWithTvCompat === sourceWithChartRuntime) throw new Error("Referencia local tv-compat.js ausente.");

const output = sourceWithTvCompat.replace(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi, (_match, attributes, script) => {
  const transformed = esbuild.transformSync(script, {
    loader: "js",
    target: "es2016",
    minify: true,
    legalComments: "none"
  }).code.replace(/<\/script/gi, "<\\/script");
  return `<script${attributes}>${transformed}</script>`;
});

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, output, "utf8");
console.log(`Dashboard TV gerado: ${path.relative(root, outputPath)}`);
