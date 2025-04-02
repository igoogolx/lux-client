import { notifier } from "@/components/Core";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { type RootState, settingSlice } from "@/reducers";
import { ThemeContext, type ThemeContextType, ThemeEnum } from "@/utils/theme";
import { Card, Dropdown, Option, Subtitle2 } from "@fluentui/react-components";
import { setSetting, type SettingRes } from "lux-js-sdk";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import styles from "../index.module.css";

export default function Theme() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  const { setTheme: setCurrentTheme } = useContext(
    ThemeContext,
  ) as ThemeContextType;

  const options = [
    { content: t(TRANSLATION_KEY.DARK), id: ThemeEnum.Dark },
    { content: t(TRANSLATION_KEY.LIGHT), id: ThemeEnum.Light },
    { content: t(TRANSLATION_KEY.SYSTEM), id: ThemeEnum.System },
  ];

  const TRANSLATION_MAP = {
    [ThemeEnum.Dark]: t(TRANSLATION_KEY.DARK),
    [ThemeEnum.Light]: t(TRANSLATION_KEY.LIGHT),
    [ThemeEnum.System]: t(TRANSLATION_KEY.SYSTEM),
  };

  const onChange = async (value: ThemeEnum) => {
    const newSetting = { ...setting, theme: value };
    await setSetting(newSetting);
    dispatch(settingSlice.actions.setSetting(newSetting));
    notifier.success(t(TRANSLATION_KEY.SAVE_SUCCESS));
  };

  return (
    <Card className={styles.card}>
      <div className={styles.cardItem}>
        <div className={styles.desc}>
          <Subtitle2>{t(TRANSLATION_KEY.THEME)}</Subtitle2>
        </div>

        <div>
          <Dropdown
            value={TRANSLATION_MAP[setting.theme]}
            onOptionSelect={(_, data) => {
              onChange(data.optionValue as ThemeEnum).catch((e) => {
                console.error(e);
              });
              setCurrentTheme(data.optionValue as ThemeEnum);
            }}
          >
            {options.map((option) => (
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
