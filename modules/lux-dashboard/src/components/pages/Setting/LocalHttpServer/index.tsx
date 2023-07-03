import React, { useState } from "react";
import styles from "@/components/pages/Setting/index.module.css";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { Card, Switch, Subtitle2, Caption1 } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState, settingSlice } from "@/reducers";
import { setSetting, SettingRes } from "lux-js-sdk";
import { notifier } from "@/components/Core";
import EditItemWithDialog from "@/components/pages/Setting/EditItemWithDialog";

export default function LocalHttpServer() {
  const { t } = useTranslation();

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared || state.manager.isLoading
  );

  const onSubmit = async (
    httpConfig: Partial<SettingRes["localServer"]["http"]>
  ) => {
    const newSetting = {
      ...setting,
      localServer: {
        http: {
          ...setting.localServer.http,
          ...httpConfig,
        },
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
          <Subtitle2>{t(TRANSLATION_KEY.HTTP_SERVER_SWITCH_LABEL)}</Subtitle2>
          <Caption1>{t(TRANSLATION_KEY.HTTP_SERVER_SWITCH_TOOLTIP)}</Caption1>
        </div>
        <Switch
          checked={setting.localServer.http.enabled}
          onChange={(e, data) => {
            onSubmit({ enabled: data.checked });
          }}
          disabled={isStarted}
        />
      </div>
      {setting.localServer.http.enabled && (
        <div className={styles.cardItem}>
          <div className={styles.desc}>
            <Subtitle2>{t(TRANSLATION_KEY.HTTP_SERVER_PORT_LABEL)}</Subtitle2>
            <Caption1>{t(TRANSLATION_KEY.HTTP_SERVER_PORT_DESC)}</Caption1>
          </div>
          <EditItemWithDialog
            title="Edit the local http server port"
            inputType="number"
            open={openModal}
            setOpen={setOpenModal}
            onSubmit={(value) => {
              onSubmit({ port: +value });
            }}
            label="Http server port"
            value={setting.localServer.http.port.toString()}
            disabled={isStarted}
          />
        </div>
      )}
    </Card>
  );
}
