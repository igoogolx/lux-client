import { configureStore } from '@reduxjs/toolkit'
import { testUdpSlice } from './testUdp'
import { settingSlice } from './setting'
import { loggerSlice } from './logger'
import { generalSlice } from './general'
import { proxiesSlice } from './proxy'
import { selectedSlice } from './selected'
import { rulesSlice } from './rule'
import { delaysSlice } from './delay'
import { trafficsSlice } from './traffics'
import { managerSlice } from './manager'

export const store = configureStore({
  reducer: {
    proxies: proxiesSlice.reducer,
    selected: selectedSlice.reducer,
    rules: rulesSlice.reducer,
    delays: delaysSlice.reducer,
    traffics: trafficsSlice.reducer,
    manager: managerSlice.reducer,
    setting: settingSlice.reducer,
    logger: loggerSlice.reducer,
    general: generalSlice.reducer,
    testUdp: testUdpSlice.reducer
  }
})

export type RootState = ReturnType<typeof store.getState>
