import React from "react";
import styles from "@/components/pages/Home/Content/index.module.css";
import { notifier, Table } from "@/components/Core";
import {
  Button,
  Card,
  CardHeader,
  DataGridProps,
  Subtitle1,
  TableColumnDefinition,
  Tooltip,
} from "@fluentui/react-components";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { ArrowSyncRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { generalSlice, proxiesSlice } from "@/reducers";
import { addProxiesFromClashUrlConfig } from "lux-js-sdk";
import { useDispatch } from "react-redux";

export type ProxyCardProps<T> = {
  url: string;
  data: T[];
  columns: TableColumnDefinition<T>[];
  selectionMode?: DataGridProps["selectionMode"];
  selectedItems?: DataGridProps["selectedItems"];
  onSelectionChange?: DataGridProps["onSelectionChange"];
};

export const LOCAL_SERVERS = "local_servers";

export default function ProxyCard<T extends { id: string }>(
  props: ProxyCardProps<T>
): React.ReactNode {
  const {
    url,
    data,
    selectionMode,
    columns,
    selectedItems,
    onSelectionChange,
  } = props;
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const handleUpdateClashProxies = async () => {
    try {
      dispatch(generalSlice.actions.setLoading({ loading: true }));
      const res = await addProxiesFromClashUrlConfig({ url });
      dispatch(proxiesSlice.actions.received(res));
      notifier.success(t(TRANSLATION_KEY.UPDATE_SUCCESS));
    } finally {
      dispatch(generalSlice.actions.setLoading({ loading: false }));
    }
  };

  return (
    <Card className={styles.card}>
      <CardHeader
        className={styles.header}
        header={
          <Subtitle1>
            {url === LOCAL_SERVERS
              ? t(TRANSLATION_KEY.LOCAL_SERVERS)
              : new URL(url).hostname.toLocaleUpperCase()}
          </Subtitle1>
        }
        action={
          url === LOCAL_SERVERS ? (
            ""
          ) : (
            <Tooltip
              content={t(TRANSLATION_KEY.UPDATE_CLASH_PROXIES)}
              relationship="description"
            >
              <Button
                onClick={handleUpdateClashProxies}
                icon={<ArrowSyncRegular />}
                className={styles.updateClashProxiesButton}
              />
            </Tooltip>
          )
        }
      />
      <Table
        columns={columns}
        data={data}
        selectionMode={selectionMode}
        onSelectionChange={onSelectionChange}
        selectedItems={selectedItems}
        getRowId={(item) => item.id}
      />
    </Card>
  );
}
