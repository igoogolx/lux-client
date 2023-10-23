import * as React from "react";
import { useEffect, useMemo } from "react";
import {
  BaseProxy,
  getProxies,
  Proxy,
  SettingRes,
  updateSelectedProxyId,
} from "lux-js-sdk";
import { useDispatch, useSelector } from "react-redux";
import {
  createTableColumn,
  DataGridProps,
  TableCellLayout,
  TableColumnDefinition,
} from "@fluentui/react-components";
import {
  proxiesSelectors,
  proxiesSlice,
  RootState,
  selectedSlice,
} from "@/reducers";
import ClashCard, {
  LOCAL_SERVERS,
} from "@/components/pages/Home/Content/ClashCard";
import { Operation } from "./Operation";
import { DelayTag } from "./DelayTag";
import styles from "./index.module.css";

export function Content(): React.ReactNode {
  const proxies = useSelector(proxiesSelectors.selectAll);

  const proxyMap = useMemo(() => {
    const res: { [key: string]: BaseProxy[] } = {};
    proxies.forEach((proxy) => {
      if (proxy.clashYamlUrl) {
        res[proxy.clashYamlUrl] = [...(res[proxy.clashYamlUrl] || []), proxy];
      } else {
        res[LOCAL_SERVERS] = [...(res[LOCAL_SERVERS] || []), proxy];
      }
    });
    return res;
  }, [proxies]);

  const selectedId = useSelector<RootState, string>(
    (state) => state.selected.proxy
  );
  const dispatch = useDispatch();
  useEffect(() => {
    getProxies().then((data) => {
      dispatch(proxiesSlice.actions.received(data));
      dispatch(selectedSlice.actions.setProxy({ id: data.selectedId }));
    });
  }, [dispatch]);

  const columns: TableColumnDefinition<Proxy>[] = [
    createTableColumn<Proxy>({
      columnId: "name",
      renderCell: (item) => {
        return (
          <TableCellLayout truncate>
            <div className={styles.desc}>
              <span>{item.name || `${item.server}:${item.port}`}</span>
              <span className={styles.type}>{item.type}</span>
            </div>
          </TableCellLayout>
        );
      },
    }),
    createTableColumn<Proxy>({
      columnId: "action",
      renderCell: (item) => {
        return (
          <TableCellLayout truncate className={styles.action}>
            <div
              className={styles.content}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <DelayTag id={item.id} value={item.delay} />
              <Operation proxy={item} />
            </div>
          </TableCellLayout>
        );
      },
    }),
  ];

  const defaultSelectedItems = React.useMemo(
    () => new Set([selectedId]),
    [selectedId]
  );

  // TODO:optimize selector
  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  const isAutoMode = setting.autoMode.enabled;

  const handleSelect: DataGridProps["onSelectionChange"] = async (e, data) => {
    if (!isAutoMode) {
      const id = data.selectedItems.values().next().value;
      await updateSelectedProxyId({ id });
      dispatch(selectedSlice.actions.setProxy({ id }));
    }
  };

  return (
    <div className={styles.wrapper}>
      {Object.keys(proxyMap).map((key) => {
        return (
          <ClashCard
            columns={columns}
            data={proxyMap[key]}
            selectionMode={isAutoMode ? undefined : "single"}
            onSelectionChange={handleSelect}
            selectedItems={defaultSelectedItems}
            url={key}
          />
        );
      })}
    </div>
  );
}
