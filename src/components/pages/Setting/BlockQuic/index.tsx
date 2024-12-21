import React from "react";
import { Caption1, Card, Subtitle2, Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setSetting, type SettingRes } from "lux-js-sdk";
import { type RootState, settingSlice } from "@/reducers";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import styles from "../index.module.css";
import { notifier } from "../../../Core";

export default function BlockQuic() {
  const { t } = useTranslation();

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  const dispatch = useDispatch();

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared || state.manager.isLoading,
  );

  const onSubmit = async (blockQuic: SettingRes["blockQuic"]) => {
    const newSetting = {
      ...setting,
      blockQuic,
    };
    await setSetting(newSetting);
    dispatch(settingSlice.actions.setSetting(newSetting));
    notifier.success(t(TRANSLATION_KEY.SAVE_SUCCESS));
  };

  return (
    <Card className={styles.card}>
      <div className={styles.cardItem}>
        <div className={styles.desc}>
          <Subtitle2>{t(TRANSLATION_KEY.BLOCK_QUIC_SWITCH_LABEL)}</Subtitle2>
          <Caption1>{t(TRANSLATION_KEY.BLOCK_QUIC_SWITCH_TOOLTIP)}</Caption1>
        </div>
        <Switch
          checked={setting.blockQuic}
          onChange={(e, data) => {
            onSubmit(data.checked);
          }}
          disabled={isStarted}
        />
      </div>
    </Card>
  );
}
