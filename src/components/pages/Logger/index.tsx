import SensitiveInfo from "@/components/Core/SensitiveInfo";
import { useMedia } from "@/hooks";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import {
  Button,
  createTableColumn,
  Dropdown,
  Option,
  SearchBox,
  TableCellLayout,
  type TableColumnSizingOptions,
  Tooltip,
} from "@fluentui/react-components";
import { DeleteRegular } from "@fluentui/react-icons";
import { type TableColumnDefinition } from "@fluentui/react-table";
import dayjs from "dayjs";
import { type Log, LogLevel, subscribeLog } from "lux-js-sdk";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Highlighter from "react-highlight-words";
import { useTranslation } from "react-i18next";
import { Table, Tag, type TagTypeEnum } from "../../Core";
import styles from "./index.module.css";

function calcTableHeight() {
  return document.documentElement.clientHeight - 48 - 64 - 64 - 16;
}

function TimeCell(props: Readonly<{ value: number }>) {
  const { value } = props;
  const date = new Date(value);
  return <div>{dayjs(date).format("HH:mm:ss")}</div>;
}

function TypeCell(props: Readonly<{ value: string }>) {
  const { value } = props;
  return <Tag type={value as TagTypeEnum} value={value} />;
}

function PayloadCell(
  props: Readonly<{ value: string; searchedWords: string[] }>,
) {
  const { value, searchedWords } = props;
  return (
    <Tooltip content={value} relationship={"description"}>
      <div className={styles.payload}>
        <SensitiveInfo value={value}>
          <Highlighter
            searchWords={searchedWords}
            autoEscape
            textToHighlight={value}
          />
        </SensitiveInfo>
      </div>
    </Tooltip>
  );
}

export default function Logger(): React.ReactNode {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<Log[]>([]);
  const [searchedValue, setSearchedValue] = useState("");
  const [level, setLevel] = useState<string>(LogLevel.info);

  const isWideScreen = useMedia("(min-width: 640px)");

  const columns = useMemo<Array<TableColumnDefinition<Log>>>(() => {
    return [
      createTableColumn<Log>({
        columnId: "type",
        renderHeaderCell: () => {
          return t(TRANSLATION_KEY.TYPE);
        },
        renderCell: (item) => {
          return (
            <TableCellLayout>
              <TypeCell value={item.level} />
            </TableCellLayout>
          );
        },
      }),
      isWideScreen
        ? createTableColumn<Log>({
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
          })
        : null,
      createTableColumn<Log>({
        columnId: "content",
        renderHeaderCell: () => {
          return t(TRANSLATION_KEY.CONTENT);
        },
        renderCell: (item) => {
          return (
            <TableCellLayout>
              <PayloadCell value={item.msg} searchedWords={[searchedValue]} />
            </TableCellLayout>
          );
        },
      }),
    ].filter(Boolean) as Array<TableColumnDefinition<Log>>;
  }, [searchedValue, t, isWideScreen]);

  const data = useMemo(() => {
    return logs.filter((log) => {
      if (log.level in LogLevel) {
        const curLevel = LogLevel[log.level as keyof typeof LogLevel];
        if (curLevel < level) {
          return false;
        }
      }
      return log.msg
        .toLocaleLowerCase()
        .includes(searchedValue.toLocaleLowerCase());
    });
  }, [level, logs, searchedValue]);

  const columnSizingOptions: TableColumnSizingOptions = useMemo(() => {
    return {
      time: {
        defaultWidth: 80,
      },
      type: {
        defaultWidth: 80,
      },
      content: {
        defaultWidth: 720,
      },
    };
  }, []);

  const [tableHeight, setTableHeight] = useState(calcTableHeight());

  const onResize = useCallback(() => {
    setTableHeight(calcTableHeight());
  }, []);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  useEffect(() => {
    const pushLogs = (log: Log) => {
      setLogs((logs) => [...logs, log]);
    };
    const onMessage = (newLogs: Log[]) => {
      newLogs.forEach(pushLogs);
    };
    const logSubscriber = subscribeLog({
      onMessage,
      onError: () => {
        logSubscriber.close();
      },
    });
    return () => {
      logSubscriber.close();
    };
  }, []);

  const clearLogs = () => {
    setLogs([]);
  };

  const LEVEL_OPTIONS = [
    { content: t(TRANSLATION_KEY.ERROR), id: LogLevel.error },
    { content: t(TRANSLATION_KEY.WARNING), id: LogLevel.warning },
    { content: t(TRANSLATION_KEY.INFO), id: LogLevel.info },
    { content: t(TRANSLATION_KEY.DEBUG), id: LogLevel.debug },
  ];

  const TRANSLATION_MAP = {
    [LogLevel.error]: t(TRANSLATION_KEY.ERROR),
    [LogLevel.warning]: t(TRANSLATION_KEY.WARNING),
    [LogLevel.info]: t(TRANSLATION_KEY.INFO),
    [LogLevel.debug]: t(TRANSLATION_KEY.DEBUG),
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <SearchBox
          onChange={(e, data) => {
            setSearchedValue(data.value);
          }}
          placeholder={t(TRANSLATION_KEY.SEARCH_LOG_TIP)}
          className={styles.input}
          spellCheck={false}
        />

        <div className={styles.actions}>
          <Dropdown
            value={TRANSLATION_MAP[level]}
            onOptionSelect={(_, data) => {
              setLevel(data.optionValue as string);
            }}
            className={styles.selector}
          >
            {LEVEL_OPTIONS.map((option) => (
              <Option key={option.id} value={option.id}>
                {option.content}
              </Option>
            ))}
          </Dropdown>
          <Tooltip
            content={t(TRANSLATION_KEY.CLOSE_ALL)}
            relationship="description"
          >
            <Button
              onClick={clearLogs}
              className={styles.clearBtn}
              icon={<DeleteRegular />}
            />
          </Tooltip>
        </div>
      </div>
      <Table
        height={tableHeight}
        columns={columns}
        data={data}
        columnSizingOptions={columnSizingOptions}
        resizableColumns
      />
    </div>
  );
}
