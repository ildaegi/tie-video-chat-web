import io, { Socket as SocketType } from "socket.io-client";

// https://tie-video-chat-app.herokuapp.com
const url = "https://tie-video-chat-app.herokuapp.com";
// const url = "http://localhost:5556";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imluc3VuZzk1NDZAZ21haWwuY29tIiwiaWF0IjoxNjQzNTE0MDM0LCJleHAiOjMzMjAxMTE0MDM0fQ.o_E2n67N7csOeKrjB-PLIAowZXOwfJ4Sk1zrGKs0DJU";
export default class Socket {
  static instance: null | SocketType = null;

  static init = () => {
    this.instance = io(url, {
      forceNew: true,
      timeout: 5000,
      transports: ["websocket"],
      path: "/chat",
    });
  };

  static emit = (event: string, data: any) =>
    this.instance?.emit(event, { ...data, token });

  static disconnect = () => Socket.instance?.close();
}
