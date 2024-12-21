import React from "react";
import { Card, Dropdown, Option, Subtitle2 } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, settingSlice } from "@/reducers";
import { setSetting, type SettingRes } from "lux-js-sdk";
import { notifier } from "@/components/Core";
import { getLang, LANGUAGE_ENUM } from "@/i18n";
import styles from "../index.module.css";

export default function Language() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  const LANGUAGE_OPTIONS = [
    { content: t(TRANSLATION_KEY.SYSTEM), id: LANGUAGE_ENUM.SYSTEM },
    { content: t(TRANSLATION_KEY.EN_US), id: LANGUAGE_ENUM.EN_US },
    { content: t(TRANSLATION_KEY.ZH_CN), id: LANGUAGE_ENUM.ZH_CN },
  ];

  const TRANSLATION_MAP = {
    [LANGUAGE_ENUM.SYSTEM]: t(TRANSLATION_KEY.SYSTEM),
    [LANGUAGE_ENUM.EN_US]: t(TRANSLATION_KEY.EN_US),
    [LANGUAGE_ENUM.ZH_CN]: t(TRANSLATION_KEY.ZH_CN),
  };

  const onChange = async (value: string) => {
    const newSetting = { ...setting, language: value };
    await setSetting(newSetting);
    dispatch(settingSlice.actions.setSetting(newSetting));
    notifier.success(t(TRANSLATION_KEY.SAVE_SUCCESS));
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
            selectedOptions={[setting.language]}
            onOptionSelect={(e, data) => {
              onChange(data.optionValue as string);
              i18n.changeLanguage(getLang(data.optionValue));
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
