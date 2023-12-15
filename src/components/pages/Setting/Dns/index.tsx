import React, { useMemo } from 'react'
import { Card } from '@fluentui/react-components'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { setSetting, type SettingRes } from 'lux-js-sdk'
import { type RootState, settingSlice } from '@/reducers'
import { TRANSLATION_KEY } from '@/i18n/locales/key'
import styles from '../index.module.css'
import { notifier } from '../../../Core'
import EditDnsItem from './EditDnsItem'
import AddDnsOption from '@/components/pages/Setting/Dns/AddDnsOption'

const BOOST_DNS = [
  'tcp://114.114.114.114:53',
  'tcp://119.29.29.29:53',
  'dhcp://auto'
]

const REMOTE_DNS = [
  'tcp://8.8.8.8:53',
  'tcp://1.1.1.1:53',
  'https://dns.google/dns-query',
  'https://cloudflare-dns.com/dns-query'
]

const LOCAL_DNS = [
  'tcp://114.114.114.114:53',
  'tcp://119.29.29.29:53',
  'https://doh.pub/dns-query',
  'dhcp://auto'
]

export default function Dns () {
  const { t } = useTranslation()

  const setting = useSelector<RootState, SettingRes>((state) => state.setting)

  const remoteDnsOptions = useMemo(
    () => [...REMOTE_DNS, ...setting.dns.customizedOptions].map((item) => ({ content: item, id: item }))
    , [setting.dns.customizedOptions])

  const localDnsOptions = useMemo(
    () => [...LOCAL_DNS, ...setting.dns.customizedOptions].map((item) => ({ content: item, id: item }))
    , [setting.dns.customizedOptions])

  const boostDnsOptions = useMemo(
    () => [...BOOST_DNS, ...setting.dns.customizedOptions].map((item) => ({ content: item, id: item }))
    , [setting.dns.customizedOptions])

  const dispatch = useDispatch()

  const onSubmit = async (newDns: SettingRes['dns']) => {
    const newSetting = {
      ...setting,
      dns: newDns
    }

    await setSetting(newSetting)
    dispatch(settingSlice.actions.setSetting(newSetting))
    notifier.success(t(TRANSLATION_KEY.SAVE_SUCCESS))
  }

  return (
    <Card className={styles.card}>
      <AddDnsOption />
      <EditDnsItem
        items={remoteDnsOptions}
        onOptionSelect={(e, data) => {
          onSubmit({
            ...setting.dns,
            server: {
              ...setting.dns.server,
              remote: data.selectedOptions
            }
          })
        }}
        selectedOptions={setting.dns.server.remote}
        title={t(TRANSLATION_KEY.REMOTE_DNS_LABEL)}
        desc={t(TRANSLATION_KEY.REMOTE_DNS_DESC)}
      />

      <EditDnsItem
        items={localDnsOptions}
        onOptionSelect={(e, data) => {
          onSubmit({
            ...setting.dns,
            server: {
              ...setting.dns.server,
              local: data.selectedOptions
            }
          })
        }}
        selectedOptions={setting.dns.server.local}
        title={t(TRANSLATION_KEY.LOCAL_DNS_LABEL)}
        desc={t(TRANSLATION_KEY.LOCAL_DNS_DESC)}
      />
      <EditDnsItem
        items={boostDnsOptions}
        onOptionSelect={(e, data) => {
          onSubmit({
            ...setting.dns,
            server: {
              ...setting.dns.server,
              boost: data.selectedOptions
            }
          })
        }}
        selectedOptions={setting.dns.server.boost}
        title={t(TRANSLATION_KEY.BOOST_DNS_LABEL)}
        desc={t(TRANSLATION_KEY.BOOST_DNS_DESC)}
      />
    </Card>
  )
}
