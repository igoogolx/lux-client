import { Button, Field, Input } from "@fluentui/react-components";
import { EyeOffRegular, EyeRegular } from "@fluentui/react-icons";
import type { WidgetProps } from "@rjsf/utils";
import { useState } from "react";

export function PasswordWidget(props: WidgetProps) {
  const { label, required } = props;
  const [isShowPassword, setIsShowPassword] = useState(false);

  return (
    <Field label={label} required={required}>
      <Input
        type={isShowPassword ? "text" : "password"}
        contentAfter={
          <Button
            onClick={() => {
              setIsShowPassword(!isShowPassword);
            }}
            appearance="transparent"
            size="small"
            icon={isShowPassword ? <EyeRegular /> : <EyeOffRegular />}
          />
        }
        value={props.value}
        required={props.required}
        onChange={(event) => props.onChange(event.target.value)}
      />
    </Field>
  );
}
