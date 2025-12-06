import SensitiveInfo from "@/components/Core/SensitiveInfo";
import { EditModal, EditModalProps } from "@/components/Modal/Proxy";
import { QrCodeModal } from "@/components/Modal/QrCodeModal";
import {
  proxiesSelectors,
  proxiesSlice,
  type RootState,
  selectedSlice,
  subscriptionsSelectors,
  subscriptionsSlice,
} from "@/reducers";
import { OtherProxyTypeEnum, ROUTE_PARAM_MODE } from "@/utils/constants";
import { encode } from "@/utils/url";
import {
  createTableColumn,
  type DataGridProps,
  TableCellLayout,
  type TableColumnDefinition,
} from "@fluentui/react-components";
import {
  type BaseProxy,
  getProxies,
  getSubscriptions,
  ProxyTypeEnum,
  type SettingRes,
  type Shadowsocks,
  Subscription,
  updateSelectedProxyId,
} from "lux-js-sdk";
import * as React from "react";
import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ProxyCard, { LOCAL_SERVERS } from "./ProxyCard";
import { DelayTag } from "./ProxyCard/DelayTag";
import { Operation } from "./ProxyCard/Operation";
import styles from "./index.module.css";

export function Content(): React.ReactNode {
  const proxies = useSelector(proxiesSelectors.selectAll);
  const subscriptions = useSelector(subscriptionsSelectors.selectAll);

  const proxyGroups = useMemo(() => {
    const proxyMap: Record<string, BaseProxy[]> = {};
    subscriptions.forEach((subscription) => {
      proxyMap[subscription.id] = [];
    });
    proxies.forEach((proxy) => {
      if (proxy.subscription) {
        proxyMap[proxy.subscription] = [
          ...(proxyMap[proxy.subscription] || []),
          proxy,
        ];
      } else {
        proxyMap[LOCAL_SERVERS] = [...(proxyMap[LOCAL_SERVERS] || []), proxy];
      }
    });
    const groups = Object.keys(proxyMap).map((key) => ({
      id: key,
      proxies: proxyMap[key],
    }));
    const sortedIds = [
      LOCAL_SERVERS,
      ...subscriptions.map((s) => s.id).reverse(),
    ];
    return sortedIds
      .map((sortedId) => {
        const group = groups.find((g) => g.id === sortedId);
        if (!group) {
          return null;
        }
        return group;
      })
      .filter(Boolean) as typeof groups;
  }, [proxies, subscriptions]);

  const selectedId = useSelector<RootState, string>(
    (state) => state.selected.proxy,
  );
  const [isEditingDialogOpen, setIsEditingDialogOpen] = useState(false);
  const [curEditingData, setCurEditingData] = useState<
    BaseProxy | Subscription | null
  >(null);

  const dispatch = useDispatch();

  const [searchParams] = useSearchParams(window.location.search);

  const [isQrcodeModalOpen, setIsQrcodeModalOpen] = useState(false);

  const onEdit = (proxy: BaseProxy) => {
    setCurEditingData(proxy);
    setIsEditingDialogOpen(true);
  };

  const onShowQrCode = (proxy: BaseProxy) => {
    setCurEditingData(proxy);
    setIsQrcodeModalOpen(true);
  };

  const handleActionFromUrl = useEffectEvent((proxies: BaseProxy[]) => {
    const mode = searchParams.get("mode");
    const proxyId = searchParams.get("proxyId");
    if (typeof proxyId !== "string") {
      return;
    }
    const targetProxy = proxies.find((proxy) => proxy.id === proxyId);
    if (!targetProxy) {
      return;
    }
    if (mode === ROUTE_PARAM_MODE.EDIT) {
      onEdit(targetProxy);
    } else if (mode === ROUTE_PARAM_MODE.QR_CODE) {
      onShowQrCode(targetProxy);
    }
  });

  const init = useEffectEvent(async () => {
    const [proxiesRes, subscriptionsRes] = await Promise.all([
      getProxies(),
      getSubscriptions(),
    ]);
    dispatch(proxiesSlice.actions.received(proxiesRes));
    dispatch(selectedSlice.actions.setProxy({ id: proxiesRes.selectedId }));
    handleActionFromUrl(proxiesRes.proxies);

    dispatch(subscriptionsSlice.actions.received(subscriptionsRes));
  });

  useEffect(() => {
    init();
  }, []);

  const columns: Array<TableColumnDefinition<BaseProxy>> = [
    createTableColumn<BaseProxy>({
      columnId: "name",
      renderHeaderCell: () => {
        return "";
      },
      renderCell: (item) => {
        return (
          <TableCellLayout truncate>
            <div className={styles.desc}>
              <span className={styles.name}>
                <SensitiveInfo
                  value={item.name || `${item.server}:${item.port}`}
                ></SensitiveInfo>
              </span>
              <span className={styles.type}>{item.type}</span>
            </div>
          </TableCellLayout>
        );
      },
    }),
    createTableColumn<BaseProxy>({
      columnId: "action",
      renderHeaderCell: () => {
        return "";
      },
      renderCell: (item) => {
        return (
          <TableCellLayout truncate className={styles.action}>
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <DelayTag id={item.id} value={item.delay} />
              <Operation
                proxy={item}
                onEdit={onEdit}
                onShowQrCode={onShowQrCode}
              />
            </button>
          </TableCellLayout>
        );
      },
    }),
  ];

  const defaultSelectedItems = React.useMemo(
    () => new Set([selectedId]),
    [selectedId],
  );

  // TODO:optimize selector
  const setting = useSelector<RootState, SettingRes>((state) => state.setting);

  const isAutoMode = setting.autoMode.enabled;

  const handleSelect: DataGridProps["onSelectionChange"] = async (_, data) => {
    if (!isAutoMode) {
      const id = data.selectedItems.values().next().value;
      if (typeof id === "string") {
        await updateSelectedProxyId({ id });
        dispatch(selectedSlice.actions.setProxy({ id }));
      }
    }
  };

  const handleEditSubscription = (data: Subscription) => {
    setCurEditingData(data);
    setIsEditingDialogOpen(true);
  };

  const editModalType = useMemo(() => {
    if (!curEditingData) {
      return ProxyTypeEnum.Socks5;
    }
    if ("type" in curEditingData) {
      return curEditingData.type;
    }
    return OtherProxyTypeEnum.Subscription;
  }, [curEditingData]);

  const preProxiesLength = useRef(proxies.length);
  const listRef = useRef<HTMLDivElement>(null);

  const isOperatingProxySelected = useSelector<RootState, boolean>(
    (state) => state.selected.proxy === curEditingData?.id,
  );

  useEffect(() => {
    if (
      listRef.current &&
      preProxiesLength.current !== 0 &&
      proxies.length > preProxiesLength.current
    ) {
      listRef.current.scrollTop = 0;
    }
    preProxiesLength.current = proxies.length;
  }, [proxies.length]);

  return (
    <>
      {isQrcodeModalOpen && curEditingData && (
        <QrCodeModal
          url={encode(curEditingData as Shadowsocks)}
          close={() => {
            setIsQrcodeModalOpen(false);
          }}
        />
      )}
      {isEditingDialogOpen && curEditingData && (
        <EditModal
          close={() => {
            setIsEditingDialogOpen(false);
          }}
          initialValue={curEditingData}
          type={editModalType as EditModalProps["type"]}
          isSelected={isOperatingProxySelected}
        />
      )}
      <div className={styles.wrapper} ref={listRef}>
        {proxyGroups.map((group) => {
          return (
            <ProxyCard
              key={group.id}
              columns={columns}
              data={group.proxies}
              selectionMode={isAutoMode ? undefined : "single"}
              onSelectionChange={handleSelect}
              selectedItems={defaultSelectedItems}
              id={group.id}
              onEditSubscription={handleEditSubscription}
            />
          );
        })}
      </div>
    </>
  );
}
