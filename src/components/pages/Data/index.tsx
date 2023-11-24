import React, { useState } from 'react'
import { Tab, TabList } from '@fluentui/react-components'
import Dashboard from '@/components/pages/Dashboard'
import Connections from '@/components/pages/Connections'
import { useTranslation } from 'react-i18next'
import { TRANSLATION_KEY } from '@/i18n/locales/key'

enum DATA_TAB {
  Dashboard = 'dashboard',
  Connections = 'connections'
}

export default function Data () {
  const [selectedValue, setSelectedValue] = useState(DATA_TAB.Dashboard)
  const { t } = useTranslation()

  return <>
    <TabList selectedValue={selectedValue} onTabSelect={(event, data) => {
      setSelectedValue(data.value as DATA_TAB)
    }}>
      <Tab id={DATA_TAB.Dashboard} value={DATA_TAB.Dashboard}>
        {t(TRANSLATION_KEY.STATISTICS)}
      </Tab>
      <Tab id={DATA_TAB.Connections} value={DATA_TAB.Connections}>
        {t(TRANSLATION_KEY.NAV_CONNECTION)}
      </Tab>
    </TabList>
    {selectedValue === DATA_TAB.Dashboard ? <Dashboard /> : <Connections />}
  </>
}
