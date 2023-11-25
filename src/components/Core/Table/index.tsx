import React from 'react'
import {
  type DataGridProps,
  type TableColumnSizingOptions,
  useFluent,
  useScrollbarWidth,
  type TableColumnDefinition
} from '@fluentui/react-components'

import {
  DataGridBody,
  DataGrid,
  DataGridRow,
  DataGridHeader,
  DataGridCell,
  DataGridHeaderCell,
  RowRenderer
} from '@fluentui-contrib/react-data-grid-react-window'

import styles from './index.module.css'

interface TableProps<T> {
  columns: Array<TableColumnDefinition<T>>
  data: T[]
  columnSizingOptions?: TableColumnSizingOptions
  resizableColumns?: boolean
  selectionMode?: DataGridProps['selectionMode']
  selectedItems?: DataGridProps['selectedItems']
  onSelectionChange?: DataGridProps['onSelectionChange']
  getRowId?: DataGridProps['getRowId']
  defaultSortState?: DataGridProps['defaultSortState']
  sortable?: boolean
}

export function Table<T extends { id: string }> (props: TableProps<T>) {
  const {
    columns,
    data,
    columnSizingOptions,
    resizableColumns,
    selectionMode,
    selectedItems,
    onSelectionChange,
    getRowId,
    defaultSortState,
    sortable = false
  } = props

  const { targetDocument } = useFluent()
  const scrollbarWidth = useScrollbarWidth({ targetDocument })

  return (
    <DataGrid
      items={data}
      columns={columns}
      className={styles.container}
      columnSizingOptions={columnSizingOptions}
      resizableColumns={resizableColumns}
      selectedItems={selectedItems}
      selectionMode={selectionMode}
      onSelectionChange={onSelectionChange}
      getRowId={getRowId}
      defaultSortState={defaultSortState}
      sortable={sortable}
    >
      <DataGridHeader style={{ paddingRight: scrollbarWidth }}>
        <DataGridRow>
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<T> itemSize={50} height={480}>
        {({ item, rowId }, style) => (
          <DataGridRow<T> key={rowId} style={style as React.CSSProperties}>
            {({ renderCell }) => (
              <DataGridCell>{renderCell(item)}</DataGridCell>
            )}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  )
}
