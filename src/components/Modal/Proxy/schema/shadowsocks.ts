import {
  SHADOWSOCKS_ENCRYPTION_METHODS,
  SHADOWSOCKS_PLUGIN,
  SHADOWSOCKS_PLUGIN_MODE,
  SHADOWSOCKS_PLUGINS,
} from "@/components/Modal/Proxy/schema/constant.ts";
import { TRANSLATION_KEY } from "@/i18n/locales/key.ts";
import type { RJSFSchema } from "@rjsf/utils";

export const SHADOWSOCKS_SCHEMA: RJSFSchema = {
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
      enum: SHADOWSOCKS_ENCRYPTION_METHODS,
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
      enum: SHADOWSOCKS_PLUGINS,
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
