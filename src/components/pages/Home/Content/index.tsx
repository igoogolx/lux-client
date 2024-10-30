import * as React from 'react'
import { useEffect, useMemo, useRef } from 'react'
import {
  type BaseProxy,
  getProxies,
  type SettingRes,
  updateSelectedProxyId
} from 'lux-js-sdk'
import { useDispatch, useSelector } from 'react-redux'
import {
  createTableColumn,
  type DataGridProps,
  TableCellLayout,
  type TableColumnDefinition
} from '@fluentui/react-components'
import {
  proxiesSelectors,
  proxiesSlice,
  type RootState,
  selectedSlice
} from '@/reducers'
import ProxyCard, { LOCAL_SERVERS } from './ProxyCard'
import { Operation } from './ProxyCard/Operation'
import { DelayTag } from './ProxyCard/DelayTag'
import styles from './index.module.css'

export function Content (): React.ReactNode {
  const proxies = useSelector(proxiesSelectors.selectAll)

  const proxyMap = useMemo(() => {
    const res: Record<string, BaseProxy[]> = {}
    proxies.forEach((proxy) => {
      if (proxy.subscriptionUrl) {
        res[proxy.subscriptionUrl] = [...(res[proxy.subscriptionUrl] || []), proxy]
      } else {
        res[LOCAL_SERVERS] = [...(res[LOCAL_SERVERS] || []), proxy]
      }
    })
    return res
  }, [proxies])

  const selectedId = useSelector<RootState, string>(
    (state) => state.selected.proxy
  )
  const dispatch = useDispatch()
  useEffect(() => {
    getProxies().then((data) => {
      dispatch(proxiesSlice.actions.received(data))
      dispatch(selectedSlice.actions.setProxy({ id: data.selectedId }))
    })
  }, [dispatch])

  const columns: Array<TableColumnDefinition<BaseProxy>> = [
    createTableColumn<BaseProxy>({
      columnId: 'name',
      renderHeaderCell: () => {
        return ''
      },
      renderCell: (item) => {
        return (
          <TableCellLayout truncate>
            <div className={styles.desc}>
              <span className={styles.name}>
                {item.name || `${item.server}:${item.port}`}
              </span>
              <span className={styles.type}>{item.type}</span>
            </div>
          </TableCellLayout>
        )
      }
    }),
    createTableColumn<BaseProxy>({
      columnId: 'action',
      renderHeaderCell: () => {
        return ''
      },
      renderCell: (item) => {
        return (
          <TableCellLayout truncate className={styles.action}>
            <div
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <DelayTag id={item.id} value={item.delay} />
              <Operation proxy={item} />
            </div>
          </TableCellLayout>
        )
      }
    })
  ]

  const defaultSelectedItems = React.useMemo(
    () => new Set([selectedId]),
    [selectedId]
  )

  // TODO:optimize selector
  const setting = useSelector<RootState, SettingRes>((state) => state.setting)

  const isAutoMode = setting.autoMode.enabled

  const handleSelect: DataGridProps['onSelectionChange'] = async (_, data) => {
    if (!isAutoMode) {
      const id = data.selectedItems.values().next().value
      if (typeof id === 'string') {
        await updateSelectedProxyId({ id })
        dispatch(selectedSlice.actions.setProxy({ id }))
      }
    }
  }

  const preProxiesLength = useRef(proxies.length)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current &&
        preProxiesLength.current !== 0 &&
        proxies.length > preProxiesLength.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
    preProxiesLength.current = proxies.length
  }, [proxies.length])

  return (
    <div className={styles.wrapper} ref={listRef}>
      {Object.keys(proxyMap).map((key) => {
        return (
          <ProxyCard
            key={key}
            columns={columns}
            data={proxyMap[key]}
            selectionMode={isAutoMode ? undefined : 'single'}
            onSelectionChange={handleSelect}
            selectedItems={defaultSelectedItems}
            url={key}
          />
        )
      })}
    </div>
  )
}
