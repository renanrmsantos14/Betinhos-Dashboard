const assert = require("assert");
const path = require("path");

const compat = require(path.resolve(__dirname, "..", "tv-compat.js"));

const tizenUa = "Mozilla/5.0 (SMART-TV; Linux; Tizen 4.0) AppleWebKit/538.1";
const q60rUa = "Mozilla/5.0 (SMART-TV; LINUX; Tizen 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Version/5.0 TV Safari/537.36";
const desktopUa = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36";

assert.strictEqual(compat.isTvUserAgent(tizenUa), true);
assert.strictEqual(compat.isTvUserAgent(q60rUa), true);
assert.strictEqual(compat.isTvUserAgent(desktopUa), false);
assert.strictEqual(compat.detectTizenVersion(q60rUa), "5.0");
assert.strictEqual(compat.detectTizenVersion(desktopUa), "");

const classes = new Set();
const fakeWindow = {
  navigator: { userAgent: tizenUa },
  CSS: { supports: () => false },
  document: {
    documentElement: { classList: { add: (...names) => names.forEach((name) => classes.add(name)) } },
    body: null,
    createElement: () => ({ style: {}, appendChild() {}, scrollHeight: 0 }),
  },
};

assert.strictEqual(compat.install(fakeWindow), true);
assert.strictEqual(fakeWindow.__DASHBOARD_TV_MODE, true);
assert(classes.has("tv-browser"));
assert(classes.has("tv-no-grid"));
assert(classes.has("tv-no-inset"));
assert(classes.has("tv-no-flex-gap"));
assert(classes.has("tv-no-has"));
assert(classes.has("tv-no-container"));
assert.strictEqual(fakeWindow.__DASHBOARD_TIZEN_VERSION, "4.0");

console.log("Dashboard TV: deteccao e classes de compatibilidade validadas.");
