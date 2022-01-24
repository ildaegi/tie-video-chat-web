import { useEffect } from "react";
import Socket from "../utils/socket";

export default function useSocket() {
  useEffect(() => {
    Socket.init();

    Socket.instance?.on("connect_error", (err) => {
      console.log("connect_error!!", err.name, err.message);
    });

    return () => {
      Socket.disconnect();
    };
  }, []);
}
