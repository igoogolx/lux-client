import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { type RootState, settingSlice } from "@/reducers";
import webviewContext from "@/utils/webviewContext";
import { Caption1, Card, Subtitle2, Switch } from "@fluentui/react-components";
import { setSetting, type SettingRes } from "lux-js-sdk";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { notifier } from "../../../Core";
import styles from "../index.module.css";

export default function LightClientMode() {
  const { t } = useTranslation();

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  const dispatch = useDispatch();

  const onSubmit = async (lightClientMode: SettingRes["lightClientMode"]) => {
    const newSetting = {
      ...setting,
      lightClientMode: lightClientMode,
    };
    await setSetting(newSetting);
    dispatch(settingSlice.actions.setSetting(newSetting));
    webviewContext.setAutoLaunch(lightClientMode);
    notifier.success(t(TRANSLATION_KEY.SAVE_SUCCESS));
  };

  return (
    <Card className={styles.card}>
      <div className={styles.cardItem}>
        <div className={styles.desc}>
          <Subtitle2>
            {t(TRANSLATION_KEY.LIGHT_CLINT_MODE_SWITCH_LABEL)}
          </Subtitle2>
          <Caption1>
            {t(TRANSLATION_KEY.LIGHT_CLINT_MODE_SWITCH_TOOLTIP)}
          </Caption1>
        </div>
        <Switch
          checked={setting.lightClientMode}
          onChange={(_, data) => {
            onSubmit(data.checked).catch((e) => {
              console.error(e);
            });
          }}
        />
      </div>
    </Card>
  );
}
