import { ClickToCopy } from "@/components/Core";
import { useClipboard } from "@/utils/clipboard";
import { Button, TableCellLayout, Tooltip } from "@fluentui/react-components";
import { CopyRegular } from "@fluentui/react-icons";
import React from "react";
import Highlighter from "react-highlight-words";

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

  const { copy } = useClipboard();
  return (
    <TableCellLayout truncate>
      <ClickToCopy value={process}>
        <Tooltip
          content={process}
          relationship="description"
          positioning={"above-start"}
        >
          <div>
            <Button
              appearance="transparent"
              icon={<CopyRegular />}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await copy(value);
              }}
            />
            <Highlighter
              searchWords={[searchedValue]}
              autoEscape
              textToHighlight={value}
            />
          </div>
        </Tooltip>
      </ClickToCopy>
    </TableCellLayout>
  );
}
