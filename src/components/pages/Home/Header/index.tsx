import { TRANSLATION_KEY } from "@/i18n/locales/key";
import {
  managerSlice,
  type RootState,
  rulesSelectors,
  rulesSlice,
  selectedSlice,
} from "@/reducers";
import { isLocalAddr } from "@/utils/validator";
import {
  Caption1,
  InteractionTag,
  InteractionTagPrimary,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Switch,
  Tooltip,
} from "@fluentui/react-components";
import {
  getCurProxy,
  type GetCurProxyRes,
  getRules,
  type SettingRes,
  start,
  stop,
  subscribeRuntimeStatus,
  updateSelectedRuleId,
} from "lux-js-sdk";
import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { type MenuItemProps, notifier } from "../../../Core";
import { AddingOptions } from "./AddingOptions";
import styles from "./index.module.css";
import { Operation } from "./Operation";

export function Header(): React.ReactNode {
  const { t } = useTranslation();
  const [curProxy, setCurProxy] = useState<GetCurProxyRes>({
    name: "",
    addr: "",
  });

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared,
  );
  const isSwitchLoading = useSelector<RootState, boolean>(
    (state) => state.manager.isLoading,
  );
  const [isSettingRule, setIsSettingRule] = useState(false);
  const isProxyValid = useSelector<RootState, boolean>((state) => {
    if (state.setting.autoMode.enabled) {
      return true;
    }
    if (state.selected.proxy) {
      if (state.proxies.ids.includes(state.selected.proxy)) {
        return true;
      }
    }
    return false;
  });
  const isDnsSettingValid = useSelector<RootState, boolean>((state) => {
    return (
      state.setting.dns.server.remote.length <= 2 &&
      state.setting.dns.server.local.length <= 2
    );
  });
  const dispatch = useDispatch();
  const rules = useSelector(rulesSelectors.selectAll);
  const selectedRuleId = useSelector<RootState, string>(
    (state) => state.selected.rule,
  );

  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    getRules().then((res) => {
      dispatch(rulesSlice.actions.received(res));
      dispatch(selectedSlice.actions.setRule({ id: res.selectedId }));
    });

    const runtimeStatusSubscriber = subscribeRuntimeStatus({
      onMessage: (msg) => {
        setCurProxy({
          name: msg.name,
          addr: msg.addr,
        });
        dispatch(
          managerSlice.actions.setIsStarted({ isStarted: msg.isStarted }),
        );
      },
      onError: () => {
        runtimeStatusSubscriber.close();
      },
    });
  }, [dispatch, isSwitchLoading]);

  const selectRule = useCallback(
    async (id: string) => {
      try {
        setIsSettingRule(true);
        await updateSelectedRuleId({ id });
        dispatch(selectedSlice.actions.setRule({ id }));
      } finally {
        setIsSettingRule(false);
      }
    },
    [dispatch],
  );

  const ruleItems = useMemo<MenuItemProps[]>(() => {
    return rules.map((rule) => ({
      id: rule.id,
      content: t(rule.id),
    }));
  }, [rules, t]);

  const onSwitch = async () => {
    try {
      dispatch(managerSlice.actions.setIsLoading({ isLoading: true }));
      if (isStarted) {
        await stop();
      } else {
        await start();
      }
      dispatch(managerSlice.actions.setIsStarted({ isStarted: !isStarted }));
      if (!isStarted) {
        const latestProxy = await getCurProxy();
        if (isLocalAddr(latestProxy.addr)) {
          notifier.warn(t(TRANSLATION_KEY.PROXY_SERVER_MSG));
        }
        if (!isDnsSettingValid) {
          notifier.warn(t(TRANSLATION_KEY.DNS_SERVER_NUM_MSG));
        }
      }
    } finally {
      dispatch(managerSlice.actions.setIsLoading({ isLoading: false }));
    }
  };

  const isSwitchDisabled = isSwitchLoading || !isProxyValid || isSettingRule;

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  return (
    <div className={styles.wrapper}>
      <div className={styles.actions}>
        <Operation />
        <AddingOptions className={styles.addButton} />
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <MenuButton
              disabled={isSettingRule}
              className={styles.rulesDropdown}
            >
              {t(selectedRuleId)}
            </MenuButton>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {ruleItems.map((item) => (
                <MenuItem
                  disabled={item.disabled}
                  key={item.id}
                  icon={item.icon}
                  onClick={() => {
                    selectRule(item.id as string).catch((e) => {
                      console.log(e);
                    });
                  }}
                >
                  {item.content}
                </MenuItem>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>

        <Tooltip
          content={t(TRANSLATION_KEY.PROXY_MODE_TOOLTIP)}
          relationship="label"
        >
          <InteractionTag appearance="brand" className={styles.tag}>
            <InteractionTagPrimary>{`${
              setting.mode === "tun" ? "Tun" : "System"
            }`}</InteractionTagPrimary>
          </InteractionTag>
        </Tooltip>
        {setting.autoMode.enabled && (
          <Tooltip
            content={t(TRANSLATION_KEY.MODE_SELECT_TIP)}
            relationship="label"
          >
            <InteractionTag appearance="brand" className={styles.tag}>
              <InteractionTagPrimary>
                {t(TRANSLATION_KEY.MODE_SWITCH_LABEL)}
              </InteractionTagPrimary>
            </InteractionTag>
          </Tooltip>
        )}
      </div>
      <div className={"flex items-center justify-center"}>
        {curProxy && (
          <Caption1 className={"h-4"}>
            <span
              className={
                "max-w-32 overflow-auto text-ellipsis inline-block whitespace-nowrap"
              }
              title={curProxy.name || curProxy.addr}
            >
              {curProxy.name || curProxy.addr}
            </span>
          </Caption1>
        )}
        <Tooltip
          content={t(TRANSLATION_KEY.SWITCH_DISABLE_TIP)}
          relationship="description"
          visible={tooltipVisible && isSwitchDisabled}
          onVisibleChange={(_ev, data) => {
            setTooltipVisible(data.visible);
          }}
        >
          <Switch
            checked={isStarted}
            onChange={onSwitch}
            disabled={isSwitchDisabled}
          />
        </Tooltip>
      </div>
    </div>
  );
}
