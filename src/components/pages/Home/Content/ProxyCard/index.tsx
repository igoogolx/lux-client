import React from "react";
import { notifier, Table } from "@/components/Core";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  DataGridProps,
  makeStyles,
  mergeClasses,
  TableColumnDefinition,
  Tooltip,
} from "@fluentui/react-components";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import {
  ArrowSyncRegular,
  ClipboardRegular,
  DeleteRegular,
} from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { generalSlice, proxiesSlice, RootState } from "@/reducers";
import { addProxiesFromClashUrlConfig, deleteProxies } from "lux-js-sdk";
import { useDispatch, useSelector } from "react-redux";
import { tokens } from "@fluentui/react-theme";
import { useDangerStyles } from "@/hooks";
import styles from "./index.module.css";

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

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared
  );

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

  const handleDeleteProxies = async () => {
    try {
      dispatch(generalSlice.actions.setLoading({ loading: true }));
      const ids = data.map((item) => item.id);
      await deleteProxies({ ids: data.map((item) => item.id) });
      dispatch(proxiesSlice.actions.deleteMany({ ids }));
      notifier.success(t(TRANSLATION_KEY.UPDATE_SUCCESS));
    } finally {
      dispatch(generalSlice.actions.setLoading({ loading: false }));
    }
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(url);
    notifier.success(t(TRANSLATION_KEY.COPIED));
  };

  const inlineStyles = useDangerStyles();

  return (
    <Card className={styles.card}>
      <CardHeader
        header={
          <Badge appearance="outline">
            {url === LOCAL_SERVERS
              ? t(TRANSLATION_KEY.LOCAL_SERVERS)
              : new URL(url).hostname.toLocaleUpperCase()}
          </Badge>
        }
        className={styles.header}
        action={
          <div className={styles.action}>
            <Tooltip
              content={t(TRANSLATION_KEY.COMMON_DELETE)}
              relationship="description"
            >
              <Button
                onClick={handleDeleteProxies}
                icon={<DeleteRegular />}
                className={mergeClasses(
                  styles.btn,
                  isStarted ? "" : inlineStyles.danger
                )}
                disabled={isStarted}
              />
            </Tooltip>
            {url !== LOCAL_SERVERS && (
              <Tooltip
                content={t(TRANSLATION_KEY.COMMON_COPY_URL)}
                relationship="description"
              >
                <Button
                  onClick={handleCopyUrl}
                  icon={<ClipboardRegular />}
                  className={styles.btn}
                  disabled={isStarted}
                />
              </Tooltip>
            )}
            {url !== LOCAL_SERVERS && (
              <Tooltip
                content={t(TRANSLATION_KEY.UPDATE_CLASH_PROXIES)}
                relationship="description"
              >
                <Button
                  onClick={handleUpdateClashProxies}
                  icon={<ArrowSyncRegular />}
                  className={styles.btn}
                  disabled={isStarted}
                />
              </Tooltip>
            )}
          </div>
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
