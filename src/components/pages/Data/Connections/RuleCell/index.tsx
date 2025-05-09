import { useClipboard } from "@/utils/clipboard";
import { Button, TableCellLayout, Tooltip } from "@fluentui/react-components";
import { CopyRegular } from "@fluentui/react-icons";
import React, { useState } from "react";
import Highlighter from "react-highlight-words";
import styles from "./index.module.css";

interface RuleCellProps {
  searchedValue: string;
  value: string;
}

export default function RuleCell(props: Readonly<RuleCellProps>) {
  const { searchedValue, value } = props;

  const { copy } = useClipboard();
  const [shouldShowCopyBtn, setShouldShowCopyBtn] = useState(false);

  return (
    <TableCellLayout truncate>
      <div
        onMouseEnter={() => setShouldShowCopyBtn(true)}
        onMouseLeave={() => setShouldShowCopyBtn(false)}
        className={styles.container}
      >
        <Tooltip
          content={value}
          relationship="description"
          positioning={"above-start"}
        >
          <div className={styles.content}>
            <Highlighter
              searchWords={[searchedValue]}
              autoEscape
              textToHighlight={value}
            />
          </div>
        </Tooltip>

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
    </TableCellLayout>
  );
}
