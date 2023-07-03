import React, { useState } from "react";
import { addProxy, BaseProxy, ProxyTypeEnum } from "lux-js-sdk";
import { useDispatch } from "react-redux";
import { proxiesSlice } from "@/reducers";
import { EditModal } from "@/components/Modal/Proxy";
import { decode } from "@/utils/url/shadowsocks";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { parse as parseYaml } from "yaml";
import ClashConfigUrlModal from "@/components/Modal/ClashConfigUrlModal";
import {
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Tooltip,
} from "@fluentui/react-components";
import { AddFilled } from "@fluentui/react-icons";

enum OperationTypeEnum {
  Shadowsocks,
  Socks5,
  Clipboard,
  Http,
  CLASH,
  ClashUrl,
}

type AddingOptionsProps = {
  className?: string;
};

export function AddingOptions(props: AddingOptionsProps): JSX.Element {
  const { className } = props;
  const { t } = useTranslation();
  const [currentAddingType, setCurrentAddingType] =
    useState<ProxyTypeEnum | null>(null);
  const dispatch = useDispatch();

  const [isOpenClashUrlModal, setIsOpenClashUrlModal] = useState(false);

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
      content: t(TRANSLATION_KEY.CLIPBOARD_IMPORT),
    },
    {
      id: OperationTypeEnum.CLASH,
      content: t(TRANSLATION_KEY.CLASH_IMPORT),
    },
    {
      id: OperationTypeEnum.ClashUrl,
      content: t(TRANSLATION_KEY.CLASH_URL_IMPORT),
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
        const url = await navigator.clipboard.readText();
        const shadowsockses = decode(url);
        await Promise.all(
          shadowsockses.map(async (shadowsocks) => {
            const proxy = { ...shadowsocks, type: ProxyTypeEnum.Shadowsocks };
            const res = await addProxy({ proxy });
            dispatch(
              proxiesSlice.actions.addOne({ proxy: { ...proxy, id: res.id } })
            );
          })
        );
        break;
      }
      case OperationTypeEnum.CLASH: {
        const clashConfigText = await navigator.clipboard.readText();
        const clashConfig = parseYaml(clashConfigText) as {
          proxies: BaseProxy[];
        };
        await Promise.all(
          clashConfig.proxies.map(async (proxy) => {
            const res = await addProxy({ proxy });
            dispatch(
              proxiesSlice.actions.addOne({ proxy: { ...proxy, id: res.id } })
            );
          })
        );
        break;
      }
      case OperationTypeEnum.ClashUrl: {
        setIsOpenClashUrlModal(true);
        break;
      }
      default: {
        throw new Error(`invalid ${id}`);
      }
    }
  };

  return (
    <div className={className}>
      {isOpenClashUrlModal && (
        <ClashConfigUrlModal
          close={() => {
            setIsOpenClashUrlModal(false);
          }}
        />
      )}
      {currentAddingType && (
        <EditModal close={closeAddingModal} type={currentAddingType} />
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
                  onSelect(item.id as OperationTypeEnum);
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
