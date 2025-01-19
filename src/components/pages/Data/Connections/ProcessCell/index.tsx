import { ClickToCopy } from "@/components/Core";
import { TableCellLayout, Tooltip } from "@fluentui/react-components";
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
  return (
    <TableCellLayout truncate>
      <ClickToCopy value={process}>
        <Tooltip
          content={process}
          relationship="description"
          positioning={"above-start"}
        >
          <div>
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
