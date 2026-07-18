import type { ReactNode } from "react";

import Form from "@rjsf/fluentui-rc";
import type { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";

const schema: RJSFSchema = {
  type: "object",
  required: ["server", "port", "password"],
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

    sni: {
      type: "string",
    },
    "client-fingerprint": {
      type: "string",
    },
    "skip-cert-verify": {
      type: "boolean",
    },

    alpn: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
};

export function EditAnytlsModal(): ReactNode {
  return <Form schema={schema} validator={validator} />;
}
