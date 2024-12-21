import { useTestDelay } from "@/hooks";
import { type DelayInfo, delaysSelectors, type RootState } from "@/reducers";
import classNames from "classnames";
import * as React from "react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import styles from "./index.module.css";

interface DelayTagProps {
  id: string;
  value?: number;
  className?: string;
}

enum TypeEnum {
  Success = "success",
  Warn = "warn",
  Error = "error",
}

export function DelayTag(props: DelayTagProps): React.ReactNode {
  const { value, className, id } = props;
  const type = useMemo(() => {
    if (value === undefined) return TypeEnum.Error;
    if (value > 0 && value <= 1000) return TypeEnum.Success;
    if (value > 1000) return TypeEnum.Warn;
    return TypeEnum.Error;
  }, [value]);
  const testDelay = useTestDelay();

  const { loading } = useSelector<RootState, DelayInfo | undefined>((state) =>
    delaysSelectors.selectById(state, id),
  ) ?? { loading: true };

  if (value === undefined && !loading) {
    return "";
  }

  return loading ? (
    ""
  ) : (
    <span
      className={classNames(className, styles[type])}
      onClick={() => {
        testDelay(id);
      }}
    >
      {type === TypeEnum.Error ? "timeout" : `${value}ms`}
    </span>
  );
}
