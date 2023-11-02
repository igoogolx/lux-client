import React, { useEffect, useState } from "react";
import HijackDns from "@/components/pages/Setting/HijackDns";
import { getRuntimeOS } from "lux-js-sdk";
import Language from "@/components/pages/Setting/Language";
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
  return (
    <div>
      <div>
        <Dns />
        {os === "darwin" && <HijackDns />}
        <DefaultInterface />
        <LocalHttpServer />
        <AutoMode />
        <ConfigFile />
      </div>
    </div>
  );
}
