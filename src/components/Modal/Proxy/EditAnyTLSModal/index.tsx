import { type ReactNode, useState } from "react";

import { PasswordWidget } from "@/components/Core";
import { TRANSLATION_KEY } from "@/i18n/locales/key.ts";
import { proxiesSlice, type RootState } from "@/reducers";
import { formatFormSchema } from "@/utils/form.ts";
import { Button } from "@fluentui/react-components";
import type { FormProps } from "@rjsf/core";
import Form from "@rjsf/fluentui-rc";
import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { addProxy, type Anytls, ProxyTypeEnum, updateProxy } from "lux-js-sdk";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";

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
    fingerprint: {
      type: "string",
    },
    certificate: {
      type: "string",
    },
    "private-key": {
      type: "string",
    },
    "idle-session-check-interval": {
      type: "number",
    },
    "idle-session-timeout": {
      type: "number",
    },
    "min-idle-session": {
      type: "number",
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

const uiSchema: UiSchema = {
  password: {
    "ui:widget": PasswordWidget,
    "ui:autocomplete": "off",
  },
};

type EditAnytlsModalProps = {
  onClose: () => void;
  initialValue?: Anytls;
  isSelected?: boolean;
};

const INIT_DATA: Anytls = {
  type: ProxyTypeEnum.Anytls,
  id: "",
  name: "",
  server: "",
  password: "",
  port: 1080,
};

const FIELD_TITLE_I18N_KEY: Record<string, string> = {
  name: TRANSLATION_KEY.FORM_NAME,
  server: TRANSLATION_KEY.FORM_SERVER,
  password: TRANSLATION_KEY.FORM_PASSWORD,
  port: TRANSLATION_KEY.FORM_PORT,
  sni: TRANSLATION_KEY.FORM_SNI,
  "client-fingerprint": TRANSLATION_KEY.FORM_CLIENT_FINGERPRINT,
  fingerprint: TRANSLATION_KEY.FORM_FINGERPRINT,
  certificate: TRANSLATION_KEY.FORM_CERTIFICATE,
  "private-key": TRANSLATION_KEY.FORM_PRIVATE_KEY,
  "idle-session-check-interval":
    TRANSLATION_KEY.FORM_IDLE_SESSION_CHECK_INTERVAL,
  "idle-session-timeout": TRANSLATION_KEY.FORM_IDLE_SESSION_TIMEOUT,
  "min-idle-session": TRANSLATION_KEY.FORM_MIN_IDLE_SESSION,
  "skip-cert-verify": TRANSLATION_KEY.SKIP_CERT_VERIFY,
  alpn: TRANSLATION_KEY.FORM_ALPN,
};

export function EditAnyTLSModal(props: EditAnytlsModalProps): ReactNode {
  const { initialValue, isSelected, onClose } = props;

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared,
  );

  const [formData, setFormData] = useState<Anytls>(initialValue || INIT_DATA);

  const transFieldTitle = (key: string) => {
    if (key in FIELD_TITLE_I18N_KEY) {
      return t(FIELD_TITLE_I18N_KEY[key] as string);
    }
    return null;
  };

  const renderedSchema = formatFormSchema(schema, transFieldTitle);

  const handleChange: FormProps["onChange"] = (e) => {
    setFormData(e.formData);
  };

  const handleSubmit: FormProps["onSubmit"] = async () => {
    if (initialValue) {
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
    close();
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
