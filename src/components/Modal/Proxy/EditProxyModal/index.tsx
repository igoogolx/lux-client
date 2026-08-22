import { type ReactNode, useState } from "react";

import { TRANSLATION_KEY } from "@/i18n/locales/key.ts";
import { proxiesSlice, type RootState } from "@/reducers";
import { formatFormSchema } from "@/utils/form.ts";
import { Button } from "@fluentui/react-components";
import type { FormProps } from "@rjsf/core";
import Form from "@rjsf/fluentui-rc";
import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { addProxy, type BaseProxy, updateProxy } from "lux-js-sdk";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";

export enum EDIT_PROXY_MODAL_MODE {
  EDIT,
  ADD,
}

type EditProxyModalProps<T> = {
  onClose: () => void;
  initialValue: T;
  isSelected?: boolean;
  schema: RJSFSchema;
  uiSchema: UiSchema;
  renderFieldTitle: (filedKey: string) => string | null;
  mode: EDIT_PROXY_MODAL_MODE;
};

export function EditProxyModal<T extends BaseProxy>(
  props: EditProxyModalProps<T>,
): ReactNode {
  const {
    initialValue,
    isSelected,
    onClose,
    schema,
    uiSchema,
    renderFieldTitle,
    mode,
  } = props;

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared,
  );

  const [formData, setFormData] = useState<T>(initialValue);

  const renderedSchema = formatFormSchema(schema, renderFieldTitle);

  const handleChange: FormProps["onChange"] = (e) => {
    setFormData(e.formData);
  };

  const handleSubmit: FormProps["onSubmit"] = async () => {
    if (mode === EDIT_PROXY_MODAL_MODE.EDIT) {
      await updateProxy({
        id: formData.id,
        proxy: formData,
      });
      dispatch(proxiesSlice.actions.updateOne({ proxy: formData }));
    } else {
      const { id } = await addProxy({
        proxy: formData,
      });
      dispatch(proxiesSlice.actions.addOne({ proxy: { ...formData, id } }));
    }
    onClose();
  };

  return (
    <Form
      autoComplete={"off"}
      schema={renderedSchema}
      validator={validator}
      uiSchema={uiSchema}
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
    >
      <div className={styles.buttonContainer}>
        <Button onClick={onClose} className={styles.button}>
          {t(TRANSLATION_KEY.FORM_CANCEL)}
        </Button>
        <Button
          className={styles.button}
          disabled={isSelected && isStarted}
          type={"submit"}
          appearance="primary"
        >
          {t(TRANSLATION_KEY.FORM_SAVE)}
        </Button>
      </div>
    </Form>
  );
}
