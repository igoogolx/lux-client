import * as React from "react";
import { useEffect } from "react";
import {
  getProxies,
  Proxy,
  SettingRes,
  updateSelectedProxyId,
} from "lux-js-sdk";
import { useDispatch, useSelector } from "react-redux";
import { proxiesSelectors, proxiesSlice, RootState } from "@/reducers";
import { selectedSlice } from "@/reducers/selected";
import {
  createTableColumn,
  DataGridProps,
  TableCellLayout,
  TableColumnDefinition,
} from "@fluentui/react-components";
import { Operation } from "@/components/pages/Home/Content/ProxyCard/Operation";
import { DelayTag } from "@/components/pages/Home/Content/ProxyCard/DelayTag";
import { Table } from "@/components/Core";
import useMediaQuery from "beautiful-react-hooks/useMediaQuery";
import styles from "./index.module.css";

export function Content(): JSX.Element {
  const proxies = useSelector(proxiesSelectors.selectAll);
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
            <div className={styles.content}>
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

  const isLg = useMediaQuery("(min-width: 1024px)");

  return (
    <div className={styles.wrapper}>
      <Table
        columns={columns}
        data={proxies}
        selectionMode="single"
        onSelectionChange={handleSelect}
        selectedItems={defaultSelectedItems}
        getRowId={(item) => item.id}
        height={isLg ? 600 : 300}
      />
    </div>
  );
}
