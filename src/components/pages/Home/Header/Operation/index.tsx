import { useTestDelay } from "@/hooks";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { proxiesSelectors, proxiesSlice, type RootState } from "@/reducers";
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
import splitArrayIntoChunks from "../../../../../utils/splitArrayIntoChunks";
import { type MenuItemProps } from "../../../../Core";
import { RuntimeDetailModal } from "../../../../Modal/RuntimeDetailModal";

enum OperationTypeEnum {
  RuntimeDetail = "0",
  TestDelay = "1",
  DeleteAllProxies = "2",
}

export function Operation(): React.ReactNode {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isRuntimeDetailOpen, setIsRuntimeDetailOpen] = useState(false);

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared,
  );

  const testDelay = useTestDelay();
  const proxies = useSelector<RootState, BaseProxy[]>(
    proxiesSelectors.selectAll,
  );

  const [isTestingDealy, setIsTestingDealy] = useState(false);

  const testDelays = async () => {
    setIsTestingDealy(true);
    try {
      proxies.forEach((item) => {
        dispatch(
          proxiesSlice.actions.updateOne({
            proxy: { id: item.id, delay: undefined },
          }),
        );
      });
      const subProxies = splitArrayIntoChunks(proxies);
      for (let i = 0; i < subProxies.length; i += 1) {
        await Promise.all(
          subProxies[i].map(async (proxy) => {
            await testDelay(proxy.id);
          }),
        );
      }
    } finally {
      setIsTestingDealy(false);
    }
  };

  const openRuntimeDetail = () => {
    setIsRuntimeDetailOpen(true);
  };

  const closeRuntimeDetail = () => {
    setIsRuntimeDetailOpen(false);
  };

  const menuItems: MenuItemProps[] = useMemo(() => {
    return [
      {
        id: OperationTypeEnum.TestDelay,
        content: t(TRANSLATION_KEY.CONNECTIVITY_TEST),
        disabled: isTestingDealy,
      },
      {
        id: OperationTypeEnum.RuntimeDetail,
        content: t(TRANSLATION_KEY.COMMON_RUNTIME_DETAIL),
        disabled: !isStarted,
      },
    ];
  }, [isStarted, t, isTestingDealy]);
  const onSelect = (id: string) => {
    switch (id) {
      case OperationTypeEnum.TestDelay:
        testDelays();
        return;
      case OperationTypeEnum.RuntimeDetail: {
        openRuntimeDetail();
        return;
      }
      default: {
        throw new Error(`invalid ${id}`);
      }
    }
  };

  return (
    <>
      {isRuntimeDetailOpen && <RuntimeDetailModal close={closeRuntimeDetail} />}
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
