import { ConnRuleEnum } from "../connection";

export type TestRule = (req: {
  destination: string;
}) => Promise<{ rule: ConnRuleEnum }>;
