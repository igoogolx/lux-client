import SensitiveInfo from "@/components/Core/SensitiveInfo";
import { ProcessCell } from "@/components/pages/Data/Connections/ProcessCell";
import RuleCell from "@/components/pages/Data/Connections/RuleCell";
import RuleTag from "@/components/pages/Data/Connections/RuleTag";
import Dashboard from "@/components/pages/Data/Dashboard";
import { ConnectionsAmount } from "@/components/pages/Data/Dashboard/TrafficCard";
import { useMedia } from "@/hooks";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import type { RootState } from "@/reducers";
import { PROXY_MODE_ENUM } from "@/utils/constants";
import { convertByte } from "@/utils/traffic";
import {
  Button,
  createTableColumn,
  type DataGridProps,
  SearchBox,
  TableCellLayout,
  Tooltip,
} from "@fluentui/react-components";
import { DeleteRegular } from "@fluentui/react-icons";
import { type TableColumnDefinition } from "@fluentui/react-table";
import {
  closeAllConnections,
  type Conn,
  ConnNetworkMetaEnum,
  getRuntimeOS,
  RULE_POLICY,
  type RuleDetailItem,
  type SettingRes,
  subscribeConnections,
} from "lux-js-sdk";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Highlighter from "react-highlight-words";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Table } from "../../../Core";
import styles from "./index.module.css";

interface Connection {
  destination: string;
  domain: string;
  download: number;
  upload: number;
  network: ConnNetworkMetaEnum;
  rule: RuleDetailItem;
  start: number;
  id: string;
  process: string;
}

function calcTableHeight() {
  return document.documentElement.clientHeight - 48 - 68 - 44 - 40 - 48;
}

function convertDuration(duration: number) {
  const secNum = duration / 1000;
  const hoursNum = Math.floor(secNum / 3600);
  const minutesNum = Math.floor((secNum - hoursNum * 3600) / 60);
  const secondsNum = Math.floor(secNum - hoursNum * 3600 - minutesNum * 60);

  let seconds = secondsNum.toString();
  let minutes = minutesNum.toString();
  let hours = hoursNum.toString();
  if (hoursNum < 10) {
    hours = `0${hoursNum}`;
  }
  if (minutesNum < 10) {
    minutes = `0${minutesNum}`;
  }
  if (secondsNum < 10) {
    seconds = `0${secondsNum}`;
  }
  return `${hours}:${minutes}:${seconds}`;
}

function LoadTag(props: { value: number }): string {
  const { value } = props;
  const { value: convertedValue, unit } = convertByte(value);
  return `${convertedValue} ${unit}`;
}

function StartTag(props: Readonly<{ value: number }>): React.ReactNode {
  const { value } = props;
  const duration = new Date().getTime() - value;
  return <>{convertDuration(duration)}</>;
}

export default function Connections(): React.ReactNode {
  const { t } = useTranslation();
  const [os, setOs] = useState("");
  useEffect(() => {
    getRuntimeOS().then((res) => {
      setOs(res.os);
    });
  }, []);

  const setting = useSelector<RootState, SettingRes>((state) => state.setting);
  const [conns, setConns] = useState<Conn[]>([]);
  const [total, setTotal] = useState<ConnectionsAmount>({
    proxy: {
      tcp: 0,
      udp: 0,
    },
    direct: {
      tcp: 0,
      udp: 0,
    },
  });
  const [searchedValue, setSearchedValue] = useState("");

  const isWideScreen = useMedia("(min-width: 640px)");

  const shouldShowProcess =
    setting.shouldFindProcess &&
    (setting.mode === PROXY_MODE_ENUM.TUN ||
      setting.mode === PROXY_MODE_ENUM.MIXED);

  useEffect(() => {
    const subscriber = subscribeConnections({
      onMessage: (m) => {
        setConns(m);
        const total = {
          proxy: {
            tcp: 0,
            udp: 0,
          },
          direct: {
            tcp: 0,
            udp: 0,
          },
        };
        m.forEach((conn) => {
          if (conn.metadata.network === ConnNetworkMetaEnum.Tcp) {
            if (conn.rule.policy === RULE_POLICY.Proxy) {
              total.proxy.tcp++;
            }
            if (conn.rule.policy === RULE_POLICY.Direct) {
              total.direct.tcp++;
            }
          }
          if (conn.metadata.network === ConnNetworkMetaEnum.Udp) {
            if (conn.rule.policy === RULE_POLICY.Proxy) {
              total.proxy.udp++;
            }
            if (conn.rule.policy === RULE_POLICY.Direct) {
              total.direct.udp++;
            }
          }
        });
        setTotal(total);
      },
    });
    return () => {
      subscriber.close();
    };
  }, []);
  const columns = useMemo<Array<TableColumnDefinition<Connection>>>(() => {
    return [
      isWideScreen
        ? createTableColumn<Connection>({
            columnId: "destination",
            renderHeaderCell: () => {
              return t(TRANSLATION_KEY.DESTINATION);
            },
            renderCell: (item) => {
              return (
                <TableCellLayout truncate>
                  <SensitiveInfo value={item.destination}>
                    <Highlighter
                      searchWords={[searchedValue]}
                      autoEscape
                      textToHighlight={item.destination}
                    />
                  </SensitiveInfo>
                </TableCellLayout>
              );
            },
          })
        : null,

      createTableColumn<Connection>({
        columnId: "domain",
        renderHeaderCell: () => {
          return t(TRANSLATION_KEY.DOMAIN);
        },
        renderCell: (item) => {
          const value = item.domain === "unknown" ? "" : item.domain;
          return (
            <TableCellLayout truncate>
              <SensitiveInfo value={value}>
                <Highlighter
                  searchWords={[searchedValue]}
                  autoEscape
                  textToHighlight={value}
                />
              </SensitiveInfo>
            </TableCellLayout>
          );
        },
      }),
      createTableColumn<Connection>({
        columnId: "fullRule",
        renderHeaderCell: () => {
          return t(TRANSLATION_KEY.RULE);
        },
        renderCell: (item) => {
          const fullRule = `${item.rule.ruleType},${item.rule.payload},${item.rule.policy}`;
          return <RuleCell value={fullRule} searchedValue={searchedValue} />;
        },
      }),
      createTableColumn<Connection>({
        columnId: "rule",
        renderHeaderCell: () => {
          return "";
        },
        renderCell: (item) => {
          return <RuleTag value={item.rule} />;
        },
      }),
      shouldShowProcess
        ? createTableColumn<Connection>({
            columnId: "process",
            renderHeaderCell: () => {
              return t(TRANSLATION_KEY.PROCESS);
            },
            renderCell: (item) => {
              return (
                <ProcessCell
                  process={item.process}
                  os={os}
                  searchedValue={searchedValue}
                />
              );
            },
          })
        : null,
      isWideScreen
        ? createTableColumn<Connection>({
            columnId: "network",
            renderHeaderCell: () => {
              return t(TRANSLATION_KEY.NETWORK);
            },
            renderCell: (item) => {
              return <TableCellLayout>{item.network}</TableCellLayout>;
            },
          })
        : null,

      isWideScreen
        ? createTableColumn<Connection>({
            columnId: "start",
            compare: (a, b) => {
              return a.start - b.start;
            },
            renderHeaderCell: () => {
              return t(TRANSLATION_KEY.TIME);
            },
            renderCell: (item) => {
              return (
                <TableCellLayout>
                  <StartTag value={item.start} />
                </TableCellLayout>
              );
            },
          })
        : null,

      isWideScreen
        ? createTableColumn<Connection>({
            columnId: "data",
            renderHeaderCell: () => {
              return t(TRANSLATION_KEY.DATA);
            },
            renderCell: (item) => {
              return (
                <TableCellLayout>
                  <LoadTag value={item.download + item.upload} />
                </TableCellLayout>
              );
            },
          })
        : null,
    ].filter(Boolean) as Array<TableColumnDefinition<Connection>>;
  }, [isWideScreen, shouldShowProcess, t, searchedValue, os]);

  const data = useMemo(() => {
    return conns
      .map((conn) => ({
        destination: `${conn.metadata.destinationIP}:${conn.metadata.destinationPort}`,
        domain: conn.domain,
        download: conn.download,
        upload: conn.upload,
        network: conn.metadata.network,
        rule: conn.rule,
        start: conn.start,
        id: conn.id,
        process: conn.metadata.processPath,
      }))
      .filter((conn) => {
        if (searchedValue) {
          return [conn.domain, conn.destination, conn.process].some((value) => {
            return value
              .toLocaleLowerCase()
              .includes(searchedValue.toLocaleLowerCase());
          });
        }
        return true;
      });
  }, [conns, searchedValue]);

  const defaultSortState = useMemo<DataGridProps["defaultSortState"]>(
    () => ({ sortColumn: "start", sortDirection: "ascending" }),
    [],
  );

  const columnSizingOptions = useMemo(() => {
    return {
      process: {
        minWidth: 360,
        defaultWidth: 360,
      },
      fullRule: {
        minWidth: 256,
        defaultWidth: 256,
      },
      rule: {
        minWidth: 96,
        defaultWidth: 96,
      },
      network: {
        minWidth: 64,
        defaultWidth: 64,
      },
      destination: {
        minWidth: 200,
        defaultWidth: 200,
      },
      domain: {
        minWidth: 320,
        defaultWidth: 320,
      },
      data: {
        minWidth: 64,
        defaultWidth: 64,
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

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <SearchBox
          value={searchedValue}
          onChange={(_, data) => {
            setSearchedValue(data.value);
          }}
          placeholder={t(TRANSLATION_KEY.SEARCH_CONNECTION_TIP)}
          className={styles.input}
          spellCheck={false}
        />
        <div className={styles.actions}>
          <Tooltip
            content={t(TRANSLATION_KEY.CLOSE_ALL)}
            relationship="description"
          >
            <Button
              onClick={closeAllConnections}
              className={styles.closeAll}
              icon={<DeleteRegular />}
            />
          </Tooltip>
        </div>
      </div>
      <div className={"overflow-x-auto overflow-y-hidden w-full"}>
        <Table
          height={tableHeight}
          virtualized={true}
          columnSizingOptions={columnSizingOptions}
          resizableColumns
          columns={columns}
          data={data}
          defaultSortState={defaultSortState}
          sortable
        />
      </div>

      <div className={styles.footer}>
        <Dashboard connectionsAmount={total} />
      </div>
    </div>
  );
}
