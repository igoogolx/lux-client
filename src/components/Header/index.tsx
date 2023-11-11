import React, { useEffect } from "react";
import {
  Button,
  InteractionTag,
  InteractionTagPrimary,
  Title2,
  Tooltip,
} from "@fluentui/react-components";
import { NavigationFilled } from "@fluentui/react-icons";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getSetting, SettingRes } from "lux-js-sdk";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { RootState, settingSlice } from "@/reducers";
import { ROUTER_NAME, ROUTER_PATH } from "@/utils/constants";
import styles from "./index.module.css";

type HeaderProps = {
  isNavOpen: boolean;
  setIsNavOpen: (isOpen: boolean) => void;
};

export function Header(props: HeaderProps) {
  const { setIsNavOpen, isNavOpen } = props;
  const location = useLocation();
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  useEffect(() => {
    getSetting().then((data) => {
      dispatch(settingSlice.actions.setSetting(data));
    });
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <Title2>{t(ROUTER_NAME[location.pathname as ROUTER_PATH])}</Title2>

        {(location.pathname as ROUTER_PATH) === ROUTER_PATH.Home && (
          <>
            <Tooltip
              content={t(TRANSLATION_KEY.PROXY_MODE_TOOLTIP)}
              relationship="label"
            >
              <InteractionTag appearance="brand" className={styles.actionTag}>
                <InteractionTagPrimary>{`${
                  setting.mode === "tun" ? "Tun" : "System"
                } Proxy`}</InteractionTagPrimary>
              </InteractionTag>
            </Tooltip>
            {setting.autoMode.enabled && (
              <Tooltip
                content={t(TRANSLATION_KEY.MODE_SELECT_TIP)}
                relationship="label"
              >
                <InteractionTag appearance="brand" className={styles.actionTag}>
                  <InteractionTagPrimary>
                    {t(TRANSLATION_KEY.MODE_SWITCH_LABEL)}
                  </InteractionTagPrimary>
                </InteractionTag>
              </Tooltip>
            )}
          </>
        )}
      </div>

      <div className={styles.navigationBtn}>
        <Button
          icon={<NavigationFilled />}
          onClick={() => {
            setIsNavOpen(!isNavOpen);
          }}
        />
      </div>
    </div>
  );
}
