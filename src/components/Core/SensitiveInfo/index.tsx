import { PropsWithChildren, useContext, useMemo } from "react";
import SensitiveInfoModeContext from "./context";

interface SensitiveInfoProps extends PropsWithChildren {
  value: string;
}

export default function SensitiveInfo(props: Readonly<SensitiveInfoProps>) {
  const { value, children } = props;

  const { enabled } = useContext(SensitiveInfoModeContext);

  return useMemo(() => {
    return enabled ? value.replace(/\S/g, "*") : children || value;
  }, [children, enabled, value]);
}

export { default as SensitiveInfoProvider } from "./provider";
