import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type Log } from 'lux-js-sdk'

const MAX_LOG_NUM = 100

const initialState: { logs: Log[] } = { logs: [] }

export const loggerSlice = createSlice({
  name: 'logger',
  initialState,
  reducers: {
    pushLog (state, action: PayloadAction<Log>) {
      state.logs = [...state.logs, action.payload].slice(-MAX_LOG_NUM)
    }
  }
})
