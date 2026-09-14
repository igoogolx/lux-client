import { TRANSLATION_KEY } from "@/i18n/locales/key.ts";
import type { RJSFSchema } from "@rjsf/utils";

export const SHADOW_TLS_OPTIONS: RJSFSchema = {
  type: "object",
  title: TRANSLATION_KEY.SHADOW_TLS_OPTIONS,
  properties: {
    password: {
      type: "string",
      title: TRANSLATION_KEY.FORM_PASSWORD,
    },
    version: {
      type: "number",
      title: TRANSLATION_KEY.VERSION,
    },
  },
};

export const RESTLS_OPTS: RJSFSchema = {
  type: "object",
  title: TRANSLATION_KEY.RESTLS_OPTIONS,
  properties: {
    password: {
      type: "string",
      title: TRANSLATION_KEY.FORM_PASSWORD,
    },
    "version-hint": {
      type: "string",
      title: TRANSLATION_KEY.VERSION_HINT,
    },
    "restls-script": {
      type: "string",
      title: TRANSLATION_KEY.RESTLS_SCRIPT,
    },
  },
};

export const JLS_OPTS: RJSFSchema = {
  type: "object",
  title: TRANSLATION_KEY.JLS_OPTS,
  properties: {
    username: {
      type: "string",
      title: TRANSLATION_KEY.FORM_USERNAME,
    },
    password: {
      type: "string",
      title: TRANSLATION_KEY.FORM_PASSWORD,
    },
  },
};
