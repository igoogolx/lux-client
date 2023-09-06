import * as React from "react";
import { MenuItemSlots } from "@fluentui/react-components";
import { IconProps } from "../Icon";

export type MenuItemProps = {
  id: string | number;
  // TODO: remove
  // eslint-disable-next-line react/no-unused-prop-types
  icon?: MenuItemSlots["icon"];
  content?: React.ReactNode;
  iconName?: IconProps["name"];
  isDivider?: boolean;
  isDanger?: boolean;
  style?: React.CSSProperties;
  disabled?: boolean;
};
