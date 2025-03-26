import { useClipboard } from "@/utils/clipboard";
import { Button, TableCellLayout, Tooltip } from "@fluentui/react-components";
import { CopyRegular } from "@fluentui/react-icons";
import React, { useState } from "react";
import Highlighter from "react-highlight-words";
import styles from "./index.module.css";

interface ProcessCellProps {
  process: string;
  os: string;
  searchedValue: string;
}

const getProcessName = (process: string, os: string) => {
  const isDarwin = os === "darwin";
  const separator = isDarwin ? "/" : "\\";
  const chunks = process.split(separator);
  if (isDarwin) {
    const appName = chunks.find((a) => a.endsWith(".app"));
    if (appName) {
      return appName;
    }
  }
  return chunks.pop() ?? "";
};

export function ProcessCell(props: Readonly<ProcessCellProps>) {
  const { process, os, searchedValue } = props;
  const value = getProcessName(process, os);
  const [shouldShowCopyBtn, setShouldShowCopyBtn] = useState(false);

  const { copy } = useClipboard();
  return (
    <TableCellLayout truncate>
      <Tooltip
        content={process}
        relationship="description"
        positioning={"above-start"}
      >
        <div
          onMouseEnter={() => setShouldShowCopyBtn(true)}
          onMouseLeave={() => setShouldShowCopyBtn(false)}
          className={styles.container}
        >
          <Highlighter
            searchWords={[searchedValue]}
            autoEscape
            textToHighlight={value}
            className={styles.content}
          />
          <Button
            className={shouldShowCopyBtn ? "" : styles.hidden}
            appearance="transparent"
            icon={<CopyRegular />}
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await copy(value);
            }}
          />
        </div>
      </Tooltip>
    </TableCellLayout>
  );
}
