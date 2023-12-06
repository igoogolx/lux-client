import type * as React from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Chart, type ChartConfiguration } from 'chart.js'
import { useDispatch } from 'react-redux'
import { getProxyDelay } from 'lux-js-sdk'
import { delaysSlice, proxiesSlice } from '@/reducers'
import { makeStyles } from '@fluentui/react-components'
import { tokens } from '@fluentui/react-theme'
import checkForUpdate from '@/utils/checkForUpdate'
import { notifier } from '@/components/Core'
import { TRANSLATION_KEY } from '@/i18n/locales/key'
import { useTranslation } from 'react-i18next'
import { LAST_CHECK_UPDATE_DATE, LATEST_RELEASE_URL } from '@/utils/constants'

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

export const useMedia = (query: string, defaultState?: boolean) => {
  const [state, setState] = useState(defaultState)

  useEffect(() => {
    let mounted = true
    const mql = window.matchMedia(query)
    const onChange = () => {
      if (!mounted) {
        return
      }
      setState(mql.matches)
    }

    mql.addEventListener('change', onChange)
    setState(mql.matches)

    return () => {
      mounted = false
      mql.removeEventListener('change', onChange)
    }
  }, [query])

  return state
}

export const useCheckForUpdate = () => {
  const { t } = useTranslation()
  return useCallback(async () => {
    const curDate = new Date().toDateString()
    const lastCheckUpdateDate = localStorage.getItem(LAST_CHECK_UPDATE_DATE)
    if (curDate === lastCheckUpdateDate) {
      return
    }
    const checkedResult = await checkForUpdate()
    if (checkedResult) {
      localStorage.setItem(LAST_CHECK_UPDATE_DATE, curDate)
      notifier.success(t(TRANSLATION_KEY.NEW_VERSION_INFO), [{
        text: t(TRANSLATION_KEY.GO),
        onClick: () => {
          window.open(LATEST_RELEASE_URL)
        }
      }])
    }
  }, [t])
}
