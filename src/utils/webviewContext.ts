const isInWebview = !!window?.flutter_inappwebview;
function open(filePath: string) {
  if (isInWebview) {
    const formatedPath = `file://${filePath}`;
    return window.flutter_inappwebview?.callHandler("open", formatedPath);
  }
  return Promise.resolve("not in webview");
}

export default {
  open,
  isInWebview,
};
