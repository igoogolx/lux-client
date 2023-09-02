import classNames from "classnames";
import { RefObject, useCallback, useMemo } from "react";
import { FixedSizeList as List } from "react-window";
import * as React from "react";
import { MenuItemSlots } from "@fluentui/react-components";
import styles from "./index.module.css";
import { Icon, IconProps } from "../Icon";

const VIRTUALIZED_ITEM_SIZE = 40;
const VIRTUALIZED_ITEM_WIDTH = 188;
const VIRTUALIZED_ITEM_HEIGHT = 170;

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

export type MenuProps = {
  items: MenuItemProps[];
  className?: string;
  isVirtualized?: boolean;
  menuRef?: RefObject<HTMLDivElement>;
  onClick: (key: string | number) => void;
};

const Item = React.memo(
  (props: MenuItemProps & { onClick: (id: string | number) => void }) => {
    const {
      id,
      onClick,
      iconName,
      isDivider = false,
      content,
      isDanger,
      style,
      disabled,
    } = props;

    const handleOnClick = useCallback(() => {
      onClick(id);
    }, [id, onClick]);

    return (
      <div
        style={style}
        className={classNames(styles.item, {
          [styles.danger]: isDanger,
          [styles.disabled]: disabled,
        })}
        onClick={handleOnClick}
      >
        {/* TODO: fix styles of divider */}
        {isDivider && <div className={styles.divider} />}
        <div className={styles.content}>
          {iconName && <Icon name={iconName} />}
          <div className={styles.text}>{content}</div>
        </div>
      </div>
    );
  }
);

const VirtualizedItem = React.memo(
  (props: {
    data: (MenuItemProps & { onClick: (id: string | number) => void })[];
    index: number;
    style: React.CSSProperties;
  }) => <Item {...props.data[props.index]} style={props.style} />
);

export const Menu = React.memo((props: MenuProps) => {
  const { items, className, isVirtualized, menuRef, onClick } = props;
  const memoItems = useMemo(() => {
    return items.map((item) => ({ ...item, onClick }));
  }, [items, onClick]);
  return (
    <div className={classNames(styles.container, className)} ref={menuRef}>
      {isVirtualized ? (
        <List
          itemCount={memoItems.length}
          itemSize={VIRTUALIZED_ITEM_SIZE}
          width={VIRTUALIZED_ITEM_WIDTH}
          height={VIRTUALIZED_ITEM_HEIGHT}
          className={styles.list}
          itemData={memoItems}
        >
          {VirtualizedItem}
        </List>
      ) : (
        <div className={styles.list}>
          {memoItems.map((itemProps) => (
            <Item {...itemProps} key={itemProps.id} />
          ))}
        </div>
      )}
    </div>
  );
});
