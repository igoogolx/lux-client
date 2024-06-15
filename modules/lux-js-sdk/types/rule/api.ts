export interface Rule {
  id: string
  value: string
}

export enum RULE_TYPE {
  Domain = 'DOMAIN',
  IpCidr = 'IP-CIDR',
  DomainKeyword = 'DOMAIN-KEYWORD',
  DomainRegex = 'DOMAIN-REGEX',
  DomainSuffix = 'DOMAIN-SUFFIX',
  Process = 'PROCESS',
  BuiltIn = 'BUILD-IN',
}

export enum RULE_POLICY {
  Direct = 'DIRECT',
  Proxy = 'PROXY',
  Reject = 'REJECT',
}

interface GetRulesRes {
  rules: Rule[]
  selectedId: string
}
export type GetRules = () => Promise<GetRulesRes>

export interface RuleDetailItem {
  policy: RULE_POLICY
  payload: string
  ruleType: RULE_TYPE
}

interface GetRuleDetailRes {
  items: RuleDetailItem[]
}
export type GetRuleDetail = (id: string) => Promise<GetRuleDetailRes>

export type AddCustomizedRules = (rules: string[]) => Promise<void>

export type DeleteCustomizedRules = (rules: string[]) => Promise<void>
