import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { type RootState, settingSlice } from "@/reducers";
import {
  Caption1,
  Card,
  Dropdown,
  Option,
  Subtitle2,
  Switch,
} from "@fluentui/react-components";
import { setSetting, type SettingRes } from "lux-js-sdk";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { notifier } from "../../../Core";
import EditItemWithDialog from "../../../Core/EditItemWithDialog";
import styles from "../index.module.css";

export default function AutoMode() {
  const { t } = useTranslation();

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared || state.manager.isLoading,
  );

  const modeTypeOptions = useRef([
    { content: "url-test", id: "url-test" },
    { content: "fallback", id: "fallback" },
  ]);

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  const [openModal, setOpenModal] = useState(false);

  const dispatch = useDispatch();

  const onSubmit = async (newAutoMode: SettingRes["autoMode"]) => {
    const newSetting = {
      ...setting,
      autoMode: newAutoMode,
    };

    await setSetting(newSetting);
    dispatch(settingSlice.actions.setSetting(newSetting));
    setOpenModal(false);
    notifier.success(t(TRANSLATION_KEY.SAVE_SUCCESS));
  };

  return (
    <Card className={styles.card}>
      <div className={styles.cardItem}>
        <div className={styles.desc}>
          <Subtitle2>{t(TRANSLATION_KEY.MODE_SWITCH_LABEL)}</Subtitle2>
          <Caption1>{t(TRANSLATION_KEY.MODE_SWITCH_TOOLTIP)}</Caption1>
        </div>
        <Switch
          disabled={isStarted}
          checked={setting.autoMode.enabled}
          onChange={(_, data) => {
            onSubmit({
              ...setting.autoMode,
              enabled: data.checked,
            }).catch((e) => {
              console.error(e);
            });
          }}
        />
      </div>

      {setting.autoMode.enabled && (
        <>
          <div className={styles.cardItem}>
            <div className={styles.desc}>
              <Subtitle2>{t(TRANSLATION_KEY.PROXY_MODE_TYPE_LABEL)}</Subtitle2>
              <Caption1>{t(TRANSLATION_KEY.PROXY_MODE_TYPE_DESC)}</Caption1>
            </div>
            <Dropdown
              className={styles.selector}
              disabled={isStarted}
              value={setting.autoMode.type}
              onOptionSelect={(_, data) => {
                onSubmit({
                  ...setting.autoMode,
                  type: data.optionValue as SettingRes["autoMode"]["type"],
                }).catch((e) => {
                  console.error(e);
                });
              }}
            >
              {modeTypeOptions.current.map((option) => (
                <Option key={option.id}>{option.content}</Option>
              ))}
            </Dropdown>
          </div>
          <div className={styles.cardItem}>
            <div className={styles.desc}>
              <Subtitle2>{t(TRANSLATION_KEY.TESTING_URL_LABEL)}</Subtitle2>
              <Caption1>{t(TRANSLATION_KEY.TESTING_URL_DESC)}</Caption1>
            </div>
            <EditItemWithDialog
              disabled={isStarted}
              title={t(TRANSLATION_KEY.EDIT_TESTING_URL)}
              open={openModal}
              setOpen={setOpenModal}
              onSubmit={(value) => {
                onSubmit({
                  ...setting.autoMode,
                  url: value,
                }).catch((e) => {
                  console.error(e);
                });
              }}
              value={setting.autoMode.url}
            />
          </div>
        </>
      )}
    </Card>
  );
}
