import React from "react";
import {
  DataGridProps,
  TableColumnSizingOptions,
  useFluent,
  useScrollbarWidth,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  TableColumnDefinition,
} from "@fluentui/react-components";

import styles from "./index.module.css";

type TableProps<T> = {
  columns: TableColumnDefinition<T>[];
  data: T[];
  columnSizingOptions?: TableColumnSizingOptions;
  resizableColumns?: boolean;
  selectionMode?: DataGridProps["selectionMode"];
  selectedItems?: DataGridProps["selectedItems"];
  onSelectionChange?: DataGridProps["onSelectionChange"];
  getRowId?: DataGridProps["getRowId"];
  defaultSortState?: DataGridProps["defaultSortState"];
  sortable?: boolean;
};

export function Table<T extends { id: string }>(props: TableProps<T>) {
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
  } = props;

  const { targetDocument } = useFluent();
  const scrollbarWidth = useScrollbarWidth({ targetDocument });

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
      <DataGridBody<T>>
        {({ item, rowId }, style) => (
          <DataGridRow<T> key={rowId} style={style as React.CSSProperties}>
            {({ renderCell }) => (
              <DataGridCell>{renderCell(item)}</DataGridCell>
            )}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  );
}
