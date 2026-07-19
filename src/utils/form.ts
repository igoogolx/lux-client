import type { RJSFSchema } from "@rjsf/utils";

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
