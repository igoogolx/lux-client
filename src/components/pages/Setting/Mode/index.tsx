import { RestartAlertModal } from "@/components/Modal/RestartAlertModal";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { type RootState, settingSlice } from "@/reducers";
import { MODE_TRANSLATION_KEY, PROXY_MODE_ENUM } from "@/utils/constants";
import {
  Caption1,
  Card,
  Dropdown,
  Option,
  Subtitle2,
} from "@fluentui/react-components";
import { setSetting, type SettingRes } from "lux-js-sdk";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { notifier } from "../../../Core";
import styles from "../index.module.css";

interface ModeProps {
  os: string;
}

export default function Mode(props: Readonly<ModeProps>) {
  const { os } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared || state.manager.isLoading,
  );

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  const [isRestartAlertModalOpen, setIsRestartAlertModalOpen] = useState(false);

  const isWindows = os === "windows";

  const onSubmit = async (value: PROXY_MODE_ENUM) => {
    const oldValue = setting.mode;
    if (oldValue === value) {
      return;
    }
    const newSetting = { ...setting, mode: value };
    await setSetting(newSetting);
    dispatch(settingSlice.actions.setSetting(newSetting));
    notifier.success(t(TRANSLATION_KEY.SAVE_SUCCESS));
    if (
      isWindows &&
      value !== PROXY_MODE_ENUM.SYSTEM &&
      oldValue !== PROXY_MODE_ENUM.SYSTEM
    ) {
      setIsRestartAlertModalOpen(true);
    }
  };

  const options = [
    {
      id: PROXY_MODE_ENUM.MIXED,
      content: t(MODE_TRANSLATION_KEY.mixed),
    },
    {
      id: PROXY_MODE_ENUM.TUN,
      content: t(MODE_TRANSLATION_KEY.tun),
    },
    {
      id: PROXY_MODE_ENUM.SYSTEM,
      content: t(MODE_TRANSLATION_KEY.system),
    },
  ];

  return (
    <>
      {isRestartAlertModalOpen && (
        <RestartAlertModal
          onCancel={() => {
            setIsRestartAlertModalOpen(false);
          }}
        />
      )}
      <Card className={styles.card}>
        <div className={styles.cardItem}>
          <div className={styles.desc}>
            <Subtitle2>{t(TRANSLATION_KEY.MODE)}</Subtitle2>
            <Caption1>{t(TRANSLATION_KEY.PROXY_MODE_TOOLTIP)}</Caption1>
          </div>

          <Dropdown
            className={styles.selector}
            disabled={isStarted}
            value={t(MODE_TRANSLATION_KEY[setting.mode])}
            onOptionSelect={(_, data) => {
              onSubmit(data.optionValue as SettingRes["mode"]).catch((e) => {
                console.error(e);
              });
            }}
          >
            {options.map((option) => (
              <Option key={option.id} value={option.id}>
                {option.content}
              </Option>
            ))}
          </Dropdown>
        </div>
      </Card>
    </>
  );
}
