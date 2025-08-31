import { notifier } from "@/components/Core";
import { EventContext } from "@/components/Core/Event";
import { getLang, LANGUAGE_ENUM } from "@/i18n";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { type RootState, settingSlice } from "@/reducers";
import { Card, Dropdown, Option, Subtitle2 } from "@fluentui/react-components";
import { setSetting, type SettingRes } from "lux-js-sdk";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import styles from "../index.module.css";

export default function Language() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  const eventHub = useContext(EventContext);

  const LANGUAGE_OPTIONS = [
    { content: t(TRANSLATION_KEY.SYSTEM_SETTING), id: LANGUAGE_ENUM.SYSTEM },
    { content: t(TRANSLATION_KEY.EN_US), id: LANGUAGE_ENUM.EN_US },
    { content: t(TRANSLATION_KEY.ZH_CN), id: LANGUAGE_ENUM.ZH_CN },
  ];

  const TRANSLATION_MAP = {
    [LANGUAGE_ENUM.SYSTEM]: t(TRANSLATION_KEY.SYSTEM_SETTING),
    [LANGUAGE_ENUM.EN_US]: t(TRANSLATION_KEY.EN_US),
    [LANGUAGE_ENUM.ZH_CN]: t(TRANSLATION_KEY.ZH_CN),
  };

  const onChange = async (value: string) => {
    const newSetting = { ...setting, language: value };
    await setSetting(newSetting);
    dispatch(settingSlice.actions.setSetting(newSetting));
    notifier.success(t(TRANSLATION_KEY.SAVE_SUCCESS));
    eventHub?.setLanguage(value);
  };

  return (
    <Card className={styles.card}>
      <div className={styles.cardItem}>
        <div className={styles.desc}>
          <Subtitle2>{t(TRANSLATION_KEY.LANGUAGE)}</Subtitle2>
        </div>

        <div>
          <Dropdown
            value={TRANSLATION_MAP[setting.language as LANGUAGE_ENUM]}
            onOptionSelect={(_, data) => {
              onChange(data.optionValue as string).catch((e) => {
                console.error(e);
              });
              i18n.changeLanguage(getLang(data.optionValue)).catch((e) => {
                console.error(e);
              });
            }}
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <Option key={option.id as string} value={option.id}>
                {option.content}
              </Option>
            ))}
          </Dropdown>
        </div>
      </div>
    </Card>
  );
}
