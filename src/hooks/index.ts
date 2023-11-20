import type * as React from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { Chart, type ChartConfiguration } from 'chart.js'
import { useDispatch } from 'react-redux'
import { getProxyDelay } from 'lux-js-sdk'
import { delaysSlice, proxiesSlice } from '@/reducers'
import { makeStyles } from '@fluentui/react-components'
import { tokens } from '@fluentui/react-theme'

export const useChartJs = (
  initialConfiguration: ChartConfiguration
): [React.RefObject<HTMLCanvasElement>, Chart | undefined] => {
  const chartRef = useRef<HTMLCanvasElement>(null)

  const chart = useRef<Chart>()

  useEffect(() => {
    if (chartRef.current && !chart.current) {
      const ctx = chartRef.current
      if (ctx) {
        chart.current = new Chart(ctx, initialConfiguration)
      }
    }
  }, [initialConfiguration])

  return [chartRef, chart.current]
}

export const useTestDelay = () => {
  const dispatch = useDispatch()
  return useCallback(
    async (id: string) => {
      dispatch(
        delaysSlice.actions.updateOne({
          delay: { id, loading: true }
        })
      )
      try {
        const res = await getProxyDelay({ id })
        dispatch(
          proxiesSlice.actions.updateOne({
            proxy: { id, delay: res.delay }
          })
        )
      } finally {
        dispatch(
          delaysSlice.actions.updateOne({
            delay: { id, loading: false }
          })
        )
      }
    },
    [dispatch]
  )
}

export const useOnMount = (fn: () => void) => {
  useEffect(fn, []); // eslint-disable-line
}

// https://usehooks.com/useLockBodyScroll/
export const useLockBodyScroll = () => {
  useLayoutEffect(() => {
    // Get original body overflow
    const originalStyle = window.getComputedStyle(document.body).overflow
    // Prevent scrolling on mount
    document.body.style.overflow = 'hidden'
    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [])
} // Empty array ensures effect is only run on mount and unmount

export const useDangerStyles = makeStyles({
  danger: {
    color: tokens.colorStatusDangerForeground1,
    borderTopColor: tokens.colorStatusDangerBorder1,
    borderLeftColor: tokens.colorStatusDangerBorder1,
    borderRightColor: tokens.colorStatusDangerBorder1,
    borderBottomColor: tokens.colorStatusDangerBorder1
  }
})
