import React from 'react'
import { useTranslation } from 'react-i18next'
import { RULE_POLICY, RULE_TYPE, type RuleDetailItem } from 'lux-js-sdk'
import { TRANSLATION_KEY } from '@/i18n/locales/key'
import { Field, FiledSelector, Form, Modal } from '@/components/Core'
import { RuleSchema } from '@/components/Modal/Proxy/EditShadowsocksModal/validate'

interface AddRuleModalProps {
  close: () => void
  onSave: (data: RuleDetailItem) => void
}

const INITIAL_VALUES: RuleDetailItem = {
  policy: RULE_POLICY.Proxy,
  payload: '',
  ruleType: RULE_TYPE.Domain
}

const RULE_TYPE_OPTIONS = [
  {
    id: RULE_TYPE.IpCidr,
    content: RULE_TYPE.IpCidr
  },
  {
    id: RULE_TYPE.Domain,
    content: RULE_TYPE.Domain
  },
  {
    id: RULE_TYPE.DomainKeyword,
    content: RULE_TYPE.DomainKeyword
  },
  {
    id: RULE_TYPE.DomainRegex,
    content: RULE_TYPE.DomainRegex
  },
  {
    id: RULE_TYPE.DomainSuffix,
    content: RULE_TYPE.DomainSuffix
  }
]

const POLICY_OPTIONS = [
  {
    id: RULE_POLICY.Proxy,
    content: RULE_POLICY.Proxy
  },
  {
    id: RULE_POLICY.Direct,
    content: RULE_POLICY.Direct
  },
  {
    id: RULE_POLICY.Reject,
    content: RULE_POLICY.Reject
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
      validationSchema={RuleSchema}
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
