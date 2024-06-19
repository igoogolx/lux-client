import { TableCellLayout, Tooltip } from '@fluentui/react-components'
import { ClickToCopy } from '@/components/Core'
import React from 'react'

interface ProcessCellProps {
  process: string
  os: string
}
export function ProcessCell (props: ProcessCellProps) {
  const { process, os } = props
  const separator = os === 'darwin' ? '/' : '\\'
  const chunks = process.split(separator)
  const value = chunks.pop() ?? ''
  return <TableCellLayout truncate>
      <ClickToCopy value={value}>
        <Tooltip content={process} relationship={'description'}>
                <span>
                    {value}
                </span>
        </Tooltip>
      </ClickToCopy>
    </TableCellLayout>
}
