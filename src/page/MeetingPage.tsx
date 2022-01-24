import React, { useState, useRef, useEffect, useCallback } from "react";
import useSocket from "../hooks/useSocket";
import useSocketEventOn from "../hooks/useSocketEventOn";
import Socket from "../utils/socket";

export type WebRTCUser = {
  id: string;
  email: string;
  stream: MediaStream;
};

const pc_config = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const App = () => {
  const pcsRef = useRef<{ [socketId: string]: RTCPeerConnection }>({});
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream>();
  const [users, setUsers] = useState<WebRTCUser[]>([]);

  useSocket();

  const getLocalStream = useCallback(async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 240,
          height: 240,
        },
      });
      localStreamRef.current = localStream;
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

      Socket.instance?.emit("join_room", {
        room: "1234",
        email: "sample@naver.com",
      });
    } catch (e) {
      console.log(`getUserMedia error: ${e}`);
    }
  }, []);

  const createPeerConnection = useCallback(
    (socketID: string, email: string) => {
      console.log("createPeerConnection", {
        socketID,
        email,
      });
      try {
        const pc = new RTCPeerConnection(pc_config);

        pc.onicecandidate = (e) => {
          if (!e.candidate) return;
          console.log("onicecandidate");
          Socket.instance?.emit("candidate", {
            candidate: e.candidate,
            candidateSendID: Socket.instance.id,
            candidateReceiveID: socketID,
          });
        };

        pc.oniceconnectionstatechange = (e) => {
          console.log(e);
        };

        pc.ontrack = (e) => {
          console.log("ontrack success");
          setUsers((oldUsers) =>
            oldUsers
              .filter((user) => user.id !== socketID)
              .concat({
                id: socketID,
                email,
                stream: e.streams[0],
              })
          );
        };

        if (localStreamRef.current) {
          console.log("localstream add");
          localStreamRef.current.getTracks().forEach((track) => {
            if (!localStreamRef.current) return;
            pc.addTrack(track, localStreamRef.current);
          });
        } else {
          console.log("no local stream");
        }

        return pc;
      } catch (e) {
        console.error(e);
        return undefined;
      }
    },
    []
  );

  useEffect(() => {
    getLocalStream();

    return () => {
      Socket.instance?.disconnect();

      users.forEach((user) => {
        if (!pcsRef.current[user.id]) return;
        pcsRef.current[user.id].close();
        delete pcsRef.current[user.id];
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createPeerConnection, getLocalStream]);

  useSocketEventOn(
    "all_users",
    (allUsers: Array<{ id: string; email: string }>) => {
      allUsers.forEach(async (user) => {
        if (!localStreamRef.current) return;
        const pc = createPeerConnection(user.id, user.email);
        if (!pc) return;

        pcsRef.current = { ...pcsRef.current, [user.id]: pc };

        try {
          const localSdp = await pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          });
          console.log("create offer success");
          await pc.setLocalDescription(new RTCSessionDescription(localSdp));
          Socket.instance?.emit("offer", {
            sdp: localSdp,
            offerSendID: Socket.instance.id,
            offerSendEmail: "offerSendSample@sample.com",
            offerReceiveID: user.id,
          });
        } catch (e) {
          console.error(e);
        }
      });
    }
  );

  useSocketEventOn(
    "getOffer",
    async (data: {
      sdp: RTCSessionDescription;
      offerSendID: string;
      offerSendEmail: string;
    }) => {
      const { sdp, offerSendID, offerSendEmail } = data;
      console.log("get offer");
      if (!localStreamRef.current) return;
      const pc = createPeerConnection(offerSendID, offerSendEmail);
      if (!pc) return;
      pcsRef.current = { ...pcsRef.current, [offerSendID]: pc };
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        console.log("answer set remote description success");
        const localSdp = await pc.createAnswer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true,
        });
        await pc.setLocalDescription(new RTCSessionDescription(localSdp));
        Socket.instance?.emit("answer", {
          sdp: localSdp,
          answerSendID: Socket.instance.id,
          answerReceiveID: offerSendID,
        });
      } catch (e) {
        console.error(e);
      }
    }
  );

  useSocketEventOn(
    "getAnswer",
    (data: { sdp: RTCSessionDescription; answerSendID: string }) => {
      const { sdp, answerSendID } = data;
      console.log("get answer");
      const pc: RTCPeerConnection = pcsRef.current[answerSendID];
      if (!pc) return;
      pc.setRemoteDescription(new RTCSessionDescription(sdp));
    }
  );

  useSocketEventOn(
    "getCandidate",
    async (data: {
      candidate: RTCIceCandidateInit;
      candidateSendID: string;
    }) => {
      console.log("get candidate");
      const pc: RTCPeerConnection = pcsRef.current[data.candidateSendID];
      if (!pc) return;
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      console.log("candidate add success");
    }
  );

  useSocketEventOn("user_exit", (data: { id: string }) => {
    if (!pcsRef.current[data.id]) return;
    pcsRef.current[data.id].close();
    delete pcsRef.current[data.id];
    setUsers((oldUsers) => oldUsers.filter((user) => user.id !== data.id));
  });

  return (
    <div>
      <video
        style={{
          width: 240,
          height: 240,
          margin: 5,
          backgroundColor: "black",
        }}
        muted
        ref={localVideoRef}
        autoPlay
      />
      {users.map((user, index) => (
        <Video key={index} email={user.email} stream={user.stream} />
      ))}
    </div>
  );
};

export default App;

const Video = ({
  email,
  stream,
  muted,
}: {
  email: string;
  stream: MediaStream;
  muted?: boolean;
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
    if (muted) setIsMuted(muted);
  }, [stream, muted]);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        width: "240px",
        height: "270px",
        margin: "5px",
      }}
    >
      <video
        style={{ width: "240px", height: "240px", backgroundColor: "black" }}
        ref={ref}
        muted={isMuted}
        autoPlay
      />
      <p
        style={{
          display: "inline-block",
          position: "absolute",
          top: "230px",
          left: "0px",
        }}
      >
        {email}
      </p>
    </div>
  );
};
