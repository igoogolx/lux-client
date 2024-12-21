import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { type RootState, settingSlice } from "@/reducers";
import { Caption1, Card, Subtitle2, Switch } from "@fluentui/react-components";
import { setSetting, type SettingRes } from "lux-js-sdk";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { notifier } from "../../../Core";
import EditItemWithDialog from "../../../Core/EditItemWithDialog";
import styles from "../index.module.css";

export default function HijackDns() {
  const { t } = useTranslation();

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared || state.manager.isLoading,
  );

  const onSubmit = async (
    hijackDnsConfig: Partial<SettingRes["hijackDns"]>,
  ) => {
    const newSetting = {
      ...setting,
      hijackDns: {
        ...setting.hijackDns,
        ...hijackDnsConfig,
      },
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
          <Subtitle2>{t(TRANSLATION_KEY.HIJACK_DNS_SWITCH_LABEL)}</Subtitle2>
          <Caption1>{t(TRANSLATION_KEY.HIJACK_DNS_SWITCH_TOOLTIP)}</Caption1>
        </div>
        <Switch
          checked={setting.hijackDns.enabled}
          onChange={(e, data) => {
            onSubmit({ enabled: data.checked });
          }}
          disabled={isStarted}
        />
      </div>
      {setting.hijackDns.enabled && (
        <div className={styles.cardItem}>
          <div className={styles.desc}>
            <Subtitle2>{t(TRANSLATION_KEY.HIJACK_DNS_SERVICE_LABEL)}</Subtitle2>
            <Caption1>{t(TRANSLATION_KEY.HIJACK_DNS_SERVICE_DESC)}</Caption1>
          </div>
          <EditItemWithDialog
            title={t(TRANSLATION_KEY.EDIT_HIJACK_DNS_SERVICE_TITLE)}
            open={openModal}
            setOpen={setOpenModal}
            onSubmit={(value) => {
              onSubmit({ networkService: value });
            }}
            value={setting.hijackDns.networkService}
            disabled={isStarted}
          />
        </div>
      )}
    </Card>
  );
}
