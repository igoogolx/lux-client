import * as React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getCurProxy,
  type GetCurProxyRes,
  getRules,
  start,
  stop, subscribeRuntimeStatus,
  updateSelectedRuleId
} from 'lux-js-sdk'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  Caption1,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Switch,
  Tooltip
} from '@fluentui/react-components'
import {
  selectedSlice,
  type RootState,
  rulesSelectors,
  rulesSlice,
  managerSlice
} from '@/reducers'
import { TRANSLATION_KEY } from '@/i18n/locales/key'
import { isLocalAddr } from '@/utils/validator'
import { type MenuItemProps, notifier } from '../../../Core'
import { Operation } from './Operation'
import { AddingOptions } from './AddingOptions'
import styles from './index.module.css'
import { useMedia } from '@/hooks'

export function Header (): React.ReactNode {
  const { t } = useTranslation()
  const [curProxy, setCurProxy] = useState<GetCurProxyRes>({
    name: '',
    addr: ''
  })

  const isWideScreen = useMedia('(min-width: 640px)')

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared
  )
  const isSwitchLoading = useSelector<RootState, boolean>(
    (state) => state.manager.isLoading
  )
  const [isSettingRule, setIsSettingRule] = useState(false)
  const isProxyValid = useSelector<RootState, boolean>((state) => {
    if (state.setting.autoMode.enabled) {
      return true
    }
    if (state.selected.proxy) {
      if (state.proxies.ids.includes(state.selected.proxy)) {
        return true
      }
    }
    return false
  })
  const isDnsSettingValid = useSelector<RootState, boolean>((state) => {
    return state.setting.dns.server.remote.length <= 2 && state.setting.dns.server.local.length <= 2
  })
  const dispatch = useDispatch()
  const rules = useSelector(rulesSelectors.selectAll)
  const selectedRuleId = useSelector<RootState, string>(
    (state) => state.selected.rule
  )

  const [tooltipVisible, setTooltipVisible] = useState(false)

  useEffect(() => {
    getRules().then((res) => {
      dispatch(rulesSlice.actions.received(res))
      dispatch(selectedSlice.actions.setRule({ id: res.selectedId }))
    })

    const runtimeStatusSubscriber = subscribeRuntimeStatus({
      onMessage: (msg) => {
        setCurProxy({
          name: msg.name,
          addr: msg.addr
        })
        dispatch(
          managerSlice.actions.setIsStarted({ isStarted: msg.isStarted })
        )
      },
      onError: () => {
        runtimeStatusSubscriber.close()
      }
    })
  }, [dispatch, isSwitchLoading])

  const selectRule = useCallback(
    async (id: string) => {
      try {
        setIsSettingRule(true)
        await updateSelectedRuleId({ id })
        dispatch(selectedSlice.actions.setRule({ id }))
      } finally {
        setIsSettingRule(false)
      }
    },
    [dispatch]
  )

  const ruleItems = useMemo<MenuItemProps[]>(() => {
    return rules.map((rule) => ({
      id: rule.id,
      content: t(rule.id)
    }))
  }, [rules, t])

  const onSwitch = async () => {
    try {
      dispatch(managerSlice.actions.setIsLoading({ isLoading: true }))
      if (isStarted) {
        await stop()
      } else {
        await start()
      }
      dispatch(managerSlice.actions.setIsStarted({ isStarted: !isStarted }))
      if (!isStarted) {
        const latestProxy = await getCurProxy()
        if (isLocalAddr(latestProxy.addr)) {
          notifier.warn(t(TRANSLATION_KEY.PROXY_SERVER_MSG))
        }
        if (!isDnsSettingValid) {
          notifier.warn(t(TRANSLATION_KEY.DNS_SERVER_NUM_MSG))
        }
      }
    } catch (e) {
      notifier.error((e as { message?: string }).message ?? 'unknown error')
    } finally {
      dispatch(managerSlice.actions.setIsLoading({ isLoading: false }))
    }
  }

  const isSwitchDisabled = isSwitchLoading || !isProxyValid || isSettingRule

  return (
    <div className={styles.wrapper}>
      <div className={styles.actions}>
        <Operation />
        <AddingOptions className={styles.addButton} />
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <MenuButton
              disabled={isStarted || isSettingRule}
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
                    selectRule(item.id as string)
                  }}
                >
                  {item.content}
                </MenuItem>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
      <div>
        {isStarted && curProxy && isWideScreen && (
          <Caption1>{curProxy.name || curProxy.addr}</Caption1>
        )}
        <Tooltip
          content={t(TRANSLATION_KEY.SWITCH_DISABLE_TIP)}
          relationship="description"
          visible={tooltipVisible && isSwitchDisabled}
          onVisibleChange={(_ev, data) => { setTooltipVisible(data.visible) }}
        >
          <Switch
            checked={isStarted}
            onChange={onSwitch}
            disabled={isSwitchDisabled}
          />
        </Tooltip>
      </div>
    </div>
  )
}
