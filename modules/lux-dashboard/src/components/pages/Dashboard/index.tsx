import * as React from "react";
import { useEffect } from "react";
import {
  subscribeNowTraffic,
  subscribeTotalTraffic,
  Traffic,
  TrafficItem,
} from "lux-js-sdk";
import { useDispatch, useSelector } from "react-redux";
import { trafficsSlice, RootState } from "@/reducers";
import { TrafficCard } from "@/components/pages/Dashboard/TrafficCard";
import {
  CategoryScale,
  Chart,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
} from "chart.js";
import styles from "./index.module.css";

type Speed = { proxy: TrafficItem[]; direct: TrafficItem[] };

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale
);

export default function Dashboard(): JSX.Element {
  const speed = useSelector<RootState, Speed>((state) => {
    const result: Speed = {
      proxy: [],
      direct: [],
    };
    state.traffics.now.forEach((traffic) => {
      result.proxy.push(traffic.proxy);
      result.direct.push(traffic.direct);
    });
    return result;
  });
  const total = useSelector<RootState, Traffic | null>(
    (state) => state.traffics.total
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
    };
  }, [dispatch]);

  return speed && total ? (
    <div className={styles.wrapper}>
      <TrafficCard speed={speed} total={total} />
    </div>
  ) : (
    <></>
  );
}
