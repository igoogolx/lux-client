import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { proxiesSlice, type RootState } from "@/reducers";
import { Button } from "@fluentui/react-components";
import {
  addProxy,
  ProxyTypeEnum,
  type Shadowsocks,
  updateProxy,
} from "lux-js-sdk";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Field, FiledSelector, Form, PasswordFiled } from "../../../Core";
import { EditPlugin } from "../Plugin";
import {
  ENCRYPTION_METHODS,
  NONE_ID,
  PageStepEnum,
  SHADOWSOCKS_PLUINS,
} from "./constant";
import styles from "./index.module.css";
import { ShadowsocksSchema } from "./validate";

interface EditShadowsocksModalProps {
  close: () => void;
  initialValue?: Shadowsocks;
  isSelected?: boolean;
  setPageStep?: (step: PageStepEnum) => void;
}

const INIT_DATA: Shadowsocks = {
  type: ProxyTypeEnum.Shadowsocks,
  id: "",
  name: "",
  server: "",
  password: "",
  port: 1080,
  cipher: ENCRYPTION_METHODS[0] as Shadowsocks["cipher"],
};

export const EditShadowsocksModal = React.memo(
  (props: EditShadowsocksModalProps) => {
    const { close, initialValue, isSelected = false, setPageStep } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const methodsOptions = useRef(
      ENCRYPTION_METHODS.map((METHOD) => ({ content: METHOD, id: METHOD })),
    );

    const pluginOptions = useRef(
      [...SHADOWSOCKS_PLUINS, NONE_ID].map((METHOD) => ({
        content: METHOD,
        id: METHOD,
      })),
    );

    const isStarted = useSelector<RootState, boolean>(
      (state) => state.manager.isStared,
    );

    const [editingPlugin, setEditingPlugin] = useState(false);

    const initData = initialValue ?? INIT_DATA;

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
          proxy: { ...value, ...pluginData },
        });
        dispatch(
          proxiesSlice.actions.updateOne({
            proxy: { ...value, ...pluginData },
          }),
        );
      } else {
        const { id } = await addProxy({
          proxy: { ...value, ...pluginData },
        });
        dispatch(
          proxiesSlice.actions.addOne({
            proxy: { ...value, ...pluginData, id },
          }),
        );
      }
      close();
    };
    return (
      <div>
        {editingPlugin ? (
          <div>
            <EditPlugin
              type={pluginData.plugin}
              initialValue={pluginData}
              onSave={(data) => {
                setPluginData(data);
              }}
              close={() => {
                setEditingPlugin(false);
                if (setPageStep) {
                  setPageStep(PageStepEnum.First);
                }
              }}
            />
          </div>
        ) : null}
        <div style={{ display: !editingPlugin ? "block" : "none" }}>
          <Form
            validationSchema={ShadowsocksSchema}
            initialValues={initData}
            onSubmit={onSubmit}
          >
            {({ submitForm, isValid }) => {
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
                    value={pluginData.plugin ?? NONE_ID}
                    name="plugin"
                    items={pluginOptions.current}
                    label={`${t(TRANSLATION_KEY.FORM_PLUGIN)}(${t(
                      TRANSLATION_KEY.FORM_OPTIONAL,
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
                      disabled={!isValid || (isSelected && isStarted)}
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
        </div>
      </div>
    );
  },
);

EditShadowsocksModal.displayName = "EditShadowsocksModal";
