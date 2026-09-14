import { Modal, notifier, Table } from "@/components/Core";
import { useDangerStyles } from "@/hooks";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { type RootState, settingSlice } from "@/reducers";
import {
  DNS_PAYLOAD_PLACEHOLDER,
  DNS_SERVER_TYPE,
  DNS_TYPE_OPTIONS,
  DNS_TYPE_TRANSLATION,
} from "@/utils/constants.ts";
import {
  Button,
  createTableColumn,
  Dropdown,
  Input,
  Option,
  TableCellLayout,
  Tooltip,
} from "@fluentui/react-components";
import { DeleteRegular } from "@fluentui/react-icons";
import { type TableColumnDefinition } from "@fluentui/react-table";
import { t } from "i18next";
import {
  getSetting,
  setSetting,
  type SettingRes,
  validateDnsServer,
} from "lux-js-sdk";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";

interface AddDnsOptionModalProps {
  close: () => void;
}

interface DnsOption {
  type: string;
  payload: string;
  value: string;
}

export default function AddDnsOptionModal(
  props: Readonly<AddDnsOptionModalProps>,
) {
  const { close } = props;

  const [newDnsPayload, setNewDnsPayload] = useState("");
  const [newDnsType, setNewDnsType] = useState(DNS_SERVER_TYPE.UDP);
  const setting = useSelector<RootState, SettingRes>((state) => state.setting);
  const dispatch = useDispatch();

  const inlineStyles = useDangerStyles();

  const refresh = useCallback(async () => {
    getSetting().then((res) => {
      dispatch(settingSlice.actions.setSetting(res));
    });
  }, [dispatch]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleDeleteCustomizedOption = useCallback(
    async (option: DnsOption) => {
      const newDns = { ...setting.dns, server: { ...setting.dns.server } };
      newDns.customizedOptions = setting.dns.customizedOptions.filter(
        (item) => item !== option.value,
      );
      newDns.server.remote = setting.dns.server.remote.filter(
        (item) => item !== option.value,
      );
      newDns.server.local = setting.dns.server.local.filter(
        (item) => item !== option.value,
      );
      newDns.server.boost = setting.dns.server.boost.filter(
        (item) => item !== option.value,
      );
      const newSetting = {
        ...setting,
        dns: newDns,
      };
      await setSetting(newSetting);
      dispatch(settingSlice.actions.setSetting(newSetting));
      notifier.success(t(TRANSLATION_KEY.SAVE_SUCCESS));
      await refresh();
    },
    [dispatch, refresh, setting],
  );

  const handleAddCustomizedOption = useCallback(async () => {
    const newOption = `${newDnsType}://${newDnsPayload}`;

    await validateDnsServer({ servers: [newOption] });

    const newSetting = {
      ...setting,
      dns: {
        ...setting.dns,
        customizedOptions: [...setting.dns.customizedOptions, newOption],
      },
    };
    await setSetting(newSetting);
    dispatch(settingSlice.actions.setSetting(newSetting));
    notifier.success(t(TRANSLATION_KEY.SAVE_SUCCESS));
    await refresh();
  }, [newDnsType, newDnsPayload, setting, dispatch, refresh]);

  const data = useMemo(() => {
    return setting.dns.customizedOptions
      .map((option) => {
        try {
          const [type, payload] = option.split("://");
          return { type, payload, value: option };
        } catch {
          return null;
        }
      })
      .filter(Boolean) as DnsOption[];
  }, [setting.dns.customizedOptions]);

  const columns = useMemo<Array<TableColumnDefinition<DnsOption>>>(() => {
    return [
      createTableColumn<DnsOption>({
        columnId: "type",
        renderHeaderCell: () => {
          return t(TRANSLATION_KEY.TYPE);
        },
        renderCell: (item) => {
          return (
            <TableCellLayout truncate>
              {DNS_TYPE_TRANSLATION[item.type]}
            </TableCellLayout>
          );
        },
      }),
      createTableColumn<DnsOption>({
        columnId: "payload",
        renderHeaderCell: () => {
          return t(TRANSLATION_KEY.PAYLOAD);
        },
        renderCell: (item) => {
          return <TableCellLayout truncate>{item.payload}</TableCellLayout>;
        },
      }),
      createTableColumn<DnsOption>({
        columnId: "action",
        renderHeaderCell: () => {
          return "";
        },
        renderCell: (item: DnsOption) => {
          return (
            <TableCellLayout truncate>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Button
                  icon={<DeleteRegular />}
                  className={inlineStyles.danger}
                  onClick={() => {
                    void handleDeleteCustomizedOption(item);
                  }}
                />
              </div>
            </TableCellLayout>
          );
        },
      }),
    ].filter(Boolean) as Array<TableColumnDefinition<DnsOption>>;
  }, [handleDeleteCustomizedOption, inlineStyles.danger]);

  const handleSubmit = (value: DNS_SERVER_TYPE) => {
    setNewDnsType(value);
  };

  const isAddBtnDisabled = newDnsPayload.trim().length === 0;

  return (
    <Modal
      close={close}
      hideCloseButton={true}
      title={t(TRANSLATION_KEY.NEW_CUSTOMIZED_DNS_OPTION)}
    >
      <div className={styles.wrapper}>
        <div className={styles.toolbar}>
          <Dropdown
            className={styles.select}
            value={DNS_TYPE_TRANSLATION[newDnsType]}
            onOptionSelect={(_, data) => {
              setNewDnsPayload("");
              handleSubmit(data.optionValue as DNS_SERVER_TYPE);
            }}
          >
            {DNS_TYPE_OPTIONS.map((option) => (
              <Option key={option.id} value={option.id}>
                {option.content}
              </Option>
            ))}
          </Dropdown>

          <Input
            value={newDnsPayload}
            onChange={(e) => {
              setNewDnsPayload(e.target.value.trim());
            }}
            placeholder={DNS_PAYLOAD_PLACEHOLDER[newDnsType]}
            className={styles.input}
          />
          <div className={styles.actions}>
            {
              <Tooltip
                content={t(TRANSLATION_KEY.ADD_RULE)}
                relationship="description"
              >
                <Button
                  appearance={"primary"}
                  onClick={handleAddCustomizedOption}
                  className={styles.closeAll}
                  disabled={isAddBtnDisabled}
                >
                  {t(TRANSLATION_KEY.ADD)}
                </Button>
              </Tooltip>
            }
          </div>
        </div>
        <Table columns={columns} data={data} sortable />
      </div>
    </Modal>
  );
}
