import type * as React from "react";
import { type MenuItemSlots } from "@fluentui/react-components";
import { type IconProps } from "../Icon";

export interface MenuItemProps {
  id: string | number;
  icon?: MenuItemSlots["icon"];
  content?: React.ReactNode;
  iconName?: IconProps["name"];
  isDivider?: boolean;
  isDanger?: boolean;
  style?: React.CSSProperties;
  disabled?: boolean;
}
