import React, { useEffect, useState } from "react";
import styles from "@/components/pages/Setting/index.module.css";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { Caption1, Card, Subtitle2 } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState, settingSlice } from "@/reducers";
import {
  getRuntimeOS,
  getSettingInterfaces,
  setSetting,
  SettingRes,
} from "lux-js-sdk";
import { MenuItemProps, notifier } from "@/components/Core";
import EditItemWithDialog from "@/components/Core/EditItemWithDialog";

export default function DefaultInterface() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared || state.manager.isLoading
  );

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  const onSubmit = async (value: string) => {
    const newSetting = { ...setting, defaultInterface: value };
    await setSetting(newSetting);
    dispatch(settingSlice.actions.setSetting(newSetting));
    setOpenModal(false);
    notifier.success(t(TRANSLATION_KEY.SAVE_SUCCESS));
  };

  const [networkInterfaces, setNetworkInterfaces] = useState<MenuItemProps[]>(
    []
  );

  useEffect(() => {
    (async function () {
      const { os } = await getRuntimeOS();
      // TODO: optimize
      getSettingInterfaces().then((items) => {
        const filteredItems = items.filter((item) => {
          if (os === "darwin") return item.Name.startsWith("en");
          return true;
        });
        const newInterfaces = [...filteredItems].map((item) => ({
          id: item.Name,
          content: item.Name,
        }));
        setNetworkInterfaces(newInterfaces);
      });
    })();
  }, []);

  return (
    <Card className={styles.card}>
      <div className={styles.cardItem}>
        <div className={styles.desc}>
          <Subtitle2>{t(TRANSLATION_KEY.DEFAULT_INTERFACE)}</Subtitle2>
          <Caption1>{t(TRANSLATION_KEY.DEFAULT_INTERFACE_TOOLTIP)}</Caption1>
        </div>
        <EditItemWithDialog
          title="Edit the default interface name"
          open={openModal}
          setOpen={setOpenModal}
          onSubmit={(value) => {
            onSubmit(value);
          }}
          value={setting.defaultInterface}
          disabled={isStarted}
          type="selector"
          selectorItems={networkInterfaces}
        />
      </div>
    </Card>
  );
}
