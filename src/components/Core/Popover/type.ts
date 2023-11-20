import type * as React from 'react'
import { type ReactNode } from 'react'

export enum PlacementEnum {
  TopStart = 'top-start',
  Top = 'top',
  TopEnd = 'top-end',
  BottomStart = 'bottom-start',
  Bottom = 'bottom',
  BottomEnd = 'bottom-end',
  LeftStart = 'left-start',
  Left = 'left',
  LeftEnd = 'left-end',
  RightStart = 'right-start',
  Right = 'right',
  RightEnd = 'right-end',
}

export enum TriggerEnum {
  Click = 'click',
  Hover = 'hover',
}

export interface PopoverProps {
  placement?: PlacementEnum
  children:
  | React.ReactNode
  | ((data: {
    open: () => void
    close: () => void
    isOpen: boolean
  }) => ReactNode)
  content:
  | React.ReactNode
  | ((data: {
    open: () => void
    close: () => void
    isOpen: boolean
  }) => void)
  withArrow?: boolean
  distance?: number
  popoverStyle?: React.CSSProperties
  popoverClassName?: string
  className?: string
  arrowClassName?: string
  trigger?: TriggerEnum
  arrowStyle?: React.CSSProperties
  defaultOpen?: boolean
  skidding?: number
  skiddingOption?: Record<string, number>
  distanceOption?: Record<string, number>
  withState?: boolean
  setIsOpen?: (isOpen: boolean) => void
  isOpen?: boolean
  timeout?: number
  disabled?: boolean
  getContainerElement?: () => HTMLElement
}
