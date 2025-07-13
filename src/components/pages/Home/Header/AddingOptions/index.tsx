import ProxyTextModal from "@/components/Modal/ProxyTextModal";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import {
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from "@fluentui/react-components";
import { AddFilled } from "@fluentui/react-icons";
import { ProxyTypeEnum } from "lux-js-sdk";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { EditModal } from "../../../../Modal/Proxy";
import SubscriptionUrlModal from "../../../../Modal/SubscriptionUrlModal";

enum OperationTypeEnum {
  Shadowsocks,
  Socks5,
  Clipboard,
  Http,
  SubscriptionUrl,
}

interface AddingOptionsProps {
  className?: string;
}

export function AddingOptions(
  props: Readonly<AddingOptionsProps>,
): React.ReactNode {
  const { className } = props;
  const { t } = useTranslation();
  const [currentAddingType, setCurrentAddingType] =
    useState<ProxyTypeEnum | null>(null);

  const [isOpenSubscriptionUrlModal, setIsOpenSubscriptionUrlModal] =
    useState(false);

  const [isOpenProxyTextModal, setIsOpenProxyTextModal] = useState(false);

  const closeAddingModal = () => {
    setCurrentAddingType(null);
  };

  const items = [
    {
      id: OperationTypeEnum.Shadowsocks,
      content: t(TRANSLATION_KEY.SHADOWSOCKS),
    },
    { id: OperationTypeEnum.Socks5, content: t(TRANSLATION_KEY.SOCKS5) },
    {
      id: OperationTypeEnum.Http,
      content: t(TRANSLATION_KEY.HTTP),
    },
    {
      id: OperationTypeEnum.Clipboard,
      content: t(TRANSLATION_KEY.PROXY_TEXT_IMPORT),
    },
    {
      id: OperationTypeEnum.SubscriptionUrl,
      content: t(TRANSLATION_KEY.SUBSCRIPTION_URL_IMPORT),
    },
  ];

  const onSelect = async (id: OperationTypeEnum) => {
    switch (id) {
      case OperationTypeEnum.Shadowsocks:
        setCurrentAddingType(ProxyTypeEnum.Shadowsocks);
        break;
      case OperationTypeEnum.Socks5:
        setCurrentAddingType(ProxyTypeEnum.Socks5);
        break;
      case OperationTypeEnum.Http:
        setCurrentAddingType(ProxyTypeEnum.Http);
        break;
      case OperationTypeEnum.Clipboard: {
        setIsOpenProxyTextModal(true);
        break;
      }
      case OperationTypeEnum.SubscriptionUrl: {
        setIsOpenSubscriptionUrlModal(true);
        break;
      }
      default: {
        throw new Error("invalid id");
      }
    }
  };

  return (
    <div className={className}>
      {isOpenSubscriptionUrlModal && (
        <SubscriptionUrlModal
          close={() => {
            setIsOpenSubscriptionUrlModal(false);
          }}
        />
      )}
      {currentAddingType != null && (
        <EditModal close={closeAddingModal} type={currentAddingType} />
      )}

      {isOpenProxyTextModal && (
        <ProxyTextModal
          close={() => {
            setIsOpenProxyTextModal(false);
          }}
        />
      )}
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <Button icon={<AddFilled />} />
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            {items.map((item) => (
              <MenuItem
                key={item.id}
                onClick={() => {
                  onSelect(item.id);
                }}
              >
                {item.content}
              </MenuItem>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
}
