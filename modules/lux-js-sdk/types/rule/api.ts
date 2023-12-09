export interface Rule {
  id: string
  value: string
}

interface GetRulesRes {
  rules: Rule[]
  selectedId: string
}
export type GetRules = () => Promise<GetRulesRes>

export interface RuleDetailItem {
  policy: string
  payload: string
  ruleType: string
}

interface GetRuleDetailRes {
  items: RuleDetailItem[]
}
export type GetRuleDetail = (id: string) => Promise<GetRuleDetailRes>

export type AddCustomizedRules = (rules: string[]) => Promise<void>

export type DeleteCustomizedRules = (rules: string[]) => Promise<void>
