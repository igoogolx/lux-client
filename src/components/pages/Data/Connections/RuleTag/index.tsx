import { useTranslation } from 'react-i18next'
import React from 'react'
import { type RuleDetailItem, RULE_POLICY } from 'lux-js-sdk'
import { TRANSLATION_KEY } from '@/i18n/locales/key'
import { TableCellLayout, Tooltip } from '@fluentui/react-components'
import { ClickToCopy, TagTypeEnum, Tag } from '@/components/Core'

function RuleCell ({ value }: { value: RuleDetailItem }) {
  const { t } = useTranslation()

  let content = <Tag type={TagTypeEnum.Warning} value={t(TRANSLATION_KEY.DIRECT)} />
  const fullRule = `${value.ruleType},${value.payload},${value.policy}`

  if (value.policy === RULE_POLICY.Proxy) {
    content = <Tag type={TagTypeEnum.Info} value={t(TRANSLATION_KEY.PROXY)} />
  }
  if (value.policy === RULE_POLICY.Reject) {
    content = <Tag type={TagTypeEnum.Error} value={t(TRANSLATION_KEY.REJECT)} />
  }

  return <TableCellLayout truncate>
    <ClickToCopy value={fullRule}>
      <Tooltip relationship={'description'} content={fullRule}>
        <span>
          {content}
        </span>
      </Tooltip>
    </ClickToCopy>
  </TableCellLayout>
}

export default RuleCell
