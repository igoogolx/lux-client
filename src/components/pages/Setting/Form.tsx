import AutoConnect from "@/components/pages/Setting/AutoConnect";
import AutoLaunch from "@/components/pages/Setting/AutoLaunch";
import BlockQuic from "@/components/pages/Setting/BlockQuic";
import HijackDns from "@/components/pages/Setting/HijackDns";
import Language from "@/components/pages/Setting/Language";
import Mode from "@/components/pages/Setting/Mode";
import ShouldFindProcess from "@/components/pages/Setting/ShouldFindProcess";
import Stack from "@/components/pages/Setting/Stack";
import Theme from "@/components/pages/Setting/Theme";
import { type RootState } from "@/reducers";
import { getRuntimeOS, type SettingRes } from "lux-js-sdk";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AutoMode from "./AutoMode";
import ConfigFile from "./ConfigFile";
import DefaultInterface from "./DefaultInterface";
import Dns from "./Dns";
import LocalHttpServer from "./LocalHttpServer";

export function SettingForm() {
  const [os, setOs] = useState("");
  useEffect(() => {
    getRuntimeOS().then((res) => {
      setOs(res.os);
    });
  }, []);

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  const isTun = setting.mode === "tun";

  const isDarwin = os === "darwin";

  return (
    <div>
      <div>
        <Language />
        <Theme />
        {isDarwin && <AutoLaunch />}
        <AutoConnect />
        <Mode />
        {isTun && <Stack />}
        {isTun && <Dns />}
        {isTun && <BlockQuic />}
        {isDarwin && isTun && <HijackDns />}
        {isTun && <DefaultInterface />}
        <LocalHttpServer />
        <AutoMode />
        {isTun && <ShouldFindProcess />}
        <ConfigFile />
      </div>
    </div>
  );
}
