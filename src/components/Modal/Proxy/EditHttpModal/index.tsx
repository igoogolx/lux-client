import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { proxiesSlice, type RootState } from "@/reducers";
import { MAX_PORT, MIN_PORT } from "@/utils/validator";
import { Button } from "@fluentui/react-components";
import { addProxy, type Http, ProxyTypeEnum, updateProxy } from "lux-js-sdk";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Field, Form, PasswordFiled } from "../../../Core";
import styles from "./index.module.css";

interface EditHttpModalProps {
  close: () => void;
  initialValue?: Http;
  isSelected?: boolean;
}

const INIT_DATA: Http = {
  type: ProxyTypeEnum.Http,
  server: "",
  id: "",
  name: "",
  port: 1080,
  password: "",
  username: "",
};

const HttpSchema = Yup.object().shape({
  name: Yup.string(),
  server: Yup.string().required("Required"),
  port: Yup.number().min(MIN_PORT).max(MAX_PORT).required("Required"),
  username: Yup.string(),
  password: Yup.string(),
});

export function EditHttpModal(props: Readonly<EditHttpModalProps>) {
  const { t } = useTranslation();
  const { close, initialValue, isSelected } = props;
  const dispatch = useDispatch();
  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared,
  );
  const onSubmit = async (data: Http) => {
    if (initialValue) {
      await updateProxy({
        id: data.id,
        proxy: data,
      });
      dispatch(proxiesSlice.actions.updateOne({ proxy: data }));
    } else {
      const { id } = await addProxy({
        proxy: data,
      });
      dispatch(proxiesSlice.actions.addOne({ proxy: { ...data, id } }));
    }
    close();
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValue ?? INIT_DATA}
      validationSchema={HttpSchema}
    >
      {({ isValid, submitForm }) => {
        return (
          <>
            <Field<keyof Http>
              name="name"
              label={t(TRANSLATION_KEY.FORM_NAME)}
            />
            <Field<keyof Http>
              name="server"
              label={t(TRANSLATION_KEY.FORM_SERVER)}
            />
            <Field<keyof Http>
              name="port"
              label={t(TRANSLATION_KEY.FORM_PORT)}
              type="number"
            />
            <Field<keyof Http>
              name="username"
              label={`${t(TRANSLATION_KEY.FORM_USERNAME)}(${t(
                TRANSLATION_KEY.FORM_OPTIONAL,
              )})`}
            />
            <PasswordFiled<keyof Http>
              name="password"
              label={`${t(TRANSLATION_KEY.FORM_PASSWORD)}(${t(
                TRANSLATION_KEY.FORM_OPTIONAL,
              )})`}
            />
            <div className={styles.buttonContainer}>
              <Button onClick={close} className={styles.button}>
                {t(TRANSLATION_KEY.FORM_CANCEL)}
              </Button>
              <Button
                className={styles.button}
                disabled={!isValid || (isSelected && isStarted)}
                onClick={submitForm}
                appearance="primary"
              >
                {t(TRANSLATION_KEY.FORM_SAVE)}
              </Button>
            </div>
          </>
        );
      }}
    </Form>
  );
}
