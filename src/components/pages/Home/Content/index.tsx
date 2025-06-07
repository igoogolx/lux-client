import SensitiveInfo from "@/components/Core/SensitiveInfo";
import {
  proxiesSelectors,
  proxiesSlice,
  type RootState,
  selectedSlice,
} from "@/reducers";
import {
  createTableColumn,
  type DataGridProps,
  TableCellLayout,
  type TableColumnDefinition,
} from "@fluentui/react-components";
import {
  type BaseProxy,
  getProxies, ProxyTypeEnum,
  type SettingRes, type Shadowsocks,
  updateSelectedProxyId,
} from "lux-js-sdk";
import * as React from "react";
import {useEffect, useMemo, useRef, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import ProxyCard, { LOCAL_SERVERS } from "./ProxyCard";
import { DelayTag } from "./ProxyCard/DelayTag";
import { Operation } from "./ProxyCard/Operation";
import styles from "./index.module.css";
import {QrCodeModal} from "@/components/Modal/QrCodeModal";
import {encode} from "@/utils/url";
import {EditModal} from "@/components/Modal/Proxy";

export function Content(): React.ReactNode {
  const proxies = useSelector(proxiesSelectors.selectAll);

  const proxyMap = useMemo(() => {
    const res: Record<string, BaseProxy[]> = {};
    proxies.forEach((proxy) => {
      if (proxy.subscriptionUrl) {
        res[proxy.subscriptionUrl] = [
          ...(res[proxy.subscriptionUrl] || []),
          proxy,
        ];
      } else {
        res[LOCAL_SERVERS] = [...(res[LOCAL_SERVERS] || []), proxy];
      }
    });
    return res;
  }, [proxies]);

  const selectedId = useSelector<RootState, string>(
    (state) => state.selected.proxy,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    getProxies().then((data) => {
      dispatch(proxiesSlice.actions.received(data));
      dispatch(selectedSlice.actions.setProxy({ id: data.selectedId }));
    });
  }, [dispatch]);

  const onEdit = (proxy: BaseProxy) => {
    setOperatingProxy(proxy);
    setIsEditingDialogOpen(true);
  }

  const onShowQrCode = (proxy: BaseProxy) => {
    setOperatingProxy(proxy);
    setIsQrcodeModalOpen(true);
  }

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
              <Operation proxy={item} onEdit={onEdit} onShowQrCode={onShowQrCode}/>
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

  const preProxiesLength = useRef(proxies.length);
  const listRef = useRef<HTMLDivElement>(null);

  const [isEditingDialogOpen, setIsEditingDialogOpen] = useState(false);
  const [isQrcodeModalOpen, setIsQrcodeModalOpen] = useState(false);

  const [operatingProxy, setOperatingProxy] = useState<BaseProxy | null>(null);

  const isOperatingProxySelected = useSelector<RootState, boolean>(
      (state) => state.selected.proxy === operatingProxy?.id,
  );

  useEffect(() => {
    if (
      listRef.current &&
      preProxiesLength.current !== 0 &&
      proxies.length > preProxiesLength.current
    ) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
    preProxiesLength.current = proxies.length;
  }, [proxies.length]);

  return (
      <>
        {isQrcodeModalOpen && operatingProxy && (
            <QrCodeModal
                url={encode(operatingProxy as Shadowsocks)}
                close={() => {
                  setIsQrcodeModalOpen(false);
                }}
            />
        )}
        {isEditingDialogOpen && operatingProxy && (
            <EditModal
                close={() => {
                  setIsEditingDialogOpen(false);
                }}
                initialValue={operatingProxy}
                type={operatingProxy.type as ProxyTypeEnum}
                isSelected={isOperatingProxySelected}
            />
        )}
        <div className={styles.wrapper} ref={listRef}>
          {Object.keys(proxyMap).map((key) => {
            return (
                <ProxyCard
                    key={key}
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
      </>

  );
}
