import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { proxiesSlice, RootState } from "@/reducers";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { Field, FiledSelector, Form, PasswordFiled } from "@/components/Core";
import { addProxy, ProxyTypeEnum, Shadowsocks, updateProxy } from "lux-js-sdk";
import { Button } from "@fluentui/react-components";
import { EditPlugin } from "@/components/Modal/Proxy/Plugin";
import { ShadowsocksSchema } from "./validate";
import {
  ENCRYPTION_METHODS,
  NONE_ID,
  PageStepEnum,
  SHADOWSOCKS_PLUINS,
} from "./constant";
import styles from "./index.module.css";

type EditShadowsocksModalProps = {
  close: () => void;
  initialValue?: Shadowsocks;
  isSelected?: boolean;
  setPageStep?: (step: PageStepEnum) => void;
};

const INIT_DATA: Shadowsocks = {
  type: ProxyTypeEnum.Shadowsocks,
  id: "",
  name: "",
  server: "",
  password: "",
  port: 1080,
  cipher: ENCRYPTION_METHODS[0],
};

export const EditShadowsocksModal = React.memo(
  (props: EditShadowsocksModalProps) => {
    const { close, initialValue, isSelected = false, setPageStep } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const methodsOptions = useRef(
      ENCRYPTION_METHODS.map((METHOD) => ({ content: METHOD, id: METHOD }))
    );

    const pluginOptions = useRef(
      [...SHADOWSOCKS_PLUINS, NONE_ID].map((METHOD) => ({
        content: METHOD,
        id: METHOD,
      }))
    );

    const isStarted = useSelector<RootState, boolean>(
      (state) => state.manager.isStared
    );

    const [editingPlugin, setEditingPlugin] = useState(false);
    const [isPluginDirty, setIsPluginDirty] = useState(false);

    const initData = initialValue || INIT_DATA;

    const initPlugin = {
      plugin: initData.plugin,
      "plugin-opts": initData["plugin-opts"],
    };

    const [pluginData, setPluginData] =
      useState<Partial<typeof initPlugin>>(initPlugin);

    const onSubmit = async (value: Shadowsocks) => {
      if (initialValue) {
        await updateProxy({
          id: value.id,
          proxy: { ...value },
        });
        dispatch(proxiesSlice.actions.updateOne({ proxy: {...value,...pluginData} }));
      } else {
        const { id } = await addProxy({
          proxy: { ...value },
        });
        dispatch(proxiesSlice.actions.addOne({ proxy: { ...value,...pluginData, id } }));
      }
      close();
    };

    return editingPlugin ? (
      <EditPlugin
        type={pluginData.plugin}
        initialValue={pluginData}
        onSave={(data) => {
          setIsPluginDirty(true)
          setPluginData(data);
        }}
        close={() => {
          setEditingPlugin(false);
          if (setPageStep) {
            setPageStep(PageStepEnum.First);
          }
        }}
      />
    ) : (
      <Form
        validationSchema={ShadowsocksSchema}
        initialValues={initData}
        onSubmit={onSubmit}
      >
        {({ dirty, submitForm, isValid, submitCount }) => {
          return (
            <div className={styles.container}>
              <Field name="name" label={t(TRANSLATION_KEY.FORM_NAME)} />
              <Field name="server" label={t(TRANSLATION_KEY.FORM_SERVER)} />
              <FiledSelector
                name="cipher"
                items={methodsOptions.current}
                label={t(TRANSLATION_KEY.FORM_ENCRYPTION)}
              />
              <Field
                name="port"
                label={t(TRANSLATION_KEY.FORM_PORT)}
                type="number"
              />
              <PasswordFiled
                name="password"
                label={t(TRANSLATION_KEY.FORM_PASSWORD)}
              />
              <FiledSelector
                clearable
                value={pluginData.plugin}
                name="plugin"
                items={pluginOptions.current}
                label={`${t(TRANSLATION_KEY.FORM_PLUGIN)}(${t(
                  TRANSLATION_KEY.FORM_OPTIONAL
                )})`}
                editable
                onEditClick={() => {
                  setEditingPlugin(true);
                  if (setPageStep) {
                    setPageStep(PageStepEnum.Second);
                  }
                }}
              />
              <div className={styles.buttonContainer}>
                <Button onClick={close} className={styles.button}>
                  {t(TRANSLATION_KEY.FORM_CANCEL)}
                </Button>
                <Button
                  className={styles.button}
                  disabled={
                    (!dirty && !isPluginDirty) ||
                    (!isValid && submitCount > 0) ||
                    (isSelected && isStarted)
                  }
                  onClick={submitForm}
                  appearance="primary"
                >
                  {t(TRANSLATION_KEY.FORM_SAVE)}
                </Button>
              </div>
            </div>
          );
        }}
      </Form>
    );
  }
);
