import { useTranslation } from 'react-i18next'
import React from 'react'
import { ConnRuleEnum } from 'lux-js-sdk'
import { TRANSLATION_KEY } from '@/i18n/locales/key'
import { Tag, TagTypeEnum } from '../../../../Core'

function RuleCell ({ value }: { value: number }) {
  const { t } = useTranslation()

  if (value === ConnRuleEnum.Proxy) {
    return <Tag type={TagTypeEnum.Info} value={t(TRANSLATION_KEY.PROXY)} />
  }
  return <Tag type={TagTypeEnum.Warning} value={t(TRANSLATION_KEY.BYPASS)} />
}

export default RuleCell
