import {
  Field as FluentInput,
  type InputProps,
  Textarea,
} from "@fluentui/react-components";
import { useField } from "formik";
import React from "react";

export interface TextareaFieldProps<T extends string> {
  name: T;
  validate?: (value: string) => string;
  label?: string;
  type?: InputProps["type"];
  adornment?: InputProps["contentBefore"];
  disabled?: boolean;
  className?: string;
}

export function TextareaField<T extends string>(
  props: Readonly<TextareaFieldProps<T>>,
) {
  const { name, label, validate, disabled = false, className } = props;
  const [field, meta] = useField({ name, validate });
  return (
    <FluentInput
      label={label}
      validationMessage={meta.error && meta.touched ? meta.error : null}
      className={className}
      spellCheck={false}
    >
      <Textarea {...field} disabled={disabled} />
    </FluentInput>
  );
}
