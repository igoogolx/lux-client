import React, { useMemo, useState } from "react";
import { getLogsDir, Log } from "lux-js-sdk";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers";
import {
  notifier,
  PlacementEnum,
  Table,
  Tag,
  TagTypeEnum,
  Tooltip,
} from "@/components/Core";
import { isElectron, shellOpenPath } from "@/clientContext";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { TableColumnDefinition } from "@fluentui/react-table";
import {
  Button,
  createTableColumn,
  Input,
  TableCellLayout,
  TableColumnSizingOptions,
} from "@fluentui/react-components";
import { SearchRegular } from "@fluentui/react-icons";
import dayjs from "dayjs";
import Highlighter from "react-highlight-words";
import useMediaQuery from "beautiful-react-hooks/useMediaQuery";
import styles from "./index.module.css";

function TimeCell(props: { value: number }) {
  const { value } = props;
  const date = new Date(value);
  return <div>{dayjs(date).format("HH:mm:ss")}</div>;
}

function TypeCell(props: { value: string }) {
  const { value } = props;
  return <Tag type={value as TagTypeEnum} value={value} />;
}

function PayloadCell(props: { value: string; searchedWords: string[] }) {
  const { value, searchedWords } = props;
  return (
    <Tooltip content={value} placement={PlacementEnum.TopStart}>
      <div className={styles.payload}>
        <Highlighter
          searchWords={searchedWords}
          autoEscape
          textToHighlight={value}
        />
      </div>
    </Tooltip>
  );
}

export default function Logger(): JSX.Element {
  const { t } = useTranslation();
  const logs = useSelector<RootState, Log[]>((state) => state.logger.logs);
  const [searchedValue, setSearchedValue] = useState("");
  const onOpenLogDir = async () => {
    const logDir = await getLogsDir();
    if (isElectron) {
      await shellOpenPath(logDir);
    } else {
      await navigator.clipboard.writeText(logDir);
      notifier.success(t(TRANSLATION_KEY.COPY_LOG_DIR_PATH));
    }
  };

  const columns = useMemo<TableColumnDefinition<Log>[]>(() => {
    return [
      createTableColumn<Log>({
        columnId: "type",
        renderHeaderCell: () => {
          return t(TRANSLATION_KEY.TYPE);
        },
        renderCell: (item) => {
          return (
            <TableCellLayout>
              <TypeCell value={item.type} />
            </TableCellLayout>
          );
        },
      }),
      createTableColumn<Log>({
        columnId: "time",
        renderHeaderCell: () => {
          return t(TRANSLATION_KEY.TIME);
        },
        renderCell: (item) => {
          return (
            <TableCellLayout>
              <TimeCell value={item.time} />
            </TableCellLayout>
          );
        },
      }),
      createTableColumn<Log>({
        columnId: "content",
        renderHeaderCell: () => {
          return t(TRANSLATION_KEY.CONTENT);
        },
        renderCell: (item) => {
          return (
            <TableCellLayout>
              <PayloadCell
                value={item.payload}
                searchedWords={[searchedValue]}
              />
            </TableCellLayout>
          );
        },
      }),
    ];
  }, [searchedValue, t]);

  const data = useMemo(() => {
    return logs.filter((log) => {
      return log.payload
        .toLocaleLowerCase()
        .includes(searchedValue.toLocaleLowerCase());
    });
  }, [logs, searchedValue]);

  const columnSizingOptions: TableColumnSizingOptions = useMemo(() => {
    return {
      time: {
        defaultWidth: 80,
        minWidth: 80,
      },
      type: {
        defaultWidth: 80,
        minWidth: 80,
      },
      content: {
        defaultWidth: 720,
        minWidth: 720,
      },
    };
  }, []);

  const isLg = useMediaQuery("(min-width: 1024px)");

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <Input
          onChange={(e) => {
            setSearchedValue(e.target.value);
          }}
          contentAfter={<SearchRegular />}
          placeholder={t(TRANSLATION_KEY.SEARCH_LOG_TIP)}
          className={styles.input}
        />
        <Button onClick={onOpenLogDir} className={styles.logBtn}>
          {t(TRANSLATION_KEY.OPEN_LOG_DIR)}
        </Button>
      </div>
      <Table
        columns={columns}
        data={data}
        columnSizingOptions={columnSizingOptions}
        resizableColumns
        height={isLg ? 600 : 300}
      />
    </div>
  );
}
