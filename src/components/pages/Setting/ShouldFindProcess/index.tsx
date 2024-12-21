import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { type RootState, settingSlice } from "@/reducers";
import { Caption1, Card, Subtitle2, Switch } from "@fluentui/react-components";
import { setSetting, type SettingRes } from "lux-js-sdk";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { notifier } from "../../../Core";
import styles from "../index.module.css";

export default function ShouldFindProcess() {
  const { t } = useTranslation();

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  const dispatch = useDispatch();

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared || state.manager.isLoading,
  );

  const onSubmit = async (
    shouldFindProcess: SettingRes["shouldFindProcess"],
  ) => {
    const newSetting = {
      ...setting,
      shouldFindProcess,
    };
    await setSetting(newSetting);
    dispatch(settingSlice.actions.setSetting(newSetting));
    notifier.success(t(TRANSLATION_KEY.SAVE_SUCCESS));
  };

  return (
    <Card className={styles.card}>
      <div className={styles.cardItem}>
        <div className={styles.desc}>
          <Subtitle2>
            {t(TRANSLATION_KEY.SHOULD_FIND_PROCESS_SWITCH_LABEL)}
          </Subtitle2>
          <Caption1>
            {t(TRANSLATION_KEY.SHOULD_FIND_PROCESS_SWITCH_TOOLTIP)}
          </Caption1>
        </div>
        <Switch
          checked={setting.shouldFindProcess}
          onChange={(e, data) => {
            onSubmit(data.checked);
          }}
          disabled={isStarted}
        />
      </div>
    </Card>
  );
}
