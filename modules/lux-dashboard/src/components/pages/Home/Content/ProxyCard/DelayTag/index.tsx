import * as React from "react";
import { useMemo } from "react";
import classNames from "classnames";
import { useTestDelay } from "@/hooks";
import { useSelector } from "react-redux";
import { DelayInfo, delaysSelectors, RootState } from "@/reducers";
import styles from "./index.module.css";

type DelayTagProps = {
  id: string;
  value?: number;
  className?: string;
};

enum TypeEnum {
  Success = "success",
  Warn = "warn",
  Error = "error",
}

export function DelayTag(props: DelayTagProps): JSX.Element {
  const { value, className, id } = props;
  const type = useMemo(() => {
    if (value === undefined) return TypeEnum.Error;
    if (value > 0 && value <= 1000) return TypeEnum.Success;
    if (value > 1000) return TypeEnum.Warn;
    return TypeEnum.Error;
  }, [value]);
  const testDelay = useTestDelay();

  const { loading } = useSelector<RootState, DelayInfo>(
    (state) => delaysSelectors.selectById(state, id) || { id, loading: false }
  );

  if (value === undefined && !loading) {
    return <></>;
  }

  return loading ? (
    <></>
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
