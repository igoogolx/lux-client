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
import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import { ProxyTypeEnum, type Shadowsocks } from "lux-js-sdk";
import { useTranslation } from "react-i18next";

const schema: RJSFSchema = {
  type: "object",
  required: ["server", "port", "password", "cipher"],
  properties: {
    name: {
      type: "string",
    },
    server: {
      type: "string",
    },
    port: {
      type: "number",
    },
    password: {
      type: "string",
    },
    cipher: {
      type: "string",
      enum: ENCRYPTION_METHODS,
    },
    plugin: {
      type: "string",
      enum: SHADOWSOCKS_PLUINS,
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

const FIELD_TITLE_I18N_KEY: Record<string, string> = {
  name: TRANSLATION_KEY.FORM_NAME,
  server: TRANSLATION_KEY.FORM_SERVER,
  password: TRANSLATION_KEY.FORM_PASSWORD,
  port: TRANSLATION_KEY.FORM_PORT,
  "skip-cert-verify": TRANSLATION_KEY.SKIP_CERT_VERIFY,
};

export function EditShadowsocksModal(
  props: EditShadowsocksModalProps,
): ReactNode {
  const { initialValue, isSelected, onClose } = props;

  const { t } = useTranslation();

  const transFieldTitle = (key: string) => {
    if (key in FIELD_TITLE_I18N_KEY) {
      return t(FIELD_TITLE_I18N_KEY[key] as string);
    }
    return null;
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
      renderFieldTitle={transFieldTitle}
      isSelected={isSelected}
      mode={mode}
    />
  );
}
