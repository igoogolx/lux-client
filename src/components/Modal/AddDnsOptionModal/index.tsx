import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { type TableColumnDefinition } from '@fluentui/react-table'
import { Button, createTableColumn, Input, TableCellLayout, Tooltip } from '@fluentui/react-components'
import { TRANSLATION_KEY } from '@/i18n/locales/key'
import { deleteCustomizedRules, getRuleDetail, type RuleDetailItem } from 'lux-js-sdk'
import { t } from 'i18next'
import { Modal, Table } from '@/components/Core'
import styles from './index.module.css'
import { AddFilled, DeleteRegular, SearchRegular } from '@fluentui/react-icons'

interface RuleTableProps {
  id: string
}

export default function AddDnsOptionModal (props: RuleTableProps) {
  const { id } = props

  const [rules, setRules] = useState<RuleDetailItem[]>([])

  const [searchedValue, setSearchedValue] = useState('')

  const refresh = useCallback(async () => {
    if (id) {
      getRuleDetail(id).then(res => {
        setRules(res.items || [])
      })
    }
  }, [id])

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleDeleteCustomizedRule = useCallback(async (rule: RuleDetailItem) => {
    await deleteCustomizedRules([`${rule.ruleType},${rule.payload},${rule.policy}`])
    await refresh()
  }, [refresh])

  const data = useMemo(() => {
    return rules
      .filter((conn) => {
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
        columnId: 'action',
        renderHeaderCell: () => {
          return ''
        },
        renderCell: (item) => {
          return (
            <TableCellLayout truncate >
              <div
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <Button icon={<DeleteRegular />} onClick={() => { handleDeleteCustomizedRule(item) }} />
              </div>
            </TableCellLayout>
          )
        }
      })

    ].filter(Boolean) as Array<TableColumnDefinition<RuleDetailItem>>
  }, [handleDeleteCustomizedRule])
  return <Modal>
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <Input
            value={searchedValue}
            onChange={(e) => {
              setSearchedValue(e.target.value)
            }}
            contentAfter={<SearchRegular/>}
            placeholder={t(TRANSLATION_KEY.SEARCH_RULE_TIP)}
            className={styles.input}
        />
        <div className={styles.actions}>
          {
            <Tooltip
                content={t(TRANSLATION_KEY.ADD_RULE)}
                relationship="description"
            >
              <Button
                  onClick={() => {
                  }}
                  className={styles.closeAll}
                  icon={<AddFilled/>}
              />
            </Tooltip>
          }

        </div>
      </div>
      <Table
          columns={columns}
          data={data}
          sortable
      />
    </div>
  </Modal>
}
