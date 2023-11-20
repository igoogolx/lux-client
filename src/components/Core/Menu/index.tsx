import type * as React from 'react'
import { type MenuItemSlots } from '@fluentui/react-components'
import { type IconProps } from '../Icon'

export interface MenuItemProps {
  id: string | number
  // TODO: remove
  // eslint-disable-next-line react/no-unused-prop-types
  icon?: MenuItemSlots['icon']
  content?: React.ReactNode
  iconName?: IconProps['name']
  isDivider?: boolean
  isDanger?: boolean
  style?: React.CSSProperties
  disabled?: boolean
}
