const isInWebview = typeof ClientChannel !== "undefined";

function ready() {
  if (isInWebview) {
    return ClientChannel?.postMessage("ready");
  }
  return Promise.resolve("not in webview");
}

export default {
  isInWebview,
  ready,
};
