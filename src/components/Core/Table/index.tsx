import {
  type DataGridProps,
  type TableColumnDefinition,
  type TableColumnSizingOptions,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  useFluent,
  useScrollbarWidth,
} from "@fluentui/react-components";
import React, { type CSSProperties } from "react";

import {
  DataGrid as VirtualizedDataGrid,
  DataGridBody as VirtualizedDataGridBody,
  DataGridCell as VirtualizedDataGridCell,
  DataGridHeader as VirtualizedDataGridHeader,
  DataGridHeaderCell as VirtualizedDataGridHeaderCell,
  DataGridRow as VirtualizedDataGridRow,
} from "@fluentui-contrib/react-data-grid-react-window";

import styles from "./index.module.css";

interface TableProps<T> {
  columns: Array<TableColumnDefinition<T>>;
  data: T[];
  columnSizingOptions?: TableColumnSizingOptions;
  resizableColumns?: boolean;
  selectionMode?: DataGridProps["selectionMode"];
  selectedItems?: DataGridProps["selectedItems"];
  onSelectionChange?: DataGridProps["onSelectionChange"];
  getRowId?: DataGridProps["getRowId"];
  defaultSortState?: DataGridProps["defaultSortState"];
  sortable?: boolean;
  virtualized?: boolean;
  height?: number;
}

export function Table<T>(props: TableProps<T>) {
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
    sortable = false,
    virtualized = true,
    height = 480,
  } = props;

  const { targetDocument } = useFluent();
  const scrollbarWidth = useScrollbarWidth({ targetDocument });

  return virtualized ? (
    <VirtualizedDataGrid
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
      <VirtualizedDataGridHeader style={{ paddingRight: scrollbarWidth }}>
        <VirtualizedDataGridRow>
          {({ renderHeaderCell }) => (
            <VirtualizedDataGridHeaderCell>
              {renderHeaderCell()}
            </VirtualizedDataGridHeaderCell>
          )}
        </VirtualizedDataGridRow>
      </VirtualizedDataGridHeader>
      <VirtualizedDataGridBody<T> itemSize={50} height={height}>
        {({ item, rowId }, style) => (
          <VirtualizedDataGridRow<T> key={rowId} style={style}>
            {({ renderCell }) => (
              <VirtualizedDataGridCell>
                {renderCell(item)}
              </VirtualizedDataGridCell>
            )}
          </VirtualizedDataGridRow>
        )}
      </VirtualizedDataGridBody>
    </VirtualizedDataGrid>
  ) : (
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
      <DataGridBody<T>>
        {({ item, rowId }, style) => (
          <DataGridRow<T> key={rowId} style={style as CSSProperties}>
            {({ renderCell }) => (
              <DataGridCell>{renderCell(item)}</DataGridCell>
            )}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  );
}
