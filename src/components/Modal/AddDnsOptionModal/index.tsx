import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { type TableColumnDefinition } from '@fluentui/react-table'
import { Button, createTableColumn, Input, TableCellLayout, Tooltip } from '@fluentui/react-components'
import { TRANSLATION_KEY } from '@/i18n/locales/key'
import { getSetting, setSetting, type SettingRes } from 'lux-js-sdk'
import { t } from 'i18next'
import { Modal, notifier, Table } from '@/components/Core'
import styles from './index.module.css'
import { DeleteRegular } from '@fluentui/react-icons'
import { useDispatch, useSelector } from 'react-redux'
import { type RootState, settingSlice } from '@/reducers'

interface AddDnsOptionModalProps {
  close: () => void
}

interface DnsOption {
  type: string
  payload: string
  value: string
}

const VALID_DNS_PREFIXES = ['dhcp://', 'https://', 'udp://', 'tcp://']

export default function AddDnsOptionModal (props: AddDnsOptionModalProps) {
  const { close } = props

  const [newDnsOption, setNewDnsOption] = useState('')
  const setting = useSelector<RootState, SettingRes>((state) => state.setting)
  const dispatch = useDispatch()

  const refresh = useCallback(async () => {
    getSetting().then(res => {
      dispatch(settingSlice.actions.setSetting(res))
    })
  }, [dispatch])

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleDeleteCustomizedOption = useCallback(async (option: DnsOption) => {
    const newDns = { ...setting.dns, server: { ...setting.dns.server } }
    newDns.customizedOptions = setting.dns.customizedOptions.filter(item => item !== option.value)
    newDns.server.remote = setting.dns.server.remote.filter(item => item !== option.value)
    newDns.server.local = setting.dns.server.local.filter(item => item !== option.value)
    newDns.server.boost = setting.dns.server.boost.filter(item => item !== option.value)
    const newSetting = {
      ...setting,
      dns: newDns
    }
    await setSetting(newSetting)
    dispatch(settingSlice.actions.setSetting(newSetting))
    notifier.success(t(TRANSLATION_KEY.SAVE_SUCCESS))
    await refresh()
  }, [dispatch, refresh, setting])

  const handleAddCustomizedOption = useCallback(async () => {
    if (!VALID_DNS_PREFIXES.some(prefix => newDnsOption.startsWith(prefix))) {
      notifier.error(`${t(TRANSLATION_KEY.INVALID_DNS_PREFIX)} ${VALID_DNS_PREFIXES.join(',')}`)
      return
    }
    const newSetting = {
      ...setting,
      dns: { ...setting.dns, customizedOptions: [...setting.dns.customizedOptions, newDnsOption] }
    }
    await setSetting(newSetting)
    dispatch(settingSlice.actions.setSetting(newSetting))
    notifier.success(t(TRANSLATION_KEY.SAVE_SUCCESS))
    await refresh()
  }, [setting, newDnsOption, dispatch, refresh])

  const data = useMemo(() => {
    return setting.dns.customizedOptions.map(option => {
      try {
        const [type, payload] = option.split('://')
        return { type, payload, value: option }
      } catch (e) {
        return null
      }
    }).filter(Boolean) as DnsOption[]
  }, [setting.dns.customizedOptions])

  const columns = useMemo<Array<TableColumnDefinition<DnsOption>>>(() => {
    return [
      createTableColumn<DnsOption>({
        columnId: 'type',
        renderHeaderCell: () => {
          return t(TRANSLATION_KEY.TYPE)
        },
        renderCell: (item) => {
          return <TableCellLayout truncate>{item.type}</TableCellLayout>
        }
      }),
      createTableColumn<DnsOption>({
        columnId: 'payload',
        renderHeaderCell: () => {
          return t(TRANSLATION_KEY.PAYLOAD)
        },
        renderCell: (item) => {
          return <TableCellLayout truncate>{item.payload}</TableCellLayout>
        }
      }),
      createTableColumn<DnsOption>({
        columnId: 'action',
        renderHeaderCell: () => {
          return ''
        },
        renderCell: (item: DnsOption) => {
          return (
            <TableCellLayout truncate>
              <div
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <Button icon={<DeleteRegular />} onClick={() => {
                  handleDeleteCustomizedOption(item)
                }} />
              </div>
            </TableCellLayout>
          )
        }
      })

    ].filter(Boolean) as Array<TableColumnDefinition<DnsOption>>
  }, [handleDeleteCustomizedOption])
  return <Modal close={close} hideCloseButton={true}>
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <Input
          value={newDnsOption}
          onChange={(e) => {
            setNewDnsOption(e.target.value.trim())
          }}
          placeholder={t(TRANSLATION_KEY.DNS_OPTION_TIP)}
          className={styles.input}
        />
        <div className={styles.actions}>
          {
            <Tooltip
              content={t(TRANSLATION_KEY.ADD_RULE)}
              relationship="description"
            >
              <Button
                appearance={'primary'}
                onClick={handleAddCustomizedOption}
                className={styles.closeAll}
              >
                {t(TRANSLATION_KEY.ADD)}
              </Button>
            </Tooltip>
          }

        </div>
      </div>
      <Table
        columns={columns}
        data={data}
        sortable
      />
    </div>
  </Modal>
}
