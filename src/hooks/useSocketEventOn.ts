import { useEffect } from "react";

import Socket from "../utils/socket";

type SocketEvent = {
  test: { data: string };
  // iceCandidate: { data: RTCIceCandidateType };
  // iceCandidateEnd: null;
  // answer: { data: RTCSessionDescription };
  // offer: { data: RTCSessionDescription };
  // leave: null;
  user_exit: { id: string };
  getCandidate: {
    candidate: RTCIceCandidateInit;
    candidateSendID: string;
  };
  getAnswer: { sdp: RTCSessionDescription; answerSendID: string };
  getOffer: {
    sdp: RTCSessionDescription;
    offerSendID: string;
    offerSendEmail: string;
  };
  all_users: Array<{ id: string; email: string }>;
};

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
  }, []);
}
