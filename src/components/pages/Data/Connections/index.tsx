import React, { useEffect, useMemo, useState } from 'react'
import {
  closeAllConnections,
  type Conn,
  ConnNetworkMetaEnum,
  type ConnRuleEnum,
  subscribeConnections
} from 'lux-js-sdk'
import { useTranslation } from 'react-i18next'
import { type TableColumnDefinition } from '@fluentui/react-table'
import {
  Button,
  createTableColumn,
  type DataGridProps,
  Input,
  TableCellLayout,
  Tooltip
} from '@fluentui/react-components'
import { DeleteRegular, SearchRegular } from '@fluentui/react-icons'
import { TRANSLATION_KEY } from '@/i18n/locales/key'
import { convertByte } from '@/utils/traffic'
import { Table, Tag, TagTypeEnum } from '../../../Core'
import styles from './index.module.css'
import { useMedia } from '@/hooks'
import RuleCell from '@/components/pages/Data/Connections/RuleTag'

interface Connection {
  destination: string
  domain: string
  download: number
  upload: number
  network: ConnNetworkMetaEnum
  rule: ConnRuleEnum
  start: number
  id: string
}

function convertDuration (duration: number) {
  const secNum = duration / 1000 // don't forget the second param
  const hoursNum = Math.floor(secNum / 3600)
  const minutesNum = Math.floor((secNum - hoursNum * 3600) / 60)
  const secondsNum = Math.floor(secNum - hoursNum * 3600 - minutesNum * 60)

  let seconds = secondsNum.toString()
  let minutes = minutesNum.toString()
  let hours = hoursNum.toString()
  if (hoursNum < 10) {
    hours = `0${hoursNum}`
  }
  if (minutesNum < 10) {
    minutes = `0${minutesNum}`
  }
  if (secondsNum < 10) {
    seconds = `0${secondsNum}`
  }
  return `${hours}:${minutes}:${seconds}`
}

// TODO: move
function LoadTag (props: { value: number }): string {
  const { value } = props
  const { value: convertedValue, unit } = convertByte(value)
  return `${convertedValue} ${unit}`
}

function StartTag (props: { value: number }): React.ReactNode {
  const { value } = props
  const duration = new Date().getTime() - value
  return <>{convertDuration(duration)}</>
}

export default function Connections (): React.ReactNode {
  const { t } = useTranslation()
  const [conns, setConns] = useState<Conn[]>([])
  const [total, setTotal] = useState<{
    tcp: number
    udp: number
    history: number[]
  }>({ tcp: 0, udp: 0, history: [] })
  const [searchedValue, setSearchedValue] = useState('')

  const isWideScreen = useMedia('(min-width: 640px)')

  useEffect(() => {
    const subscriber = subscribeConnections({
      onMessage: (m) => {
        setConns(m)
        setTotal((prev) => {
          return {
            tcp: m.filter(
              (conn) => conn.metadata.network === ConnNetworkMetaEnum.Tcp
            ).length,
            udp: m.filter(
              (conn) => conn.metadata.network === ConnNetworkMetaEnum.Udp
            ).length,
            history: [...prev.history, m.length]
          }
        })
      }
    })
    return () => {
      subscriber.close()
    }
  }, [])
  const columns = useMemo<Array<TableColumnDefinition<Connection>>>(() => {
    return [
      isWideScreen
        ? createTableColumn<Connection>({
          columnId: 'destination',
          renderHeaderCell: () => {
            return t(TRANSLATION_KEY.DESTINATION)
          },
          renderCell: (item) => {
            return <TableCellLayout truncate>{item.destination}</TableCellLayout>
          }
        })
        : null,
      createTableColumn<Connection>({
        columnId: 'domain',
        renderHeaderCell: () => {
          return t(TRANSLATION_KEY.DOMAIN)
        },
        renderCell: (item) => {
          return <TableCellLayout truncate>{item.domain}</TableCellLayout>
        }
      }),
      createTableColumn<Connection>({
        columnId: 'rule',
        renderHeaderCell: () => {
          return t(TRANSLATION_KEY.RULE)
        },
        renderCell: (item) => {
          return <RuleCell value={item.rule} />
        }
      }),
      isWideScreen
        ? createTableColumn<Connection>({
          columnId: 'network',
          renderHeaderCell: () => {
            return t(TRANSLATION_KEY.NETWORK)
          },
          renderCell: (item) => {
            return <TableCellLayout>{item.network}</TableCellLayout>
          }
        })
        : null,

      isWideScreen
        ? createTableColumn<Connection>({
          columnId: 'start',
          compare: (a, b) => {
            return a.start - b.start
          },
          renderHeaderCell: () => {
            return t(TRANSLATION_KEY.TIME)
          },
          renderCell: (item) => {
            return (
            <TableCellLayout>
              <StartTag value={item.start} />
            </TableCellLayout>
            )
          }
        })
        : null,

      isWideScreen
        ? createTableColumn<Connection>({
          columnId: 'data',
          renderHeaderCell: () => {
            return t(TRANSLATION_KEY.DATA)
          },
          renderCell: (item) => {
            return (
            <TableCellLayout>
              <LoadTag value={item.download + item.upload} />
            </TableCellLayout>
            )
          }
        })
        : null
    ].filter(Boolean) as Array<TableColumnDefinition<Connection>>
  }, [t, isWideScreen])

  const data = useMemo(() => {
    return conns
      .map((conn) => ({
        destination: `${conn.metadata.destinationIP}:${conn.metadata.destinationPort}`,
        domain: conn.domain,
        download: conn.download,
        upload: conn.upload,
        network: conn.metadata.network,
        rule: conn.rule,
        start: conn.start,
        id: conn.id
      }))
      .filter((conn) => {
        if (searchedValue) {
          return [conn.domain, conn.destination].some((value) => {
            return value
              .toLocaleLowerCase()
              .includes(searchedValue.toLocaleLowerCase())
          })
        }
        return true
      })
  }, [conns, searchedValue])

  const defaultSortState = useMemo<DataGridProps['defaultSortState']>(
    () => ({ sortColumn: 'start', sortDirection: 'ascending' }),
    []
  )

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <Input
          value={searchedValue}
          onChange={(e) => {
            setSearchedValue(e.target.value)
          }}
          contentAfter={<SearchRegular />}
          placeholder={t(TRANSLATION_KEY.SEARCH_CONNECTION_TIP)}
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
        defaultSortState={defaultSortState}
        sortable
      />
      <div className={styles.footer}>
        <div>{`TCP:  ${total.tcp}`}</div>
        <div>{`UDP:  ${total.udp}`}</div>
      </div>
    </div>
  )
}
