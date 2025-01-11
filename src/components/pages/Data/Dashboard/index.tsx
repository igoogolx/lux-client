import { subscribeTraffic, Traffic } from "lux-js-sdk";
import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { TrafficCard } from "./TrafficCard";
import styles from "./index.module.css";

interface DashboardProps {
  connectionsAmount: {
    tcp: number;
    udp: number;
  };
}

const INIT_TRAFFIC_ITEM = {
  proxy: { upload: 0, download: 0 },
  direct: { upload: 0, download: 0 },
};

export default function Dashboard(
  props: Readonly<DashboardProps>,
): React.ReactNode {
  const { connectionsAmount } = props;
  const [traffic, setTraffic] = useState<Traffic>({
    speed: INIT_TRAFFIC_ITEM,
    total: INIT_TRAFFIC_ITEM,
  });

  const dispatch = useDispatch();
  useEffect(() => {
    const speedClient = subscribeTraffic({
      onMessage: (item) => {
        setTraffic(item);
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
        speed={traffic.speed}
        total={traffic.total}
        connectionsAmount={connectionsAmount}
      />
    </div>
  );
}
