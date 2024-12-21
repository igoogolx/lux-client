import * as React from "react";
import { useEffect, useMemo } from "react";
import {
  subscribeNowTraffic,
  subscribeTotalTraffic,
  type Traffic,
  type TrafficItem,
} from "lux-js-sdk";
import { useDispatch, useSelector } from "react-redux";
import {
  CategoryScale,
  Chart,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
} from "chart.js";
import { type RootState, trafficsSlice } from "@/reducers";
import { TrafficCard } from "./TrafficCard";
import styles from "./index.module.css";

interface Speed {
  proxy: TrafficItem[];
  direct: TrafficItem[];
}

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
);

export default function Dashboard(): React.ReactNode {
  const traffics = useSelector<RootState, Traffic[]>((state) => {
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
  const total = useSelector<RootState, Traffic | null>(
    (state) => state.traffics.total,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const speedClient = subscribeNowTraffic({
      onMessage: (item) => {
        dispatch(trafficsSlice.actions.addNow({ traffic: item }));
      },
      onError: () => {
        speedClient.close();
      },
    });
    const totalClient = subscribeTotalTraffic({
      onMessage: (item) => {
        dispatch(trafficsSlice.actions.setTotal({ traffic: item }));
      },
      onError: () => {
        totalClient.close();
      },
    });
    return () => {
      speedClient.close();
      totalClient.close();
    };
  }, [dispatch]);

  return speed && total ? (
    <div className={styles.wrapper}>
      <TrafficCard speed={speed} total={total} />
    </div>
  ) : (
    ""
  );
}
