import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export const managerSlice = createSlice({
  name: 'manager',
  initialState: { isStared: false, isLoading: false },
  reducers: {
    setIsStarted (state, action: PayloadAction<{ isStarted: boolean }>) {
      state.isStared = action.payload.isStarted
    },
    setIsLoading (state, action: PayloadAction<{ isLoading: boolean }>) {
      state.isLoading = action.payload.isLoading
    }
  }
})
