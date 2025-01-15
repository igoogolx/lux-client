import { Table } from "@/components/Core";
import { AddRuleModal } from "@/components/Modal/AddRuleModal";
import RuleCell from "@/components/pages/Data/Connections/RuleTag";
import { useDangerStyles } from "@/hooks";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import type { RootState } from "@/reducers";
import { CUSTOMIZED_RULE_ID } from "@/utils/constants";
import {
  Button,
  createTableColumn,
  SearchBox,
  TableCellLayout,
  Tooltip,
} from "@fluentui/react-components";
import { AddFilled, DeleteRegular, EditRegular } from "@fluentui/react-icons";
import { type TableColumnDefinition } from "@fluentui/react-table";
import { t } from "i18next";
import {
  addCustomizedRules,
  deleteCustomizedRules,
  editCustomizedRule,
  getRuleDetail,
  type RuleDetailItem,
} from "lux-js-sdk";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./index.module.css";

interface RuleTableProps {
  id: string;
}

function calcTableHeight() {
  return document.documentElement.clientHeight - 48 - 68 - 44 - 32 - 16;
}

function formatRule(rule: RuleDetailItem) {
  return `${rule.ruleType.trim()},${rule.payload.trim()},${rule.policy.trim()}`;
}

export default function RuleTable(props: Readonly<RuleTableProps>) {
  const { id } = props;

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared,
  );

  const [rules, setRules] = useState<RuleDetailItem[]>([]);

  const [searchedValue, setSearchedValue] = useState("");

  const [editingRule, setEditingRule] = useState<RuleDetailItem | undefined>();

  const [isAddingRule, setIsAddingRule] = useState(false);

  const inlineStyles = useDangerStyles();

  const refresh = useCallback(async () => {
    if (id) {
      getRuleDetail(id).then((res) => {
        setRules(res.items || []);
      });
    }
  }, [id]);

  useEffect(() => {
    refresh().catch((e) => {
      console.log(e);
    });
  }, [refresh]);

  const handleDeleteCustomizedRule = useCallback(
    async (rule: RuleDetailItem) => {
      await deleteCustomizedRules([formatRule(rule)]);
      await refresh();
    },
    [refresh],
  );

  const handleEditCustomizedRule = useCallback(
    async (rule: RuleDetailItem) => {
      setEditingRule(rule);
      setIsAddingRule(true);
      await refresh();
    },
    [refresh],
  );

  const handleAddRule = useCallback(
    async (value: RuleDetailItem) => {
      const newRule = formatRule(value);
      if (editingRule) {
        const oldRule = formatRule(editingRule);
        await editCustomizedRule(oldRule, newRule);
      } else {
        await addCustomizedRules([newRule]);
      }
      await refresh();
    },
    [editingRule, refresh],
  );

  const data = useMemo(() => {
    return rules.filter((conn) => {
      if (searchedValue) {
        return [conn.payload, conn.policy, conn.ruleType].some((value) => {
          return value
            .toLocaleLowerCase()
            .includes(searchedValue.toLocaleLowerCase());
        });
      }
      return true;
    });
  }, [rules, searchedValue]);

  const columns = useMemo<Array<TableColumnDefinition<RuleDetailItem>>>(() => {
    return [
      createTableColumn<RuleDetailItem>({
        columnId: "ruleType",
        renderHeaderCell: () => {
          return t(TRANSLATION_KEY.TYPE);
        },
        renderCell: (item) => {
          return <TableCellLayout truncate>{item.ruleType}</TableCellLayout>;
        },
      }),
      createTableColumn<RuleDetailItem>({
        columnId: "payload",
        renderHeaderCell: () => {
          return t(TRANSLATION_KEY.PAYLOAD);
        },
        renderCell: (item) => {
          return <TableCellLayout truncate>{item.payload}</TableCellLayout>;
        },
      }),
      createTableColumn<RuleDetailItem>({
        columnId: "policy",
        renderHeaderCell: () => {
          return t(TRANSLATION_KEY.POLICY);
        },
        renderCell: (item) => {
          return <RuleCell value={item} />;
        },
      }),
      id === CUSTOMIZED_RULE_ID
        ? createTableColumn<RuleDetailItem>({
            columnId: "action",
            renderHeaderCell: () => {
              return "";
            },
            renderCell: (item) => {
              return (
                <TableCellLayout truncate>
                  <Button
                    icon={<DeleteRegular className={inlineStyles.danger} />}
                    disabled={isStarted}
                    onClick={() => {
                      handleDeleteCustomizedRule(item).catch((e) => {
                        console.log(e);
                      });
                    }}
                  />
                  <Button
                    icon={<EditRegular />}
                    disabled={isStarted}
                    onClick={() => {
                      handleEditCustomizedRule(item).catch((e) => {
                        console.log(e);
                      });
                    }}
                  />
                </TableCellLayout>
              );
            },
          })
        : null,
    ].filter(Boolean) as Array<TableColumnDefinition<RuleDetailItem>>;
  }, [
    handleDeleteCustomizedRule,
    handleEditCustomizedRule,
    id,
    inlineStyles.danger,
    isStarted,
  ]);

  const [tableHeight, setTableHeight] = useState(calcTableHeight());

  const onResize = useCallback(() => {
    setTableHeight(calcTableHeight());
  }, []);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  return (
    <div className={styles.wrapper}>
      {isAddingRule && (
        <AddRuleModal
          initValue={editingRule}
          close={() => {
            setIsAddingRule(false);
          }}
          onSave={handleAddRule}
        />
      )}
      <div className={styles.toolbar}>
        <SearchBox
          value={searchedValue}
          onChange={(_, data) => {
            setSearchedValue(data.value);
          }}
          placeholder={t(TRANSLATION_KEY.SEARCH_RULE_TIP)}
          className={styles.input}
        />
        <div className={styles.actions}>
          {id === CUSTOMIZED_RULE_ID && (
            <Tooltip
              content={t(TRANSLATION_KEY.ADD_RULE)}
              relationship="description"
            >
              <Button
                onClick={() => {
                  setIsAddingRule(true);
                  setEditingRule(undefined);
                }}
                className={styles.closeAll}
                icon={<AddFilled />}
                disabled={isStarted}
              />
            </Tooltip>
          )}
        </div>
      </div>
      <Table columns={columns} data={data} sortable height={tableHeight} />
    </div>
  );
}
