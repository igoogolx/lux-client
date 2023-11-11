import React, { useEffect, useState } from "react";
import HijackDns from "@/components/pages/Setting/HijackDns";
import { getRuntimeOS, SettingRes } from "lux-js-sdk";
import Mode from "@/components/pages/Setting/Mode";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers";
import DefaultInterface from "./DefaultInterface";
import AutoMode from "./AutoMode";
import LocalHttpServer from "./LocalHttpServer";
import Dns from "./Dns";
import ConfigFile from "./ConfigFile";

export function SettingForm() {
  const [os, setOs] = useState("");
  useEffect(() => {
    getRuntimeOS().then((res) => {
      setOs(res.os);
    });
  }, []);

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  const isTun = setting.mode === "tun";

  return (
    <div>
      <div>
        <Mode />
        {isTun && <Dns />}
        {os === "darwin" && <HijackDns />}
        {isTun && <DefaultInterface />}
        <LocalHttpServer />
        <AutoMode />
        <ConfigFile />
      </div>
    </div>
  );
}
