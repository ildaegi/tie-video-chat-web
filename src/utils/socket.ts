import io, { Socket as SocketType } from "socket.io-client";

const url = "http://192.168.0.25:5555";

export default class Socket {
  static instance: null | SocketType = null;

  static init = () => {
    Socket.instance = io(url, {
      forceNew: true,
      timeout: 5000,
      transports: ["websocket"],
    });
  };

  static disconnect = () => Socket.instance?.close();
}
