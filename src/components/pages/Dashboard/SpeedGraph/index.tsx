import * as React from 'react'
import { useEffect } from 'react'
import { type ChartConfiguration } from 'chart.js'
import i18next from 'i18next'
import { type TrafficItem } from 'lux-js-sdk'
import { convertByte } from '@/utils/traffic'
import { TRANSLATION_KEY } from '@/i18n/locales/key'
import { useChartJs } from '@/hooks'

const getConfiguration = () => {
  const configuration: ChartConfiguration = {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: i18next.t(TRANSLATION_KEY.DOWNLOAD),
          borderColor: '#22ce70',
          borderWidth: 1.5,
          fill: false,
          pointRadius: 0,
          data: [],
          tension: 0.2
        },
        {
          label: i18next.t(TRANSLATION_KEY.UPLOAD),
          borderColor: '#ff6573',
          borderWidth: 1,
          fill: false,
          pointRadius: 0,
          data: [],
          tension: 0.2
        }
      ]
    },

    options: {
      animation: {},
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            display: false
          }
        },
        y: {
          border: { width: 0, dash: [5, 5] },
          grid: {
            color: '#50585b'
          },
          ticks: {
            callback: (value: number | string) => {
              const { value: convertedValue, unit } = convertByte(
                value as number
              )
              return convertedValue + unit
            },
            autoSkip: true,
            maxTicksLimit: 6
          }
        }
      }
    }
  }
  return configuration
}

interface SpeedGraphProps {
  data: { proxy: TrafficItem[], direct: TrafficItem[] }
}

export function SpeedGraph (props: SpeedGraphProps): React.ReactNode {
  const { data } = props

  const [chartRef, chart] = useChartJs(getConfiguration())
  useEffect(() => {
    if (chart) {
      chart.data.labels = data.proxy.map((t, index) => index)
      if (chart.data.datasets) {
        chart.data.datasets[0].data = data.proxy.map(
          (traffic) => traffic.upload + traffic.download
        )
        chart.data.datasets[1].data = data.direct.map(
          (traffic) => traffic.upload + traffic.download
        )
      }
      chart.update('none')
    }
  }, [chart, data])

  return <canvas ref={chartRef} />
}
