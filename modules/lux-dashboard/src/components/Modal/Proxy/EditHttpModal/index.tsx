import React from "react";
import { Field, Form } from "@/components/Core";
import { useDispatch, useSelector } from "react-redux";
import { proxiesSlice, RootState } from "@/reducers";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import * as Yup from "yup";
import { MAX_PORT, MIN_PORT } from "@/utils/validator";
import { addProxy, ProxyTypeEnum, Http, updateProxy } from "lux-js-sdk";
import { Button } from "@fluentui/react-components";
import styles from "./index.module.css";

type EditHttpModalProps = {
  close: () => void;
  initialValue?: Http;
  isSelected?: boolean;
};

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

export function EditHttpModal(props: EditHttpModalProps) {
  const { t } = useTranslation();
  const { close, initialValue, isSelected } = props;
  const dispatch = useDispatch();
  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared
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
      initialValues={initialValue || INIT_DATA}
      validationSchema={HttpSchema}
    >
      {({ dirty, submitForm }) => {
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
              label={`${t(TRANSLATION_KEY.FORM_PASSWORD)}(${t(
                TRANSLATION_KEY.FORM_OPTIONAL
              )})`}
            />
            <Field<keyof Http>
              name="password"
              label={`${t(TRANSLATION_KEY.FORM_USERNAME)}(${t(
                TRANSLATION_KEY.FORM_OPTIONAL
              )})`}
            />
            <div className={styles.buttonContainer}>
              <Button onClick={close} className={styles.button}>
                {t(TRANSLATION_KEY.FORM_CANCEL)}
              </Button>
              <Button
                className={styles.button}
                disabled={!dirty || (isSelected && isStarted)}
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
