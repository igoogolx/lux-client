import React from 'react'
import { useTranslation } from 'react-i18next'
import { type RuleDetailItem } from 'lux-js-sdk'
import { TRANSLATION_KEY } from '@/i18n/locales/key'
import { Field, FiledSelector, Form, Modal } from '@/components/Core'

interface AddRuleModalProps {
  close: () => void
  onSave: (data: RuleDetailItem) => void
}

const INITIAL_VALUES: RuleDetailItem = {
  policy: 'proxy',
  payload: '',
  ruleType: 'DOMAIN'
}

const RULE_TYPE_OPTIONS = [
  {
    id: 'DOMAIN',
    content: 'DOMAIN'
  },
  {
    id: 'IP-CIDR',
    content: 'IP-CIDR'
  }
]

const POLICY_OPTIONS = [
  {
    id: 'proxy',
    content: 'proxy'
  },
  {
    id: 'bypass',
    content: 'bypass'
  }
]

export function AddRuleModal (props: AddRuleModalProps) {
  const { t } = useTranslation()
  const { close, onSave } = props
  const onSubmit = async (data: RuleDetailItem) => {
    onSave(data)
    close()
  }

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={INITIAL_VALUES}
    >
      {({ submitForm }) => {
        return (
          <Modal close={close} onOk={submitForm}>
            <FiledSelector
              name="ruleType"
              label={t(TRANSLATION_KEY.TYPE)}
              items={RULE_TYPE_OPTIONS}
            />
            <FiledSelector
              name="policy"
              label={t(TRANSLATION_KEY.POLICY)}
              items={POLICY_OPTIONS}
            />
            <Field name="payload" label={t(TRANSLATION_KEY.PAYLOAD)} />
          </Modal>
        )
      }}
    </Form>
  )
}
