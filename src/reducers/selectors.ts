import { proxiesAdapter } from "./proxy";
import { RootState } from "./store";
import { rulesAdapter } from "./rule";
import { delaysAdapter } from "./delay";

export const proxiesSelectors = proxiesAdapter.getSelectors<RootState>(
  (state) => state.proxies
);

export const rulesSelectors = rulesAdapter.getSelectors<RootState>(
  (state) => state.rules
);

export const delaysSelectors = delaysAdapter.getSelectors<RootState>(
  (state) => state.delays
);
