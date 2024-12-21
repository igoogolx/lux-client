import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { type RootState, settingSlice } from "@/reducers";
import {
  Caption1,
  Card,
  Dropdown,
  Option,
  Subtitle2,
} from "@fluentui/react-components";
import { setSetting, type SettingRes } from "lux-js-sdk";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { notifier } from "../../../Core";
import styles from "../index.module.css";

const OPTIONS = [
  {
    id: "system",
    content: "system",
  },
  {
    id: "gvisor",
    content: "gvisor",
  },
];

export default function Stack() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared || state.manager.isLoading,
  );

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  const onSubmit = async (value: string) => {
    const newSetting = { ...setting, stack: value };
    await setSetting(newSetting);
    dispatch(settingSlice.actions.setSetting(newSetting));
    notifier.success(t(TRANSLATION_KEY.SAVE_SUCCESS));
  };

  return (
    <Card className={styles.card}>
      <div className={styles.cardItem}>
        <div className={styles.desc}>
          <Subtitle2>{t(TRANSLATION_KEY.NETWORK_STACK)}</Subtitle2>
          <Caption1>{t(TRANSLATION_KEY.NETWORK_STACK_TIP)}</Caption1>
        </div>

        <Dropdown
          className={styles.selector}
          disabled={isStarted}
          value={setting.stack}
          onOptionSelect={(e, data) => {
            onSubmit(data.optionValue as SettingRes["stack"]);
          }}
        >
          {OPTIONS.map((option) => (
            <Option key={option.id}>{option.content}</Option>
          ))}
        </Dropdown>
      </div>
    </Card>
  );
}
