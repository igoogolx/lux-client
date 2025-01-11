import { type RootState, trafficsSlice } from "@/reducers";
import { subscribeTraffic, type Traffic, type TrafficItem } from "lux-js-sdk";
import * as React from "react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TrafficCard } from "./TrafficCard";
import styles from "./index.module.css";

interface Speed {
  proxy: TrafficItem[];
  direct: TrafficItem[];
}

interface DashboardProps {
  connectionsAmount: {
    tcp: number;
    udp: number;
  };
}

export default function Dashboard(
  props: Readonly<DashboardProps>,
): React.ReactNode {
  const { connectionsAmount } = props;
  const traffics = useSelector<RootState, Traffic["speed"][]>((state) => {
    return state.traffics.now;
  });

  const speed = useMemo<Speed>(() => {
    const result: Speed = {
      proxy: [],
      direct: [],
    };
    traffics.forEach((traffic) => {
      result.proxy.push(traffic.proxy);
      result.direct.push(traffic.direct);
    });
    return result;
  }, [traffics]);

  const total = useSelector<RootState, Traffic["total"]>(
    (state) =>
      state.traffics.total || {
        proxy: { upload: 0, download: 0 },
        direct: { upload: 0, download: 0 },
      },
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const speedClient = subscribeTraffic({
      onMessage: (item) => {
        dispatch(trafficsSlice.actions.addNow({ traffic: item.speed }));
        dispatch(trafficsSlice.actions.setTotal({ traffic: item.total }));
      },
      onError: () => {
        speedClient.close();
      },
    });
    return () => {
      speedClient.close();
    };
  }, [dispatch]);

  return (
    <div className={styles.wrapper}>
      <TrafficCard
        speed={speed}
        total={total}
        connectionsAmount={connectionsAmount}
      />
    </div>
  );
}
