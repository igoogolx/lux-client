import { type RULE_POLICY } from '../rule'

export type TestRule = (req: {
  destination: string
}) => Promise<{ rule: RULE_POLICY }>
