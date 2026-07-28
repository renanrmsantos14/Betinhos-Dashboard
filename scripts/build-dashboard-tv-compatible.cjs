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
const xlsxPath = require.resolve("xlsx/dist/xlsx.full.min.js");
const xlsxRuntime = fs.readFileSync(xlsxPath, "utf8");
const xlsxRuntimeBase64 = Buffer.from(xlsxRuntime, "utf8").toString("base64");
const xlsxLoaderRuntime = `(function(){var binary=atob("${xlsxRuntimeBase64}"),bytes=Uint8Array.from(binary,function(char){return char.charCodeAt(0)}),script=document.createElement("script");script.id="dashboard-xlsx-runtime";script.text=new TextDecoder().decode(bytes);document.head.appendChild(script);}());`;
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
  /(<small\s+id="(?:appVersion|tvAppVersion|tvPinVersion)"[^>]*>)[\s\S]*?(<\/small>)/gi,
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

const minifiedOutput = sourceWithTvCompat.replace(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi, (_match, attributes, script) => {
  const transformed = esbuild.transformSync(script, {
    loader: "js",
    target: "es2016",
    minify: true,
    legalComments: "none"
  }).code.replace(/<\/script/gi, "<\\/script");
  return `<script${attributes}>${transformed}</script>`;
});
const output = minifiedOutput.replace(
  /<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/xlsx@0\.18\.5\/dist\/xlsx\.full\.min\.js"><\/script>/i,
  `<script id="dashboard-xlsx-loader">${xlsxLoaderRuntime}</script>`
);

if (output === minifiedOutput) throw new Error("Referência externa do XLSX ausente.");

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, output, "utf8");
console.log(`Dashboard TV gerado: ${path.relative(root, outputPath)}`);
