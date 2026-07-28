import { useClipboard } from "@/utils/clipboard";
import { type ReactNode } from "react";

interface ClickToCopyProps {
  value: string;
  children: ReactNode;
}

export default function ClickToCopy(props: Readonly<ClickToCopyProps>) {
  const { children, value } = props;
  const { copy } = useClipboard();

  return (
    <span
      onClick={async () => {
        await copy(value);
      }}
    >
      {children}
    </span>
  );
}
