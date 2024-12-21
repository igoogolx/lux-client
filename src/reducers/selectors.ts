import { delaysAdapter } from "./delay";
import { proxiesAdapter } from "./proxy";
import { rulesAdapter } from "./rule";
import { type RootState } from "./store";

export const proxiesSelectors = proxiesAdapter.getSelectors<RootState>(
  (state) => state.proxies,
);

export const rulesSelectors = rulesAdapter.getSelectors<RootState>(
  (state) => state.rules,
);

export const delaysSelectors = delaysAdapter.getSelectors<RootState>(
  (state) => state.delays,
);
