import React from "react";
import classNames from "classnames";
import {
  Button,
  makeStyles,
  mergeClasses,
  Text,
} from "@fluentui/react-components";
import {
  CheckRegular,
  ErrorCircleRegular,
  InfoRegular,
  WarningRegular,
} from "@fluentui/react-icons";
import { tokens } from "@fluentui/react-theme";
import { Icon, IconNameEnum } from "../Icon";
import styles from "./index.module.css";

const useStyles = makeStyles({
  root: { backgroundColor: tokens.colorNeutralBackground1 },
});

export enum MessageTypeEnum {
  Error = "error",
  Success = "success",
  Warning = "warning",
  Info = "info",
}

export type MessageType = MessageTypeEnum;

type MessageProps = {
  title: string;
  className?: string;
  type?: MessageTypeEnum;
  close: () => void;
} & React.HTMLAttributes<HTMLDivElement>;

const ICON_MAP = {
  [MessageTypeEnum.Info]: <InfoRegular />,
  [MessageTypeEnum.Error]: <ErrorCircleRegular />,
  [MessageTypeEnum.Success]: <CheckRegular />,
  [MessageTypeEnum.Warning]: <WarningRegular />,
};

export const Message = React.memo((props: MessageProps) => {
  const {
    title,
    type = MessageTypeEnum.Info,
    close,
    className,
    ...restProps
  } = props;

  const iconCls = classNames(styles.iconContainer, styles[type]);
  const icon = ICON_MAP[type];

  const inStyles = useStyles();

  const cls = mergeClasses(styles.message, className, inStyles.root);

  return (
    <div className={cls} {...restProps}>
      {icon && <div className={iconCls}>{icon}</div>}
      <div className={styles.popup}>
        <Text>{title}</Text>
      </div>
      <Button
        className={styles.close}
        onClick={close}
        appearance="transparent"
        icon={<Icon name={IconNameEnum.Close} />}
        as="a"
      />
    </div>
  );
});
