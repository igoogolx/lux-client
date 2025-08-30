import AutoConnect from "@/components/pages/Setting/AutoConnect";
import AutoLaunch from "@/components/pages/Setting/AutoLaunch";
import BlockQuic from "@/components/pages/Setting/BlockQuic";
import HijackDns from "@/components/pages/Setting/HijackDns";
import Language from "@/components/pages/Setting/Language";
import LightClientMode from "@/components/pages/Setting/LightClientMode";
import Mode from "@/components/pages/Setting/Mode";
import SensitiveInfoMode from "@/components/pages/Setting/SensitiveInfoMode";
import ShouldFindProcess from "@/components/pages/Setting/ShouldFindProcess";
import Theme from "@/components/pages/Setting/Theme";
import { type RootState } from "@/reducers";
import { PROXY_MODE_ENUM } from "@/utils/constants";
import WsClient from "isomorphic-ws";
import {
  EVENT_TYPE,
  getRuntimeOS,
  type SettingRes,
  subscribeEvent,
} from "lux-js-sdk";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import AutoMode from "./AutoMode";
import ConfigFile from "./ConfigFile";
import DefaultInterface from "./DefaultInterface";
import Dns from "./Dns";
import LocalHttpServer from "./LocalHttpServer";

export function SettingForm() {
  const [os, setOs] = useState("");

  const eventClient = useRef<WsClient | null>(null);

  useEffect(() => {
    getRuntimeOS().then((res) => {
      setOs(res.os);
    });
  }, []);

  useEffect(() => {
    eventClient.current = subscribeEvent({
      onMessage: (item) => {
        console.log(item);
      },
      onError: () => {
        eventClient.current?.close();
      },
    });
  }, []);

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  const isTun =
    setting.mode === PROXY_MODE_ENUM.TUN ||
    setting.mode === PROXY_MODE_ENUM.MIXED;

  const isDarwin = os === "darwin";

  const onChange = () => {
    eventClient.current?.send(EVENT_TYPE.UPDATE_SETTING);
  };

  return (
    <div>
      <div>
        <LightClientMode />
        <Language onChange={onChange} />
        <Theme onChange={onChange} />
        <AutoLaunch />
        <AutoConnect />
        <Mode os={os} />
        {isTun && <Dns />}
        {isTun && <BlockQuic />}
        {isDarwin && isTun && <HijackDns />}
        {isTun && <DefaultInterface />}
        <LocalHttpServer />
        <AutoMode />
        {isTun && <ShouldFindProcess />}
        <SensitiveInfoMode />
        <ConfigFile />
      </div>
    </div>
  );
}
