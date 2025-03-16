const isInWebview = !!ClientChannel;
function openHomeDir() {
  if (isInWebview) {
    return ClientChannel?.openHomeDir();
  }
  return Promise.resolve("not in webview");
}

function setAutoLaunch(isEnabled: boolean) {
  if (isInWebview) {
    if (isEnabled) {
      return ClientChannel?.enableAutoLaunch();
    } else {
      return ClientChannel?.disableAutoLaunch();
    }
  }
  return Promise.resolve("not in webview");
}

export default {
  openHomeDir,
  isInWebview,
  setAutoLaunch,
};
