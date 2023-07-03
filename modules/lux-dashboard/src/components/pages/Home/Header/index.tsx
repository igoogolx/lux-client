import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MenuItemProps, notifier } from "@/components/Core";
import { getRules, start, stop, updateSelectedRuleId } from "lux-js-sdk";
import { useDispatch, useSelector } from "react-redux";
import { selectedSlice } from "@/reducers/selected";
import { RootState, rulesSelectors, rulesSlice } from "@/reducers";
import { managerSlice } from "@/reducers/manager";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { Operation } from "@/components/pages/Home/Header/Operation";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Switch,
  Tooltip,
} from "@fluentui/react-components";
import { AddingOptions } from "./AddingOptions";
import styles from "./index.module.css";

export function Header(): JSX.Element {
  const { t } = useTranslation();
  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared
  );
  const isSwitchLoading = useSelector<RootState, boolean>(
    (state) => state.manager.isLoading
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
  const dispatch = useDispatch();
  const rules = useSelector(rulesSelectors.selectAll);
  const selectedRuleId = useSelector<RootState, string>(
    (state) => state.selected.rule
  );

  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    getRules().then((res) => {
      dispatch(rulesSlice.actions.received(res));
      dispatch(selectedSlice.actions.setRule({ id: res.selectedId }));
    });
  }, [dispatch]);

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
    [dispatch]
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
    } catch (e) {
      notifier.error((e as { message?: string }).message || "unknown error");
    } finally {
      dispatch(managerSlice.actions.setIsLoading({ isLoading: false }));
    }
  };

  const isSwitchDisabled = isSwitchLoading || !isProxyValid || isSettingRule;

  return (
    <div className={styles.wrapper}>
      <Operation />
      <AddingOptions className={styles.addButton} />
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton disabled={isStarted || isSettingRule}>
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
                  selectRule(item.id as string);
                }}
              >
                {item.content}
              </MenuItem>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>
      <Tooltip
        content={t(TRANSLATION_KEY.SWITCH_DISABLE_TIP)}
        relationship="description"
        visible={tooltipVisible && isSwitchDisabled}
        onVisibleChange={(_ev, data) => setTooltipVisible(data.visible)}
      >
        <Switch
          checked={isStarted}
          onChange={onSwitch}
          disabled={isSwitchDisabled}
        />
      </Tooltip>
    </div>
  );
}
