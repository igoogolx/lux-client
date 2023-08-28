import React, { useState } from "react";
import styles from "@/components/pages/Setting/index.module.css";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { Caption1, Card, Subtitle2 } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState, settingSlice } from "@/reducers";
import { setSetting, SettingRes } from "lux-js-sdk";
import { notifier } from "@/components/Core";
import EditItemWithDialog from "@/components/Core/EditItemWithDialog";

export default function TrueProxyServer() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const setting = useSelector<RootState, SettingRes>((state) => state.setting);
  const onSubmit = async (value: string) => {
    const newSetting = { ...setting, trueProxyServer: value };
    await setSetting(newSetting);
    dispatch(settingSlice.actions.setSetting(newSetting));
    setOpenModal(false);
    notifier.success(t(TRANSLATION_KEY.SAVE_SUCCESS));
  };

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared || state.manager.isLoading
  );

  return (
    <Card className={styles.card}>
      <div className={styles.cardItem}>
        <div className={styles.desc}>
          <Subtitle2>{t(TRANSLATION_KEY.TRUE_PROXY_SERVER)}</Subtitle2>
          <Caption1>{t(TRANSLATION_KEY.TRUE_PROXY_SERVER_TOOLTIPS)}</Caption1>
        </div>
        <EditItemWithDialog
          title={t(TRANSLATION_KEY.EDIT_PROXY_SERVER_TITLE)}
          open={openModal}
          setOpen={setOpenModal}
          onSubmit={(value) => {
            onSubmit(value);
          }}
          value={setting.trueProxyServer}
          disabled={isStarted}
        />
      </div>
    </Card>
  );
}
