import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { Dropdown, Option, Text } from "@fluentui/react-components";
import {
  type BaseProxy,
  type Obfs,
  ObfsModeEnum,
  PluginTypeEnum,
  type Shadowsocks,
  type V2rayObfs,
} from "lux-js-sdk";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { NONE_ID } from "../EditShadowsocksModal/constant";
import { NonePlugin } from "./None";
import { EditObfsPlugin } from "./Obfs";
import { EditV2rayPlugin } from "./V2ray";
import styles from "./index.module.css";

interface EditPluginProps {
  close: () => void;
  type?: BaseProxy["plugin"];
  initialValue: Pick<Shadowsocks, "plugin" | "plugin-opts">;
  onSave: (data: Partial<Pick<Shadowsocks, "plugin" | "plugin-opts">>) => void;
}

const INIT_V2RAY_DATA: V2rayObfs = {
  mode: "websocket",
  host: "",
  path: "",
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

  const [currentType, setCurrentType] = useState<string>(type);

  const { t } = useTranslation();

  switch (currentType) {
    case PluginTypeEnum.Obfs:
      content = (
        <EditObfsPlugin
          close={close}
          initialValue={
            (initialValue["plugin-opts"] ?? INIT_OBFS_DATA) as NonNullable<Obfs>
          }
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
            initialValue["plugin-opts"] ??
            (INIT_V2RAY_DATA as NonNullable<V2rayObfs>)
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
