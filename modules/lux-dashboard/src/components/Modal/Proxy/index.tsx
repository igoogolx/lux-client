import React, { useState } from "react";
import { Http, Proxy, ProxyTypeEnum, Shadowsocks, Socks5 } from "lux-js-sdk";
import { EditHttpModal } from "@/components/Modal/Proxy/EditHttpModal";
import { Modal } from "@/components/Core";
import { Dropdown, Option, Text } from "@fluentui/react-components";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { useTranslation } from "react-i18next";
import { PageStepEnum } from "@/components/Modal/Proxy/EditShadowsocksModal/constant";
import { EditSocks5Modal } from "./EditSocks5Modal";
import { EditShadowsocksModal } from "./EditShadowsocksModal";
import styles from "./index.module.css";

type EditModalProps = {
  close: () => void;
  type: ProxyTypeEnum;
  initialValue?: Proxy;
  isSelected?: boolean;
};

export function EditModal(props: EditModalProps) {
  const { type, close, initialValue, isSelected = false } = props;
  let content = null;

  const typeOption = {
    [ProxyTypeEnum.Shadowsocks]: "Shadowsocks",
    [ProxyTypeEnum.Http]: "Http",
    [ProxyTypeEnum.Socks5]: "Socks5",
  };

  const [currentType, setCurrentType] = useState(type);

  const [pageStep, setPageStep] = useState(PageStepEnum.First);

  const { t } = useTranslation();

  switch (currentType) {
    case ProxyTypeEnum.Shadowsocks:
      content = (
        <EditShadowsocksModal
          close={close}
          initialValue={initialValue as Shadowsocks}
          isSelected={isSelected}
          setPageStep={setPageStep}
        />
      );
      break;
    case ProxyTypeEnum.Socks5:
      content = (
        <EditSocks5Modal
          close={close}
          initialValue={initialValue as Socks5}
          isSelected={isSelected}
        />
      );
      break;
    case ProxyTypeEnum.Http:
      content = (
        <EditHttpModal
          close={close}
          initialValue={initialValue as Http}
          isSelected={isSelected}
        />
      );
      break;
    default: {
      throw new Error(`invalid ${type}`);
    }
  }
  return (
    <Modal close={close} hideCloseButton hideOkButton>
      {pageStep === PageStepEnum.First && (
        <div className={styles.type}>
          <Text>{t(TRANSLATION_KEY.TYPE)}</Text>
          <Dropdown
            disabled={!!initialValue}
            defaultValue={typeOption[currentType]}
            onOptionSelect={(e, data) => {
              setCurrentType(data.optionValue as ProxyTypeEnum);
            }}
          >
            {Object.keys(typeOption).map((key: string) => (
              <Option
                key={key}
                text={typeOption[key as ProxyTypeEnum]}
                value={key}
              >
                {typeOption[key as ProxyTypeEnum]}
              </Option>
            ))}
          </Dropdown>
        </div>
      )}
      {content}
    </Modal>
  );
}
