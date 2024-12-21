import { useClipboard } from "@/utils/clipboard";
import React, { type ReactNode } from "react";

interface ClickToCopyProps {
  value: string;
  children: ReactNode;
}

export default function ClickToCopy(props: ClickToCopyProps) {
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
