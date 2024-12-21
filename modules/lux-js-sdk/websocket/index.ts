import WsClient from "isomorphic-ws";

interface Params {
  onOpen?: () => void;
  onMessage?: (data: WsClient.Data) => void;
  onError?: (e: unknown) => void;
  onClose?: () => void;
}

export const createWebsocket = (url: string, params: Params): WsClient => {
  const ws = new WsClient(url);
  const { onOpen, onMessage, onClose, onError } = params;
  if (onOpen) {
    ws.onopen = onOpen;
  }
  if (onMessage) {
    ws.onmessage = (m) => {
      onMessage(m.data);
    };
  }
  if (onClose) {
    ws.onclose = onClose;
  }

  if (onError) {
    ws.onerror = onError;
  }
  return ws;
};
