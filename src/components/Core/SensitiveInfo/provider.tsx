import type { RootState } from "@/reducers";
import React, { PropsWithChildren } from "react";
import { useSelector } from "react-redux";
import SensitiveInfoModeContext from "./context";

export default function SensitiveInfoProvider(
  props: Readonly<PropsWithChildren>,
) {
  const { children } = props;

  const sensitiveInfoModeContextValue = useSelector<
    RootState,
    { enabled: boolean }
  >((state) => ({ enabled: state.setting.sensitiveInfoMode }));

  return (
    <SensitiveInfoModeContext.Provider value={sensitiveInfoModeContextValue}>
      {children}
    </SensitiveInfoModeContext.Provider>
  );
}
