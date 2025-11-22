import AutoConnect from "@/components/pages/Setting/AutoConnect";
import AutoLaunch from "@/components/pages/Setting/AutoLaunch";
import BlockQuic from "@/components/pages/Setting/BlockQuic";
import HijackDns from "@/components/pages/Setting/HijackDns";
import Language from "@/components/pages/Setting/Language";
import Mode from "@/components/pages/Setting/Mode";
import SensitiveInfoMode from "@/components/pages/Setting/SensitiveInfoMode";
import ShouldFindProcess from "@/components/pages/Setting/ShouldFindProcess";
import Theme from "@/components/pages/Setting/Theme";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { type RootState } from "@/reducers";
import { PROXY_MODE_ENUM } from "@/utils/constants";
import { makeStyles, typographyStyles } from "@fluentui/react-components";
import classNames from "classnames";
import { getRuntimeOS, type SettingRes } from "lux-js-sdk";
import React, { JSX, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import AutoMode from "./AutoMode";
import ConfigFile from "./ConfigFile";
import DefaultInterface from "./DefaultInterface";
import Dns from "./Dns";
import LocalHttpServer from "./LocalHttpServer";
import styles from "./index.module.css";

const useStyles = makeStyles({
  title3: typographyStyles.title3,
});

type SettingsFormProps = {
  directedInterfaceV4Addr: string;
};

export function SettingForm(props: SettingsFormProps): JSX.Element {
  const { directedInterfaceV4Addr } = props;
  const [os, setOs] = useState("");

  const { t } = useTranslation();

  useEffect(() => {
    getRuntimeOS().then((res) => {
      setOs(res.os);
    });
  }, []);

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  const inlineStyles = useStyles();

  const isTun =
    setting.mode === PROXY_MODE_ENUM.TUN ||
    setting.mode === PROXY_MODE_ENUM.MIXED;

  const isDarwin = os === "darwin";

  const titleCls = classNames(inlineStyles.title3, styles.title);

  return (
    <div>
      <div>
        <div className={titleCls}>{t(TRANSLATION_KEY.GENERAL)}</div>
        <Language />
        <Theme />
        <AutoLaunch />
        <AutoConnect />

        <div className={titleCls}>{t(TRANSLATION_KEY.NETWORK)}</div>
        <Mode os={os} />
        {isTun && <Dns />}
        {isTun && <BlockQuic />}
        {isDarwin && isTun && <HijackDns />}
        {isTun && <DefaultInterface />}
        <LocalHttpServer directedInterfaceV4Addr={directedInterfaceV4Addr} />
        <AutoMode />

        <div className={titleCls}>{t(TRANSLATION_KEY.ADVANCED)}</div>
        {isTun && <ShouldFindProcess />}
        <SensitiveInfoMode />
        <ConfigFile />
      </div>
    </div>
  );
}
