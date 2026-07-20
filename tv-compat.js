(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.DashboardTvCompat = api;
})(typeof window !== "undefined" ? window : null, function () {
  function isTvUserAgent(userAgent) {
    return /SMART-TV|SmartTV|Tizen|SmartHub|Maple|HbbTV|NetCast|Web0S|WebTV/i.test(String(userAgent || ""));
  }

  function supportsCss(targetWindow, property, value) {
    return Boolean(
      targetWindow.CSS &&
      typeof targetWindow.CSS.supports === "function" &&
      targetWindow.CSS.supports(property, value)
    );
  }

  function supportsFlexGap(targetWindow) {
    var documentRef = targetWindow.document;
    if (!documentRef || !documentRef.body || typeof documentRef.createElement !== "function") return false;
    var flex = documentRef.createElement("div");
    var first = documentRef.createElement("div");
    var second = documentRef.createElement("div");
    flex.style.display = "flex";
    flex.style.flexDirection = "column";
    flex.style.rowGap = "1px";
    flex.style.position = "absolute";
    flex.style.visibility = "hidden";
    flex.appendChild(first);
    flex.appendChild(second);
    documentRef.body.appendChild(flex);
    var supported = flex.scrollHeight === 1;
    documentRef.body.removeChild(flex);
    return supported;
  }

  function install(targetWindow) {
    if (!targetWindow || !isTvUserAgent(targetWindow.navigator && targetWindow.navigator.userAgent)) return false;
    var rootElement = targetWindow.document && targetWindow.document.documentElement;
    if (!rootElement || !rootElement.classList) return false;
    rootElement.classList.add("tv-browser");
    if (!supportsCss(targetWindow, "display", "grid")) rootElement.classList.add("tv-no-grid");
    if (!supportsCss(targetWindow, "inset", "0")) rootElement.classList.add("tv-no-inset");
    if (!supportsFlexGap(targetWindow)) rootElement.classList.add("tv-no-flex-gap");
    targetWindow.__DASHBOARD_TV_MODE = true;
    return true;
  }

  return { install: install, isTvUserAgent: isTvUserAgent };
});
