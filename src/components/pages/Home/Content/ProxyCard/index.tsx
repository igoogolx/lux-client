import { notifier, Table } from "@/components/Core";
import SensitiveInfo from "@/components/Core/SensitiveInfo";
import { DeleteAllProxiesConfirmModal } from "@/components/Modal/DeleteAllProxiesConfirmModal";
import { useDangerStyles } from "@/hooks";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import {
  generalSlice,
  proxiesSlice,
  type RootState,
  subscriptionsSelectors,
  subscriptionsSlice,
} from "@/reducers";
import { formatError } from "@/utils/error";
import { decodeFromUrl } from "@/utils/url";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Badge,
  Button,
  Card,
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
import axios from "axios";
import {
  addProxiesFromSubscriptionUrl,
  deleteProxies,
  deleteSubscription,
} from "lux-js-sdk";
import React, { MouseEventHandler, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";

export interface ProxyCardProps<T> {
  id: string;
  data: T[];
  columns: Array<TableColumnDefinition<T>>;
  selectionMode?: DataGridProps["selectionMode"];
  selectedItems?: DataGridProps["selectedItems"];
  onSelectionChange?: DataGridProps["onSelectionChange"];
}

export const LOCAL_SERVERS = "local_servers";

export default function ProxyCard<T extends { id: string }>(
  props: Readonly<ProxyCardProps<T>>,
): React.ReactNode {
  const { id, data, selectionMode, columns, selectedItems, onSelectionChange } =
    props;
  const { t } = useTranslation();

  const subscriptions = useSelector(subscriptionsSelectors.selectAll);

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared,
  );

  const [isDeleteAllProxiesModalOpen, setIsDeleteAllProxiesModalOpen] =
    useState(false);

  const dispatch = useDispatch();
  const handleUpdateSubscriptionProxies: MouseEventHandler = async (e) => {
    try {
      e.stopPropagation();
      dispatch(generalSlice.actions.setLoading({ loading: true }));
      const decodedProxies = await decodeFromUrl(id);
      const res = await addProxiesFromSubscriptionUrl({
        proxies: decodedProxies,
        subscriptionUrl: id,
      });
      dispatch(proxiesSlice.actions.received({ proxies: res.proxies }));
      dispatch(
        subscriptionsSlice.actions.received({
          subscriptions: res.subscriptions,
        }),
      );
      notifier.success(t(TRANSLATION_KEY.UPDATE_SUCCESS));
    } catch (e) {
      if (!axios.isAxiosError(e)) {
        notifier.error(formatError(e));
      }
    } finally {
      dispatch(generalSlice.actions.setLoading({ loading: false }));
    }
  };

  const handleDeleteProxies = async () => {
    try {
      const proxyIds = data.map((item) => item.id);
      if (id === LOCAL_SERVERS) {
        await deleteProxies({ ids: proxyIds });
      } else {
        await deleteSubscription({ id });
      }

      dispatch(subscriptionsSlice.actions.deleteOne({ id }));
      dispatch(proxiesSlice.actions.deleteMany({ ids: proxyIds }));
      notifier.success(t(TRANSLATION_KEY.UPDATE_SUCCESS));
    } catch (e) {
      if (!axios.isAxiosError(e)) {
        notifier.error(formatError(e));
      }
    }
  };

  const handleCopyUrl: MouseEventHandler = async (e) => {
    e.stopPropagation();
    const subscription = subscriptions.find((item) => item.id === id);
    if (!subscription) {
      return "";
    }
    await navigator.clipboard.writeText(subscription.url);
    notifier.success(t(TRANSLATION_KEY.COPIED));
  };

  const inlineStyles = useDangerStyles();

  const closeDeleteAllProxiesModal = () => {
    setIsDeleteAllProxiesModalOpen(false);
  };

  const openDeleteAllProxiesModal: MouseEventHandler = (e) => {
    e.stopPropagation();
    setIsDeleteAllProxiesModalOpen(true);
  };

  const title = useMemo(() => {
    if (id === LOCAL_SERVERS) {
      return t(TRANSLATION_KEY.LOCAL_SERVERS);
    }
    const subscription = subscriptions.find((item) => item.id === id);
    if (!subscription) {
      return "";
    }
    if (subscription.name) {
      return subscription.name;
    }
    if (subscription.url) {
      const bigUrl = URL.parse(subscription.url);
      if (bigUrl) {
        return bigUrl.hostname;
      }
    }
    return "";
  }, [id, subscriptions, t]);

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
          <AccordionHeader>
            <div className={styles.header}>
              <Badge appearance="outline" size="large">
                <SensitiveInfo value={title} />
              </Badge>
              <div className={styles.action}>
                <Tooltip
                  content={t(TRANSLATION_KEY.COMMON_DELETE)}
                  relationship="description"
                >
                  <Button
                    as={"a"}
                    onClick={openDeleteAllProxiesModal}
                    icon={<DeleteRegular />}
                    className={mergeClasses(
                      styles.btn,
                      isStarted ? "" : inlineStyles.danger,
                    )}
                    disabled={isStarted}
                  />
                </Tooltip>
                {id !== LOCAL_SERVERS && (
                  <Tooltip
                    content={t(TRANSLATION_KEY.COMMON_COPY_URL)}
                    relationship="description"
                  >
                    <Button
                      as={"a"}
                      onClick={handleCopyUrl}
                      icon={<ClipboardRegular />}
                      className={styles.btn}
                    />
                  </Tooltip>
                )}
                {id !== LOCAL_SERVERS && (
                  <Tooltip
                    content={t(TRANSLATION_KEY.UPDATE_SUBSCRIPTION_PROXIES)}
                    relationship="description"
                  >
                    <Button
                      as={"a"}
                      onClick={handleUpdateSubscriptionProxies}
                      icon={<ArrowSyncRegular />}
                      className={styles.btn}
                    />
                  </Tooltip>
                )}
              </div>
            </div>
          </AccordionHeader>
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
