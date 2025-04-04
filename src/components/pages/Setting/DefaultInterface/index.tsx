import TunTag from "@/components/pages/Setting/TunTag";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { type RootState, settingSlice } from "@/reducers";
import { Caption1, Card, Subtitle2 } from "@fluentui/react-components";
import {
  getRuntimeOS,
  getSettingInterfaces,
  setSetting,
  type SettingRes,
} from "lux-js-sdk";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { type MenuItemProps, notifier } from "../../../Core";
import EditItemWithDialog from "../../../Core/EditItemWithDialog";
import styles from "../index.module.css";

export default function DefaultInterface() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared || state.manager.isLoading,
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
    [],
  );

  const init = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    init().catch((e) => {
      console.error(e);
    });
  }, [init]);

  return (
    <Card className={styles.card}>
      <div className={styles.cardItem}>
        <div className={styles.desc}>
          <Subtitle2>
            {t(TRANSLATION_KEY.DEFAULT_INTERFACE)}
            <TunTag />
          </Subtitle2>
          <Caption1>{t(TRANSLATION_KEY.DEFAULT_INTERFACE_TOOLTIP)}</Caption1>
        </div>
        <EditItemWithDialog
          title={t(TRANSLATION_KEY.EDIT_INTERFACE_TITLE)}
          open={openModal}
          setOpen={setOpenModal}
          onSubmit={(value) => {
            onSubmit(value).catch((e) => {
              console.error(e);
            });
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
