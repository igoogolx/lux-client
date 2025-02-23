import { type MenuItemProps } from "@/components/Core";
import { DiagnosticsModal } from "@/components/Modal/DiagnosticsModal";
import { useTestDelay } from "@/hooks";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { proxiesSelectors, proxiesSlice, type RootState } from "@/reducers";
import splitArrayIntoChunks from "@/utils/splitArrayIntoChunks";
import {
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from "@fluentui/react-components";
import { MoreHorizontalFilled } from "@fluentui/react-icons";
import { type BaseProxy } from "lux-js-sdk";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

enum OperationTypeEnum {
  Diagnostics = "0",
  TestDelay = "1",
}

export function Operation(): React.ReactNode {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);

  const testDelay = useTestDelay();
  const proxies = useSelector<RootState, BaseProxy[]>(
    proxiesSelectors.selectAll,
  );

  const [isTestingDelay, setIsTestingDelay] = useState(false);

  const testDelays = async () => {
    setIsTestingDelay(true);
    try {
      proxies.forEach((item) => {
        dispatch(
          proxiesSlice.actions.updateOne({
            proxy: { id: item.id, delay: undefined },
          }),
        );
      });
      const subProxies = splitArrayIntoChunks(proxies);
      for (const element of subProxies) {
        await Promise.all(
          element.map(async (proxy) => {
            await testDelay(proxy.id);
          }),
        );
      }
    } finally {
      setIsTestingDelay(false);
    }
  };

  const openDiagnosticsDetail = () => {
    setIsDiagnosticsOpen(true);
  };

  const closeDiagnosticsModal = () => {
    setIsDiagnosticsOpen(false);
  };

  const menuItems: MenuItemProps[] = useMemo(() => {
    return [
      {
        id: OperationTypeEnum.TestDelay,
        content: t(TRANSLATION_KEY.CONNECTIVITY_TEST),
        disabled: isTestingDelay,
      },
      {
        id: OperationTypeEnum.Diagnostics,
        content: t(TRANSLATION_KEY.DIAGNOSTICS),
      },
    ];
  }, [t, isTestingDelay]);
  const onSelect = (id: string) => {
    switch (id) {
      case OperationTypeEnum.TestDelay:
        testDelays().catch((e) => {
          console.error(e);
        });
        return;
      case OperationTypeEnum.Diagnostics: {
        openDiagnosticsDetail();
        return;
      }
      default: {
        throw new Error(`invalid ${id}`);
      }
    }
  };

  return (
    <>
      {isDiagnosticsOpen && <DiagnosticsModal close={closeDiagnosticsModal} />}
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <Button icon={<MoreHorizontalFilled />} />
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            {menuItems.map((item) => (
              <MenuItem
                key={item.id}
                onClick={() => {
                  onSelect(item.id as string);
                }}
                disabled={item.disabled}
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
