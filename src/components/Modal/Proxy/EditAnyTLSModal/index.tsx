import { type ReactNode } from "react";

import { PasswordWidget } from "@/components/Core";
import {
  EDIT_PROXY_MODAL_MODE,
  EditProxyModal,
} from "@/components/Modal/Proxy/EditProxyModal";
import { TRANSLATION_KEY } from "@/i18n/locales/key.ts";
import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import { type Anytls, ProxyTypeEnum } from "lux-js-sdk";

const schema: RJSFSchema = {
  type: "object",
  required: ["server", "port", "password"],
  properties: {
    name: {
      type: "string",
      title: TRANSLATION_KEY.FORM_NAME,
    },
    server: {
      type: "string",
      title: TRANSLATION_KEY.FORM_SERVER,
    },
    port: {
      type: "number",
      title: TRANSLATION_KEY.FORM_PORT,
    },
    password: {
      type: "string",
      title: TRANSLATION_KEY.FORM_PASSWORD,
    },
    sni: {
      type: "string",
      title: TRANSLATION_KEY.FORM_SNI,
    },
    udp: {
      type: "boolean",
      title: TRANSLATION_KEY.FORM_UDP,
    },
    "client-fingerprint": {
      type: "string",
      title: TRANSLATION_KEY.FORM_CLIENT_FINGERPRINT,
    },
    fingerprint: {
      type: "string",
      title: TRANSLATION_KEY.FORM_FINGERPRINT,
    },
    certificate: {
      type: "string",
      title: TRANSLATION_KEY.FORM_CERTIFICATE,
    },
    "private-key": {
      type: "string",
      title: TRANSLATION_KEY.FORM_PRIVATE_KEY,
    },
    "idle-session-check-interval": {
      type: "number",
      title: TRANSLATION_KEY.FORM_IDLE_SESSION_CHECK_INTERVAL,
    },
    "idle-session-timeout": {
      type: "number",
      title: TRANSLATION_KEY.FORM_IDLE_SESSION_TIMEOUT,
    },
    "min-idle-session": {
      type: "number",
      title: TRANSLATION_KEY.FORM_MIN_IDLE_SESSION,
    },
    "skip-cert-verify": {
      type: "boolean",
      title: TRANSLATION_KEY.SKIP_CERT_VERIFY,
    },

    alpn: {
      type: "array",
      title: TRANSLATION_KEY.FORM_ALPN,
      items: {
        type: "string",
      },
    },
  },
};

const uiSchema: UiSchema = {
  password: {
    "ui:widget": PasswordWidget,
    "ui:autocomplete": "off",
  },
};

type EditAnytlsModalProps = {
  onClose: () => void;
  initialValue?: Anytls;
  isSelected?: boolean;
};

const INIT_DATA: Anytls = {
  type: ProxyTypeEnum.Anytls,
  id: "",
  name: "",
  server: "",
  password: "",
  port: 1080,
};

export function EditAnyTLSModal(props: EditAnytlsModalProps): ReactNode {
  const { initialValue, isSelected, onClose } = props;

  const mode = initialValue
    ? EDIT_PROXY_MODAL_MODE.EDIT
    : EDIT_PROXY_MODAL_MODE.ADD;

  return (
    <EditProxyModal
      onClose={onClose}
      initialValue={initialValue || INIT_DATA}
      schema={schema}
      uiSchema={uiSchema}
      isSelected={isSelected}
      mode={mode}
    />
  );
}
