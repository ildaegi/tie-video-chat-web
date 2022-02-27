import { useEffect } from "react";
import { SocketEvent } from "../types/socket/event.socket";

import Socket from "../utils/socket";

export default function useSocketEventOn<E extends keyof SocketEvent>(
  event: E,
  cb: (d: SocketEvent[E]) => void
) {
  useEffect(() => {
    console.log("useSocketEventOn", event, !!Socket.instance);
    Socket.instance?.on<keyof SocketEvent>(event, cb);

    return () => {
      Socket.instance?.off<keyof SocketEvent>(event, cb);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
