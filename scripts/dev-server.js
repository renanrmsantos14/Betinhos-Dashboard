const fs = require("fs");
const http = require("http");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const tvPreview = process.argv.includes("--tv");
if (tvPreview) require("./build-dashboard-tv-compatible.cjs");
const defaultFile = tvPreview
  ? path.join(repoRoot, "dist", "Dashboard.html")
  : path.join(repoRoot, "Dashboard.html");
const snapshotFile = path.join(repoRoot, "data", "dashboard-prod-snapshot.json");
const host = "127.0.0.1";
const requestedPort = Number(process.env.PORT || 0);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};

function resolveFilePath(urlPathname) {
  if (urlPathname === "/" || urlPathname === "/index.html") {
    return defaultFile;
  }

  const trimmedPath = urlPathname.replace(/^\/+/, "");
  const candidate = path.resolve(repoRoot, trimmedPath);
  if (!candidate.startsWith(repoRoot)) {
    return null;
  }

  return candidate;
}

const server = http.createServer((request, response) => {
  const currentUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`);

  if (currentUrl.pathname === "/demo") {
    response.writeHead(302, { Location: "/?mock=1&demo=1" });
    response.end();
    return;
  }

  const filePath = resolveFilePath(currentUrl.pathname);

  if (!filePath) {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Caminho invalido.");
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Arquivo nao encontrado.");
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extension] || "application/octet-stream";

  response.writeHead(200, {
    "Cache-Control": "no-store",
    "Content-Type": contentType,
  });

  fs.createReadStream(filePath).pipe(response);
});

server.listen(requestedPort, host, () => {
  const address = server.address();
  const hasSnapshot = fs.existsSync(snapshotFile);
  const query = tvPreview
    ? (hasSnapshot ? "?snapshot=1&tv=1" : "?mock=1&tv=1")
    : (hasSnapshot ? "?snapshot=1" : "?mock=1");
  const mode = tvPreview ? "TV/Tizen legado" : "desktop";
  const dataMode = hasSnapshot ? "snapshot PROD" : "mock";
  console.log(`[dev] Dashboard ${mode} (${dataMode}): http://localhost:${address.port}/${query}`);
  console.log(`[demo] Simulacao de marketing: http://localhost:${address.port}/demo`);
});
