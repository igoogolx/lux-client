import { ClickToCopy } from "@/components/Core";
import { TableCellLayout, Tooltip } from "@fluentui/react-components";
import React from "react";
import Highlighter from "react-highlight-words";

interface ProcessCellProps {
  process: string;
  os: string;
  searchedValue: string;
}
export function ProcessCell(props: ProcessCellProps) {
  const { process, os, searchedValue } = props;
  const separator = os === "darwin" ? "/" : "\\";
  const chunks = process.split(separator);
  const value = chunks.pop() ?? "";
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
