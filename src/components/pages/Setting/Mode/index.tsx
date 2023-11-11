import React, { useState } from "react";
import { Caption1, Card, Subtitle2 } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setSetting, SettingRes } from "lux-js-sdk";
import { RootState, settingSlice } from "@/reducers";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import styles from "../index.module.css";
import { notifier } from "../../../Core";
import EditItemWithDialog from "../../../Core/EditItemWithDialog";

const OPTIONS = [
  {
    id: "tun",
    content: "tun",
  },
  {
    id: "system",
    content: "system",
  },
];

export default function Mode() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared || state.manager.isLoading
  );

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  const onSubmit = async (value: string) => {
    const newSetting = { ...setting, mode: value };
    await setSetting(newSetting);
    dispatch(settingSlice.actions.setSetting(newSetting));
    setOpenModal(false);
    notifier.success(t(TRANSLATION_KEY.SAVE_SUCCESS));
  };

  return (
    <Card className={styles.card}>
      <div className={styles.cardItem}>
        <div className={styles.desc}>
          <Subtitle2>{t(TRANSLATION_KEY.MODE)}</Subtitle2>
          <Caption1>{t(TRANSLATION_KEY.PROXY_MODE_TOOLTIP)}</Caption1>
        </div>
        <EditItemWithDialog
          title={t(TRANSLATION_KEY.EDIT_MODE_TOOLTIP)}
          open={openModal}
          setOpen={setOpenModal}
          onSubmit={(value) => {
            onSubmit(value);
          }}
          value={setting.mode}
          disabled={isStarted}
          type="selector"
          selectorItems={OPTIONS}
          canReset={false}
        />
      </div>
    </Card>
  );
}
