import { PropsWithChildren, useContext } from "react";
import SensitiveInfoModeContext from "./context";

interface SensitiveInfoProps extends PropsWithChildren {
  value: string;
}

export default function SensitiveInfo(props: Readonly<SensitiveInfoProps>) {
  const { value, children } = props;

  const { enabled } = useContext(SensitiveInfoModeContext);

  return !enabled ? "*".repeat(value.length) : children || value;
}

export { default as SensitiveInfoProvider } from "./provider";
