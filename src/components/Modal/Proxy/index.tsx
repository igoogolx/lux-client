import ProxyTextModal from "@/components/Modal/Proxy/ProxyTextModal";
import SubscriptionUrlModal from "@/components/Modal/Proxy/SubscriptionUrlModal";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { OtherProxyTypeEnum } from "@/utils/constants";
import { Dropdown, Option, Text } from "@fluentui/react-components";
import {
  type BaseProxy,
  type Http,
  ProxyTypeEnum,
  type Shadowsocks,
  type Socks5,
} from "lux-js-sdk";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../../Core";
import { EditHttpModal } from "./EditHttpModal";
import { EditShadowsocksModal } from "./EditShadowsocksModal";
import { PageStepEnum } from "./EditShadowsocksModal/constant";
import { EditSocks5Modal } from "./EditSocks5Modal";
import styles from "./index.module.css";

interface EditModalProps {
  close: () => void;
  type: BaseProxy["type"] | OtherProxyTypeEnum;
  initialValue?: BaseProxy;
  isSelected?: boolean;
}

export function EditModal(props: Readonly<EditModalProps>) {
  const { type, close, initialValue, isSelected = false } = props;
  let content = null;

  const { t } = useTranslation();

  const typeOption = {
    [ProxyTypeEnum.Shadowsocks]: "Shadowsocks",
    [ProxyTypeEnum.Http]: "Http",
    [ProxyTypeEnum.Socks5]: "Socks5",
    [OtherProxyTypeEnum.Subscription]: t(TRANSLATION_KEY.SUBSCRIPTION_URL),
    [OtherProxyTypeEnum.Text]: t(TRANSLATION_KEY.PROXY_TEXT),
  };

  const isEdit = !!initialValue;

  let titleI18nKey = "";

  const [currentType, setCurrentType] = useState(type);

  const [pageStep, setPageStep] = useState(PageStepEnum.First);

  switch (currentType) {
    case ProxyTypeEnum.Shadowsocks:
      titleI18nKey = isEdit
        ? TRANSLATION_KEY.EDIT_SHADOWSOCKS
        : TRANSLATION_KEY.NEW_SHADOWSOCKS;
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
      titleI18nKey = isEdit
        ? TRANSLATION_KEY.EDIT_SOCKS5
        : TRANSLATION_KEY.NEW_SOCKS5;
      content = (
        <EditSocks5Modal
          close={close}
          initialValue={initialValue as Socks5}
          isSelected={isSelected}
        />
      );
      break;
    case ProxyTypeEnum.Http:
      titleI18nKey = isEdit
        ? TRANSLATION_KEY.EDIT_HTTP
        : TRANSLATION_KEY.NEW_HTTP;
      content = (
        <EditHttpModal
          close={close}
          initialValue={initialValue as Http}
          isSelected={isSelected}
        />
      );
      break;
    case OtherProxyTypeEnum.Subscription:
      titleI18nKey = TRANSLATION_KEY.NEW_IMPORT_SUBSCRIPTION_URL;
      content = <SubscriptionUrlModal close={close} />;
      break;

    case OtherProxyTypeEnum.Text:
      titleI18nKey = TRANSLATION_KEY.NEW_IMPORT_PROXY_TEXT;
      content = <ProxyTextModal close={close} />;
      break;
    default: {
      throw new Error(`invalid ${type}`);
    }
  }
  return (
    <Modal close={close} hideCloseButton hideOkButton title={t(titleI18nKey)}>
      {pageStep === PageStepEnum.First && (
        <div className={styles.type}>
          <Text>{t(TRANSLATION_KEY.TYPE)}</Text>
          <Dropdown
            disabled={isEdit}
            defaultValue={typeOption[currentType]}
            onOptionSelect={(_, data) => {
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
