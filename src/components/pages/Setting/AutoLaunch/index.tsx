import { EventContext } from "@/components/Core/Event";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { type RootState, settingSlice } from "@/reducers";
import { Caption1, Card, Subtitle2, Switch } from "@fluentui/react-components";
import { setSetting, type SettingRes } from "lux-js-sdk";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { notifier } from "../../../Core";
import styles from "../index.module.css";

export default function AutoLaunch() {
  const { t } = useTranslation();

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  const eventHub = useContext(EventContext);

  const dispatch = useDispatch();

  const onSubmit = async (autoLaunch: SettingRes["autoLaunch"]) => {
    const newSetting = {
      ...setting,
      autoLaunch,
    };
    await setSetting(newSetting);
    dispatch(settingSlice.actions.setSetting(newSetting));
    eventHub?.setAutoLaunch(autoLaunch);
    notifier.success(t(TRANSLATION_KEY.SAVE_SUCCESS));
  };

  return (
    <Card className={styles.card}>
      <div className={styles.cardItem}>
        <div className={styles.desc}>
          <Subtitle2>{t(TRANSLATION_KEY.AUTO_LAUNCH_SWITCH_LABEL)}</Subtitle2>
          <Caption1>{t(TRANSLATION_KEY.AUTO_LAUNCH_SWITCH_TOOLTIP)}</Caption1>
        </div>
        <Switch
          checked={setting.autoLaunch}
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
