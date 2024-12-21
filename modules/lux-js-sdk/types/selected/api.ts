type UpdateSelectedRuleIdReq = {
  id: string;
};

export type UpdateSelectedRuleId = (
  req: UpdateSelectedRuleIdReq,
) => Promise<void>;

type UpdateSelectedProxyIdReq = {
  id: string;
};

export type UpdateProxyRuleId = (
  req: UpdateSelectedProxyIdReq,
) => Promise<void>;
