import React, { useEffect, useState } from 'react'
import HijackDns from '@/components/pages/Setting/HijackDns'
import { getRuntimeOS, type SettingRes } from 'lux-js-sdk'
import Mode from '@/components/pages/Setting/Mode'
import { useSelector } from 'react-redux'
import { type RootState } from '@/reducers'
import DefaultInterface from './DefaultInterface'
import AutoMode from './AutoMode'
import LocalHttpServer from './LocalHttpServer'
import Dns from './Dns'
import ConfigFile from './ConfigFile'
import BlockQuic from '@/components/pages/Setting/BlockQuic'
import Stack from '@/components/pages/Setting/Stack'
import Language from '@/components/pages/Setting/Language'
import ShouldFindProcess from '@/components/pages/Setting/ShouldFindProcess'

export function SettingForm () {
  const [os, setOs] = useState('')
  useEffect(() => {
    getRuntimeOS().then((res) => {
      setOs(res.os)
    })
  }, [])

  const setting = useSelector<RootState, SettingRes>((state) => state.setting)

  const isTun = setting.mode === 'tun'

  return (
    <div>
      <div>
        <Language />
        <Mode />
        {isTun && <Stack />}
        {isTun && <Dns />}
        {isTun && <BlockQuic />}
        {os === 'darwin' && isTun && <HijackDns />}
        {isTun && <DefaultInterface />}
        <LocalHttpServer />
        <AutoMode />
        {isTun && <ShouldFindProcess />}
        <ConfigFile />
      </div>
    </div>
  )
}
