import { Dns } from "./dns";
import { Ip } from "./ip";

export interface Rule {
  id: string;
  ip: Ip;
  dns: Dns;
}

type GetRulesRes = {
  rules: Rule[];
  selectedId: string;
};
export type GetRules = () => Promise<GetRulesRes>;

type UpdateRuleReq = {
  rule: Rule;
  id: string;
};
export type UpdateRule = (req: UpdateRuleReq) => Promise<void>;

type AddRuleReq = {
  rule: Rule;
};
export type AddRule = (req: AddRuleReq) => Promise<void>;

type DeleteRuleReq = {
  id: string;
};
export type DeleteRule = (req: DeleteRuleReq) => Promise<void>;
