import { type ReactNode } from "react";

import { PasswordWidget } from "@/components/Core";
import {
  EDIT_PROXY_MODAL_MODE,
  EditProxyModal,
} from "@/components/Modal/Proxy/EditProxyModal";
import {
  ENCRYPTION_METHODS,
  SHADOWSOCKS_PLUGIN,
  SHADOWSOCKS_PLUGIN_MODE,
  SHADOWSOCKS_PLUINS,
} from "@/components/Modal/Proxy/EditShadowsocksModal/constant.ts";
import { TRANSLATION_KEY } from "@/i18n/locales/key.ts";
import { formatSchemaMapStringField } from "@/utils/form.ts";
import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import { ProxyTypeEnum, type Shadowsocks } from "lux-js-sdk";

const schema: RJSFSchema = {
  type: "object",
  required: ["server", "port", "password", "cipher"],
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
    cipher: {
      type: "string",
      enum: ENCRYPTION_METHODS,
      title: TRANSLATION_KEY.FORM_ENCRYPTION,
    },
    "udp-over-tcp": {
      type: "boolean",
      title: TRANSLATION_KEY.FORM_UDP_OVER_TCP,
    },
    "udp-over-tcp-version": {
      type: "number",
      title: TRANSLATION_KEY.FORM_UDP_OVER_TCP_VERSION,
    },
    "client-fingerprint": {
      type: "string",
      title: TRANSLATION_KEY.FORM_CLIENT_FINGERPRINT,
    },
    plugin: {
      type: "string",
      enum: SHADOWSOCKS_PLUINS,
      title: TRANSLATION_KEY.FORM_PLUGIN,
    },
  },
  allOf: [
    {
      if: {
        properties: {
          plugin: {
            const: SHADOWSOCKS_PLUGIN.OBFS,
          },
        },
      },
      then: {
        properties: {
          "plugin-opts": {
            type: "object",
            title: TRANSLATION_KEY.FORM_PLUGIN_OPTS,
            required: ["mode"],
            properties: {
              mode: {
                type: "string",
                enum: [
                  SHADOWSOCKS_PLUGIN_MODE.HTTP,
                  SHADOWSOCKS_PLUGIN_MODE.TLS,
                ],
              },
              host: {
                type: "string",
              },
            },
          },
        },
      },
    },
    {
      if: {
        properties: {
          plugin: {
            const: SHADOWSOCKS_PLUGIN.V2RAY,
          },
        },
      },
      then: {
        properties: {
          "plugin-opts": {
            required: ["mode"],

            type: "object",
            properties: {
              mode: {
                type: "string",
                enum: [SHADOWSOCKS_PLUGIN_MODE.WEBSOCKET],
              },
              host: {
                type: "string",
              },
              path: {
                type: "string",
              },
              tls: {
                type: "boolean",
              },
              "skip-cert-verify": {
                type: "boolean",
              },
              mux: {
                type: "boolean",
              },
              headers: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  ],
};

const uiSchema: UiSchema = {
  password: {
    "ui:widget": PasswordWidget,
    "ui:autocomplete": "off",
  },
};

type EditShadowsocksModalProps = {
  onClose: () => void;
  initialValue?: Shadowsocks;
  isSelected?: boolean;
};

const INIT_DATA: Shadowsocks = {
  type: ProxyTypeEnum.Shadowsocks,
  id: "",
  name: "",
  server: "",
  password: "",
  port: 1080,
  cipher: ENCRYPTION_METHODS[0] as Shadowsocks["cipher"],
};

export function EditShadowsocksModal(
  props: EditShadowsocksModalProps,
): ReactNode {
  const { initialValue, isSelected, onClose } = props;

  const formatFormData = (formData: Record<string, never>) => {
    if (formData["plugin"] === SHADOWSOCKS_PLUGIN.V2RAY) {
      return formatSchemaMapStringField(formData, "plugin-opts.headers");
    }

    return formData;
  };

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
      formatFormData={formatFormData}
    />
  );
}
