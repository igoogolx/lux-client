import type { RootState } from "@/reducers";
import React, { PropsWithChildren, useMemo } from "react";
import { useSelector } from "react-redux";
import SensitiveInfoModeContext from "./context";

export default function SensitiveInfoProvider(
  props: Readonly<PropsWithChildren>,
) {
  const { children } = props;

  const sensitiveInfoMode = useSelector<RootState, boolean>(
    (state) => state.setting.sensitiveInfoMode,
  );

  const contextValue = useMemo(() => {
    return { enabled: sensitiveInfoMode };
  }, [sensitiveInfoMode]);

  return (
    <SensitiveInfoModeContext.Provider value={contextValue}>
      {children}
    </SensitiveInfoModeContext.Provider>
  );
}
