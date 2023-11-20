import React from 'react'
import { type TrafficItem } from 'lux-js-sdk'
import { useTranslation } from 'react-i18next'
import { TRANSLATION_KEY } from '@/i18n/locales/key'
import { Icon, IconNameEnum } from '../../../../Core'
import { FlowText, FlowTextTypeEnum } from '../FlowText'
import styles from './index.module.css'

interface FlowInfoProps {
  current: TrafficItem
  total: TrafficItem
}

export default function FlowInfo (props: FlowInfoProps) {
  const { current, total } = props
  const { t } = useTranslation()
  return (
    <div className={styles.flowInfo}>
      <div className={styles.item}>
        <div className={styles.title}>{t(TRANSLATION_KEY.SPEED)}</div>
        <div className={styles.details}>
          <div className={styles.detail}>
            <Icon name={IconNameEnum.ArrowUp} />
            <FlowText value={current.upload} />
          </div>
          <div className={styles.detail}>
            <Icon name={IconNameEnum.ArrowDown} />
            <FlowText value={current.download} />
          </div>
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.title}>{t(TRANSLATION_KEY.TOTAL)}</div>
        <div className={styles.details}>
          <div className={styles.detail}>
            <Icon name={IconNameEnum.ArrowUp} />
            <FlowText value={total.upload} type={FlowTextTypeEnum.Total} />
          </div>
          <div className={styles.detail}>
            <Icon name={IconNameEnum.ArrowDown} />
            <FlowText value={total.download} type={FlowTextTypeEnum.Total} />
          </div>
        </div>
      </div>
    </div>
  )
}
