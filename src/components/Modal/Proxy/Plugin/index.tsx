import React, { useState } from "react";
import {
  Obfs,
  ObfsModeEnum,
  PluginTypeEnum,
  Shadowsocks,
  V2rayObfs,
} from "lux-js-sdk";
import { Dropdown, Option, Text } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { EditObfsPlugin } from "./Obfs";
import { EditV2rayPlugin } from "./V2ray";
import { NONE_ID } from "../EditShadowsocksModal/constant";
import { NonePlugin } from "./None";
import styles from "./index.module.css";

type EditPluginProps = {
  close: () => void;
  type?: PluginTypeEnum;
  initialValue: Pick<Shadowsocks, "plugin" | "plugin-opts">;
  onSave: (data: Partial<Pick<Shadowsocks, "plugin" | "plugin-opts">>) => void;
};

const INIT_V2RAY_DATA: V2rayObfs = {
  mode: "websocket",
  host: "",
  port: "",
  path: "",
  tls: false,
  skipCertVerify: false,
};

const INIT_OBFS_DATA: Obfs = {
  host: "",
  mode: ObfsModeEnum.Http,
};

export function EditPlugin(props: EditPluginProps) {
  const { type = PluginTypeEnum.Obfs, close, initialValue, onSave } = props;
  let content = null;

  const typeOption = {
    [PluginTypeEnum.Obfs]: "Obfs",
    [PluginTypeEnum.V2ray]: "v2ray-plugin",
    [NONE_ID]: "None",
  };

  const [currentType, setCurrentType] = useState<keyof typeof typeOption>(type);

  const { t } = useTranslation();

  switch (currentType) {
    case PluginTypeEnum.Obfs:
      content = (
        <EditObfsPlugin
          close={close}
          initialValue={(initialValue["plugin-opts"] as Obfs) || INIT_OBFS_DATA}
          onChange={(data) => {
            onSave({ plugin: currentType, "plugin-opts": data });
          }}
        />
      );
      break;
    case PluginTypeEnum.V2ray:
      content = (
        <EditV2rayPlugin
          close={close}
          initialValue={
            (initialValue["plugin-opts"] as V2rayObfs) || INIT_V2RAY_DATA
          }
          onChange={(data) => {
            onSave({ plugin: currentType, "plugin-opts": data });
          }}
        />
      );
      break;
    case NONE_ID: {
      content = (
        <NonePlugin
          close={close}
          onChange={() => {
            onSave({ plugin: undefined, "plugin-opts": undefined });
          }}
        />
      );
      break;
    }
    default: {
      throw new Error(`invalid ${type}`);
    }
  }
  return (
    <div>
      <div className={styles.type}>
        <Text>{t(TRANSLATION_KEY.TYPE)}</Text>
        <Dropdown
          defaultValue={typeOption[currentType]}
          onOptionSelect={(e, data) => {
            setCurrentType(data.optionValue as PluginTypeEnum);
          }}
        >
          {Object.keys(typeOption).map((key: string) => (
            <Option
              key={key}
              text={typeOption[key as PluginTypeEnum]}
              value={key}
            >
              {typeOption[key as PluginTypeEnum]}
            </Option>
          ))}
        </Dropdown>
      </div>
      {content}
    </div>
  );
}
