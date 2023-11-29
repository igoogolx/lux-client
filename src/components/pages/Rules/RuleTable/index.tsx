import React, { useEffect, useMemo, useState } from 'react'
import { type TableColumnDefinition } from '@fluentui/react-table'
import { Button, createTableColumn, Input, TableCellLayout, Tooltip } from '@fluentui/react-components'
import { TRANSLATION_KEY } from '@/i18n/locales/key'
import { closeAllConnections, getRuleDetail, type RuleDetailItem } from 'lux-js-sdk'
import { t } from 'i18next'
import { Table } from '@/components/Core'
import RuleCell from '@/components/pages/Data/Connections/RuleTag'
import styles from './index.module.css'
import { DeleteRegular, SearchRegular } from '@fluentui/react-icons'

interface RuleTableProps {
  id: string
}

export default function RuleTable (props: RuleTableProps) {
  const { id } = props

  const [rules, setRules] = useState<RuleDetailItem[]>([])

  const [searchedValue, setSearchedValue] = useState('')

  useEffect(() => {
    if (id) {
      getRuleDetail(id).then(res => {
        setRules(res.items)
      })
    }
  }, [id])

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
        columnId: 'policy',
        renderHeaderCell: () => {
          return t(TRANSLATION_KEY.POLICY)
        },
        renderCell: (item) => {
          return <RuleCell value={item.policy} />
        }
      })
    ].filter(Boolean) as Array<TableColumnDefinition<RuleDetailItem>>
  }, [])
  return <div className={styles.wrapper}>
    <div className={styles.toolbar}>
      <Input
        value={searchedValue}
        onChange={(e) => {
          setSearchedValue(e.target.value)
        }}
        contentAfter={<SearchRegular />}
        placeholder={t(TRANSLATION_KEY.SEARCH_RULE_TIP)}
        className={styles.input}
      />
      <div className={styles.actions}>
        <Tooltip
          content={t(TRANSLATION_KEY.CLOSE_ALL)}
          relationship="description"
        >
          <Button
            onClick={closeAllConnections}
            className={styles.closeAll}
            icon={<DeleteRegular />}
          />
        </Tooltip>
      </div>
    </div>
    <Table
      columns={columns}
      data={data}
      sortable
    />
  </div>
}
