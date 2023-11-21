import React, { useMemo, useState } from 'react'
import { type Log } from 'lux-js-sdk'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { type TableColumnDefinition } from '@fluentui/react-table'
import {
  createTableColumn,
  Input,
  TableCellLayout,
  type TableColumnSizingOptions, Tooltip
} from '@fluentui/react-components'
import { SearchRegular } from '@fluentui/react-icons'
import dayjs from 'dayjs'
import Highlighter from 'react-highlight-words'
import { TRANSLATION_KEY } from '@/i18n/locales/key'
import { type RootState } from '@/reducers'
import { Table, Tag, type TagTypeEnum } from '../../Core'
import styles from './index.module.css'
import { useMedia } from '@/hooks'

function TimeCell (props: { value: number }) {
  const { value } = props
  const date = new Date(value)
  return <div>{dayjs(date).format('HH:mm:ss')}</div>
}

function TypeCell (props: { value: string }) {
  const { value } = props
  return <Tag type={value as TagTypeEnum} value={value} />
}

function PayloadCell (props: { value: string, searchedWords: string[] }) {
  const { value, searchedWords } = props
  return (
    <Tooltip content={value} relationship={'description'}>
      <div className={styles.payload}>
        <Highlighter
          searchWords={searchedWords}
          autoEscape
          textToHighlight={value}
        />
      </div>
    </Tooltip>
  )
}

export default function Logger (): React.ReactNode {
  const { t } = useTranslation()
  const logs = useSelector<RootState, Log[]>((state) => state.logger.logs)
  const [searchedValue, setSearchedValue] = useState('')

  const isWideScreen = useMedia('(min-width: 640px)')

  const columns = useMemo<Array<TableColumnDefinition<Log>>>(() => {
    return [
      createTableColumn<Log>({
        columnId: 'type',
        renderHeaderCell: () => {
          return t(TRANSLATION_KEY.TYPE)
        },
        renderCell: (item) => {
          return (
            <TableCellLayout>
              <TypeCell value={item.type} />
            </TableCellLayout>
          )
        }
      }),
      isWideScreen
        ? createTableColumn<Log>({
          columnId: 'time',
          renderHeaderCell: () => {
            return t(TRANSLATION_KEY.TIME)
          },
          renderCell: (item) => {
            return (
            <TableCellLayout>
              <TimeCell value={item.time} />
            </TableCellLayout>
            )
          }
        })
        : null,
      createTableColumn<Log>({
        columnId: 'content',
        renderHeaderCell: () => {
          return t(TRANSLATION_KEY.CONTENT)
        },
        renderCell: (item) => {
          return (
            <TableCellLayout>
              <PayloadCell
                value={item.payload}
                searchedWords={[searchedValue]}
              />
            </TableCellLayout>
          )
        }
      })
    ].filter(Boolean) as Array<TableColumnDefinition<Log>>
  }, [searchedValue, t, isWideScreen])

  const data = useMemo(() => {
    return logs.filter((log) => {
      return log.payload
        .toLocaleLowerCase()
        .includes(searchedValue.toLocaleLowerCase())
    })
  }, [logs, searchedValue])

  const columnSizingOptions: TableColumnSizingOptions = useMemo(() => {
    return {
      time: {
        defaultWidth: 80
      },
      type: {
        defaultWidth: 80
      },
      content: {
        defaultWidth: 720
      }
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <Input
          onChange={(e) => {
            setSearchedValue(e.target.value)
          }}
          contentAfter={<SearchRegular />}
          placeholder={t(TRANSLATION_KEY.SEARCH_LOG_TIP)}
          className={styles.input}
        />
      </div>
      <Table
        columns={columns}
        data={data}
        columnSizingOptions={columnSizingOptions}
        resizableColumns
      />
    </div>
  )
}
