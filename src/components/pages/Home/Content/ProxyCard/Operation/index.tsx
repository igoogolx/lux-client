import { type MenuItemProps, notifier } from "@/components/Core";
import { useDangerStyles, useTestDelay } from "@/hooks";
import { proxiesSlice, type RootState, selectedSlice } from "@/reducers";
import {
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from "@fluentui/react-components";
import {
  ClipboardRegular,
  DeleteRegular,
  DeviceEqRegular,
  EditRegular,
  InfoRegular,
  QrCodeFilled,
  SendRegular,
} from "@fluentui/react-icons";
import {
  type BaseProxy,
  deleteProxies,
  ProxyTypeEnum,
  type Shadowsocks,
} from "lux-js-sdk";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { EditModal } from "@/components/Modal/Proxy";
import { QrCodeModal } from "@/components/Modal/QrCodeModal";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { useTestUdp } from "@/utils/testUdp";
import { encode } from "@/utils/url";

interface OperationProps {
  proxy: BaseProxy;
}

enum OperationTypeEnum {
  Edit = "edit",
  Delete = "delete",
  CopyUrl = "copyUrl",
  Test = "test",
  QrCode = "qrCode",
  TestUdp = "testUdp",
}

export function Operation(props: Readonly<OperationProps>): React.ReactNode {
  const { t } = useTranslation();
  const { proxy } = props;
  const { id: proxyId } = proxy;

  const inlineStyles = useDangerStyles();

  const [isEditingDialogOpen, setIsEditingDialogOpen] = useState(false);
  const [isQrcodeModalOpen, setIsQrcodeModalOpen] = useState(false);
  const dispatch = useDispatch();
  const testDelay = useTestDelay();
  const testUdp = useTestUdp();
  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared,
  );
  const isSwitchLoading = useSelector<RootState, boolean>(
    (state) => state.manager.isLoading,
  );
  const isSelected = useSelector<RootState, boolean>(
    (state) => state.selected.proxy === proxyId,
  );
  const menuItems: MenuItemProps[] = useMemo(() => {
    let items: MenuItemProps[] = [
      {
        id: OperationTypeEnum.Test,
        content: t(TRANSLATION_KEY.CONNECTIVITY_TEST),
        icon: <DeviceEqRegular />,
      },
      {
        id: OperationTypeEnum.TestUdp,
        content: t(TRANSLATION_KEY.COMMON_TEST_UDP),
        icon: <SendRegular />,
      },
      {
        id: OperationTypeEnum.Delete,
        content: t(TRANSLATION_KEY.COMMON_DELETE),
        icon: <DeleteRegular />,
        disabled: (isStarted || isSwitchLoading) && isSelected,
        isDanger: true,
        isDivider: true,
      },
    ];
    if (
      ![
        ProxyTypeEnum.Shadowsocks as BaseProxy["type"],
        ProxyTypeEnum.Http,
        ProxyTypeEnum.Socks5,
      ].includes(proxy.type)
    ) {
      return items;
    }
    items = [
      {
        id: OperationTypeEnum.Edit,
        content: t(TRANSLATION_KEY.COMMON_EDIT),
        icon: <EditRegular />,
      },
      ...items,
    ];
    if (proxy.type === ProxyTypeEnum.Shadowsocks) {
      items = [
        {
          id: OperationTypeEnum.CopyUrl,
          content: t(TRANSLATION_KEY.COMMON_COPY_URL),
          icon: <ClipboardRegular />,
        },
        {
          id: OperationTypeEnum.QrCode,
          content: t(TRANSLATION_KEY.COMMON_QR_CODE),
          icon: <QrCodeFilled />,
        },
        ...items,
      ];
    }
    return items;
  }, [isSelected, isStarted, isSwitchLoading, proxy.type, t]);
  const onSelect = async (id: string) => {
    switch (id) {
      case OperationTypeEnum.Edit:
        setIsEditingDialogOpen(true);
        return;
      case OperationTypeEnum.Delete: {
        await deleteProxies({ ids: [proxy.id] });
        dispatch(proxiesSlice.actions.deleteOne({ id: proxyId }));
        if (isSelected) {
          dispatch(selectedSlice.actions.setProxy({ id: "" }));
        }
        notifier.success(t(TRANSLATION_KEY.DELETED));
        return;
      }
      case OperationTypeEnum.Test: {
        await testDelay(proxyId);
        return;
      }
      case OperationTypeEnum.TestUdp: {
        await testUdp(proxyId);
        return;
      }
      case OperationTypeEnum.CopyUrl: {
        const url = encode(proxy as Shadowsocks);
        await navigator.clipboard.writeText(url);
        notifier.success(t(TRANSLATION_KEY.COPIED));
        return;
      }
      case OperationTypeEnum.QrCode: {
        setIsQrcodeModalOpen(true);
        return;
      }
      default: {
        throw new Error(`invalid ${id}`);
      }
    }
  };

  return (
    <>
      {isQrcodeModalOpen && (
        <QrCodeModal
          url={encode(proxy as Shadowsocks)}
          close={() => {
            setIsQrcodeModalOpen(false);
          }}
        />
      )}
      {isEditingDialogOpen && (
        <EditModal
          close={() => {
            setIsEditingDialogOpen(false);
          }}
          initialValue={proxy}
          type={proxy.type as ProxyTypeEnum}
          isSelected={isSelected}
        />
      )}
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <Button
            appearance="transparent"
            icon={<InfoRegular />}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          />
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            {menuItems.map((item) => (
              <MenuItem
                className={item.isDanger ? inlineStyles.danger : ""}
                disabled={item.disabled}
                key={item.id}
                icon={item.icon}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onSelect(item.id as string);
                }}
              >
                {item.content}
              </MenuItem>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>
    </>
  );
}
