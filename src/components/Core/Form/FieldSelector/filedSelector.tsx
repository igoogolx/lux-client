import { Button, Dropdown, Field, Option } from "@fluentui/react-components";
import { EditRegular } from "@fluentui/react-icons";
import { useField } from "formik";
import * as React from "react";
import { useMemo } from "react";
import { type MenuItemProps } from "../../Menu";
import styles from "./index.module.css";

interface FieldSelectorProps<T extends string> {
  name: T;
  className?: string;
  label: string;
  items: MenuItemProps[];
  clearable?: boolean;
  editable?: boolean;
  onEditClick?: () => void;
  // TODO: remove
  value?: string;
}

export function FiledSelector<T extends string>(
  props: Readonly<FieldSelectorProps<T>>,
): React.ReactNode {
  const {
    name,
    label,
    items,
    clearable = false,
    editable = false,
    onEditClick,
    value,
    className,
  } = props;
  const [field, meta, helpers] = useField({ name });
  const { setValue } = helpers;

  const currentSelectedOption = useMemo(() => {
    return items.find((item) =>
      value ? item.id === value : item.id === field.value,
    );
  }, [field.value, items, value]);

  return (
    <Field
      label={label}
      validationMessage={meta.touched && meta.error ? meta.error : null}
      className={className}
    >
      <div className={styles.container}>
        <Dropdown
          value={(currentSelectedOption?.content as string) || ""}
          onOptionSelect={(e, data) => {
            if (clearable && data.optionValue === field.value) {
              setValue("");
              return;
            }
            setValue(data.optionValue);
          }}
          disabled={editable}
          className={styles.left}
        >
          {items.map((item) => (
            <Option
              key={item.id}
              value={item.id.toString()}
              text={item.content as string}
            >
              {item.content as string}
            </Option>
          ))}
        </Dropdown>
        {editable && (
          <Button
            icon={<EditRegular />}
            onClick={onEditClick}
            className={styles.right}
          />
        )}
      </div>
    </Field>
  );
}
