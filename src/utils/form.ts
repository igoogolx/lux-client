import type { RJSFSchema } from "@rjsf/utils";
import {
  get,
  isArray,
  isObject,
  isPlainObject,
  map,
  mapValues,
  omitBy,
  set,
} from "lodash";

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

type MapValuesFn = (value: unknown, key?: string | number) => unknown;

const mapValuesDeep = (
  obj: Parameters<typeof mapValues>[number],
  fn: MapValuesFn,
  key?: string | number,
): unknown => {
  if (isArray(obj)) {
    return map(obj, (innerObj, idx) => mapValuesDeep(innerObj, fn, idx));
  }

  if (isPlainObject(obj)) {
    return mapValues(obj, (val, key) => mapValuesDeep(val, fn, key));
  }

  if (isObject(obj)) {
    return obj;
  }

  return fn(obj, key);
};

export function translateSchemaFieldTitle(
  formData: Parameters<typeof mapValues>[number],
  t: (key: string) => string,
) {
  return mapValuesDeep(formData, (value, key) => {
    if (key === "title" && typeof value === "string") {
      return t(value);
    }

    return value;
  });
}
