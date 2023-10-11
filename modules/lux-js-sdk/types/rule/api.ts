export interface Rule {
  id: string;
  value: string;
}

type GetRulesRes = {
  rules: Rule[];
  selectedId: string;
};
export type GetRules = () => Promise<GetRulesRes>;
