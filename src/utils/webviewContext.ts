const isInWebview = typeof ClientChannel !== "undefined";
function openHomeDir() {
  if (isInWebview) {
    return ClientChannel?.postMessage("openHomeDir");
  }
  return Promise.resolve("not in webview");
}

function setAutoLaunch(isEnabled: boolean) {
  if (isInWebview) {
    if (isEnabled) {
      return ClientChannel?.postMessage("enableAutoLaunch");
    } else {
      return ClientChannel?.postMessage("disableAutoLaunch");
    }
  }
  return Promise.resolve("not in webview");
}

function ready() {
  if (isInWebview) {
    return ClientChannel?.postMessage("ready");
  }
  return Promise.resolve("not in webview");
}

function openWebDashboard() {
  if (isInWebview) {
    return ClientChannel?.postMessage("openWebDashboard");
  }
  return Promise.resolve("not in webview");
}

export default {
  openHomeDir,
  isInWebview,
  setAutoLaunch,
  openWebDashboard,
  ready,
};
