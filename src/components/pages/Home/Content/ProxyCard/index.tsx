import { notifier, Table } from "@/components/Core";
import { DeleteAllProxiesConfirmModal } from "@/components/Modal/DeleteAllProxiesConfirmModal";
import { useDangerStyles } from "@/hooks";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { generalSlice, proxiesSlice, type RootState } from "@/reducers";
import { decodeFromUrl } from "@/utils/url";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Badge,
  Button,
  Card,
  CardHeader,
  type DataGridProps,
  mergeClasses,
  type TableColumnDefinition,
  Tooltip,
} from "@fluentui/react-components";
import {
  ArrowSyncRegular,
  ClipboardRegular,
  DeleteRegular,
} from "@fluentui/react-icons";
import { addProxiesFromSubscriptionUrl, deleteProxies } from "lux-js-sdk";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";

export interface ProxyCardProps<T> {
  url: string;
  data: T[];
  columns: Array<TableColumnDefinition<T>>;
  selectionMode?: DataGridProps["selectionMode"];
  selectedItems?: DataGridProps["selectedItems"];
  onSelectionChange?: DataGridProps["onSelectionChange"];
}

export const LOCAL_SERVERS = "local_servers";

export default function ProxyCard<T extends { id: string }>(
  props: ProxyCardProps<T>,
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
    (state) => state.manager.isStared,
  );

  const [isDeleteAllProxiesModalOpen, setIsDeleteAllProxiesModalOpen] =
    useState(false);

  const dispatch = useDispatch();
  const handleUpdateSubscriptionProxies = async () => {
    try {
      dispatch(generalSlice.actions.setLoading({ loading: true }));
      const decodedProxies = await decodeFromUrl(url);
      const res = await addProxiesFromSubscriptionUrl({
        proxies: decodedProxies,
        subscriptionUrl: url,
      });
      dispatch(proxiesSlice.actions.received({ proxies: res.proxies }));
      notifier.success(t(TRANSLATION_KEY.UPDATE_SUCCESS));
    } catch (e) {
      notifier.error(`fail to update proxies, error:${e}`);
    } finally {
      dispatch(generalSlice.actions.setLoading({ loading: false }));
    }
  };

  const handleDeleteProxies = async () => {
    try {
      const ids = data.map((item) => item.id);
      await deleteProxies({ ids: data.map((item) => item.id) });
      dispatch(proxiesSlice.actions.deleteMany({ ids }));
      notifier.success(t(TRANSLATION_KEY.UPDATE_SUCCESS));
    } catch (e) {
      notifier.error(`fail to delete proxies, error:${e}`);
    }
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(url);
    notifier.success(t(TRANSLATION_KEY.COPIED));
  };

  const inlineStyles = useDangerStyles();

  const closeDeleteAllProxiesModal = () => {
    setIsDeleteAllProxiesModalOpen(false);
  };

  const openDeleteAllProxiesModal = () => {
    setIsDeleteAllProxiesModalOpen(true);
  };

  const title =
    url === LOCAL_SERVERS
      ? t(TRANSLATION_KEY.LOCAL_SERVERS)
      : new URL(url).hostname;

  return (
    <Card className={styles.card}>
      {isDeleteAllProxiesModalOpen && (
        <DeleteAllProxiesConfirmModal
          onClose={closeDeleteAllProxiesModal}
          onConfirm={handleDeleteProxies}
          title={title}
        />
      )}
      <Accordion collapsible defaultOpenItems={["1"]}>
        <AccordionItem value="1">
          <CardHeader
            header={
              <AccordionHeader>
                <Badge appearance="outline" size="large">
                  {title}
                </Badge>
              </AccordionHeader>
            }
            className={styles.header}
            action={
              <div className={styles.action}>
                <Tooltip
                  content={t(TRANSLATION_KEY.COMMON_DELETE)}
                  relationship="description"
                >
                  <Button
                    onClick={openDeleteAllProxiesModal}
                    icon={<DeleteRegular />}
                    className={mergeClasses(
                      styles.btn,
                      isStarted ? "" : inlineStyles.danger,
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
                    />
                  </Tooltip>
                )}
                {url !== LOCAL_SERVERS && (
                  <Tooltip
                    content={t(TRANSLATION_KEY.UPDATE_SUBSCRIPTION_PROXIES)}
                    relationship="description"
                  >
                    <Button
                      onClick={handleUpdateSubscriptionProxies}
                      icon={<ArrowSyncRegular />}
                      className={styles.btn}
                    />
                  </Tooltip>
                )}
              </div>
            }
          />
          <AccordionPanel>
            <Table
              columns={columns}
              data={data}
              selectionMode={selectionMode}
              onSelectionChange={onSelectionChange}
              selectedItems={selectedItems}
              getRowId={(item) => item.id}
              virtualized={false}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
