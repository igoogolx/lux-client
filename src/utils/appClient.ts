import { getVersion } from "@/utils/version.ts";

export const getIsAppClient = () => {
  return !!getVersion();
};
