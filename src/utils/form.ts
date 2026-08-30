import type { RJSFSchema } from "@rjsf/utils";
import get from "lodash/get";
import omitBy from "lodash/omitBy";
import set from "lodash/set";

export function formatFormSchema(
  schema: RJSFSchema,
  t: (key: string) => string | null,
) {
  const newSchema = { ...schema };
  const newProperties = { ...newSchema.properties };

  for (const newPropertiesKey in newProperties) {
    if (typeof newProperties[newPropertiesKey] !== "object") {
      continue;
    }

    const newTitle = t(newPropertiesKey);

    if (newTitle === null) {
      continue;
    }
    newProperties[newPropertiesKey] = {
      ...newProperties[newPropertiesKey],
      title: newTitle,
    };
  }
  newSchema.properties = newProperties;

  return newSchema;
}

export function formatSchemaMapStringField(
  formData: Record<string, never>,
  keyPath: string[] | string,
) {
  const field = get(formData, keyPath);
  if (typeof field !== "object") {
    return formData;
  }
  const newField = omitBy(field, (_, key) => {
    return key.trim().length === 0;
  });

  const newFormData = JSON.parse(JSON.stringify(formData));

  set(newFormData, keyPath, newField);
  return newFormData;
}
