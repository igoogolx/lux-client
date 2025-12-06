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
  makeStyles,
  mergeClasses,
  type TableColumnDefinition,
  Tooltip,
  typographyStyles,
} from "@fluentui/react-components";
import {
  ArrowSyncRegular,
  DeleteRegular,
  EditRegular,
} from "@fluentui/react-icons";
import axios from "axios";
import classNames from "classnames";
import {
  deleteProxies,
  deleteSubscription,
  Subscription,
  updateSubscriptionProxies,
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
  onEditSubscription: (data: Subscription) => void;
}

export const LOCAL_SERVERS = "local_servers";

const useStyles = makeStyles({
  caption2: typographyStyles.caption2,
});

export default function ProxyCard<T extends { id: string }>(
  props: Readonly<ProxyCardProps<T>>,
): React.ReactNode {
  const {
    id,
    data,
    selectionMode,
    columns,
    selectedItems,
    onSelectionChange,
    onEditSubscription,
  } = props;
  const { t } = useTranslation();
  const typographyStyles = useStyles();

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
      if (!curSubscription) {
        return;
      }
      const decodedProxies = await decodeFromUrl(curSubscription.url);
      const res = await updateSubscriptionProxies({
        proxies: decodedProxies,
        subscriptionId: id,
      });
      dispatch(proxiesSlice.actions.received({ proxies: res.proxies }));
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

  const handleEdit: MouseEventHandler = async (e) => {
    e.stopPropagation();
    const subscription = subscriptions.find((item) => item.id === id);
    if (!subscription) {
      return;
    }
    onEditSubscription(subscription);
  };

  const inlineStyles = useDangerStyles();

  const closeDeleteAllProxiesModal = () => {
    setIsDeleteAllProxiesModalOpen(false);
  };

  const openDeleteAllProxiesModal: MouseEventHandler = (e) => {
    e.stopPropagation();
    setIsDeleteAllProxiesModalOpen(true);
  };

  const curSubscription = useMemo(() => {
    const subscription = subscriptions.find((item) => item.id === id);
    if (!subscription) {
      return null;
    }
    return subscription;
  }, [id, subscriptions]);

  const title = useMemo(() => {
    if (id === LOCAL_SERVERS) {
      return t(TRANSLATION_KEY.LOCAL_SERVERS);
    }
    if (!curSubscription) {
      return "";
    }
    if (curSubscription.name) {
      return curSubscription.name;
    }
    if (curSubscription.url) {
      const bigUrl = URL.parse(curSubscription.url);
      if (bigUrl) {
        return bigUrl.hostname;
      }
    }
    return "";
  }, [curSubscription, id, t]);

  const subTitle = useMemo(() => {
    if (!curSubscription) {
      return "";
    }
    return curSubscription.remark;
  }, [curSubscription]);

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
              <div className={styles.title}>
                <Badge appearance="outline" size="large">
                  <SensitiveInfo value={title} />
                </Badge>
                {!!subTitle && (
                  <span
                    className={classNames(
                      typographyStyles.caption2,
                      styles.subTitle,
                    )}
                  >
                    {subTitle}
                  </span>
                )}
              </div>
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
                    content={t(TRANSLATION_KEY.COMMON_EDIT)}
                    relationship="description"
                  >
                    <Button
                      as={"a"}
                      onClick={handleEdit}
                      icon={<EditRegular />}
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
