import type { ReactNode } from "react";

import Form from "@rjsf/fluentui-rc";
import type { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";

const schema: RJSFSchema = {
  title: "Test form",
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    age: {
      type: "number",
    },
  },
};

export function EditAnytlsModal(): ReactNode {
  return <Form schema={schema} validator={validator} />;
}
