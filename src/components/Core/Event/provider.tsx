import WsClient from "isomorphic-ws";
import { subscribeEvent } from "lux-js-sdk";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import EventContext, { EventHub } from "./context";

export default function EventProvider(props: Readonly<PropsWithChildren>) {
  const { children } = props;

  const eventClient = useRef<WsClient | null>(null);

  const [contextValue, setContextValue] = useState<EventHub | null>(null);

  useEffect(() => {
    eventClient.current = subscribeEvent({
      onMessage: (item) => {
        console.log(item);
      },
      onError: () => {
        eventClient.current?.close();
      },
    });
    eventClient.current.addEventListener("open", () => {
      setContextValue(new EventHub(eventClient.current as WsClient));
    });
  }, []);

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
}
