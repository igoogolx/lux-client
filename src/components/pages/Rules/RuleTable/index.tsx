import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { type TableColumnDefinition } from '@fluentui/react-table'
import {
  Button,
  createTableColumn,
  SearchBox,
  TableCellLayout,
  Tooltip
} from '@fluentui/react-components'
import { TRANSLATION_KEY } from '@/i18n/locales/key'
import {
  addCustomizedRules,
  deleteCustomizedRules,
  getRuleDetail,
  type RuleDetailItem
} from 'lux-js-sdk'
import { t } from 'i18next'
import { Table } from '@/components/Core'
import RuleCell from '@/components/pages/Data/Connections/RuleTag'
import styles from './index.module.css'
import { AddFilled, DeleteRegular } from '@fluentui/react-icons'
import { AddRuleModal } from '@/components/Modal/AddRuleModal'
import { CUSTOMIZED_RULE_ID } from '@/utils/constants'
import { useSelector } from 'react-redux'
import type { RootState } from '@/reducers'

interface RuleTableProps {
  id: string
}

export default function RuleTable (props: RuleTableProps) {
  const { id } = props

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared
  )

  const [rules, setRules] = useState<RuleDetailItem[]>([])

  const [searchedValue, setSearchedValue] = useState('')

  const [isAddingRule, setIsAddingRule] = useState(false)

  const refresh = useCallback(async () => {
    if (id) {
      getRuleDetail(id).then((res) => {
        setRules(res.items || [])
      })
    }
  }, [id])

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleDeleteCustomizedRule = useCallback(
    async (rule: RuleDetailItem) => {
      await deleteCustomizedRules([
        `${rule.ruleType},${rule.payload},${rule.policy}`
      ])
      await refresh()
    },
    [refresh]
  )

  const handleAddRule = useCallback(
    async (newRule: RuleDetailItem) => {
      await addCustomizedRules([
        `${newRule.ruleType},${newRule.payload},${newRule.policy}`
      ])
      await refresh()
    },
    [refresh]
  )

  const data = useMemo(() => {
    return rules.filter((conn) => {
      if (searchedValue) {
        return [conn.payload, conn.policy, conn.ruleType].some((value) => {
          return value
            .toLocaleLowerCase()
            .includes(searchedValue.toLocaleLowerCase())
        })
      }
      return true
    })
  }, [rules, searchedValue])

  const columns = useMemo<Array<TableColumnDefinition<RuleDetailItem>>>(() => {
    return [
      createTableColumn<RuleDetailItem>({
        columnId: 'ruleType',
        renderHeaderCell: () => {
          return t(TRANSLATION_KEY.TYPE)
        },
        renderCell: (item) => {
          return <TableCellLayout truncate>{item.ruleType}</TableCellLayout>
        }
      }),
      createTableColumn<RuleDetailItem>({
        columnId: 'payload',
        renderHeaderCell: () => {
          return t(TRANSLATION_KEY.PAYLOAD)
        },
        renderCell: (item) => {
          return <TableCellLayout truncate>{item.payload}</TableCellLayout>
        }
      }),
      createTableColumn<RuleDetailItem>({
        columnId: 'policy',
        renderHeaderCell: () => {
          return t(TRANSLATION_KEY.POLICY)
        },
        renderCell: (item) => {
          return <RuleCell value={item} />
        }
      }),
      id === CUSTOMIZED_RULE_ID
        ? createTableColumn<RuleDetailItem>({
          columnId: 'action',
          renderHeaderCell: () => {
            return ''
          },
          renderCell: (item) => {
            return (
                <TableCellLayout truncate>
                  <div
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  >
                    <Button
                      icon={<DeleteRegular />}
                      onClick={() => {
                        handleDeleteCustomizedRule(item)
                      }}
                    />
                  </div>
                </TableCellLayout>
            )
          }
        })
        : null
    ].filter(Boolean) as Array<TableColumnDefinition<RuleDetailItem>>
  }, [handleDeleteCustomizedRule, id])
  return (
    <div className={styles.wrapper}>
      {isAddingRule && (
        <AddRuleModal
          close={() => {
            setIsAddingRule(false)
          }}
          onSave={handleAddRule}
        />
      )}
      <div className={styles.toolbar}>
        <SearchBox
          value={searchedValue}
          onChange={(e, data) => {
            setSearchedValue(data.value)
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
                  setIsAddingRule(true)
                }}
                className={styles.closeAll}
                icon={<AddFilled />}
                disabled={isStarted}
              />
            </Tooltip>
          )}
        </div>
      </div>
      <Table columns={columns} data={data} sortable />
    </div>
  )
}
