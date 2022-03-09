import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useParams } from "react-router-dom";
import Video from "../../components/common/Video";
import { RTC_PEER_CONNECTION_CONFIG } from "../../constants/webRTC";
import useSocket from "../../hooks/useSocket";
import useSocketEventOn from "../../hooks/useSocketEventOn";

import { MeetingUser } from "../../types/domain/user";

import Socket from "../../utils/socket";

export default function MeetingPage() {
  const params = useParams();
  const roomId = useMemo(() => params.id, [params]);
  const email = useMemo(() => params.email, [params]);

  const pcsRef = useRef<{ [socketId: string]: RTCPeerConnection }>({});
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream>();
  const [users, setUsers] = useState<MeetingUser[]>([]);

  useSocket();

  const getLocalStream = useCallback(async () => {
    try {
      const localStream =
        email !== "ghost-for-recode"
          ? await navigator.mediaDevices.getUserMedia({
              audio: { suppressLocalAudioPlayback: true },
              video: {
                width: 240,
                height: 240,
              },
            })
          : new MediaStream();
      localStreamRef.current = localStream;
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
      Socket.emit("joinRoom", { room: roomId, email: email });
    } catch (e) {
      console.log(`getUserMedia error: ${e}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createPeerConnection = useCallback(
    (socketID: string, email: string) => {
      console.log("createPeerConnection", {
        socketID,
        email,
      });
      try {
        const pc = new RTCPeerConnection(RTC_PEER_CONNECTION_CONFIG);

        pc.onicecandidate = (e) => {
          if (!e.candidate) return;
          console.log("onicecandidate");
          Socket.emit("candidate", {
            candidate: e.candidate,
            candidateSendID: Socket.instance?.id,
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

  // all_users
  useSocketEventOn(
    "allUsers",
    (allUsers: Array<{ id: string; email: string }>) => {
      console.log("allUsers get !");
      allUsers.forEach(async (user) => {
        // if (!localStreamRef.current) return;
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

          Socket.emit("offer", {
            sdp: localSdp,
            offerSendID: Socket.instance?.id,
            offerSendEmail: email,
            offerReceiveID: user.id,
          });
        } catch (e) {
          console.error(e);
        }
      });
    }
  );

  // getOffer
  useSocketEventOn(
    "getOffer",
    async (data: {
      sdp: RTCSessionDescription;
      offerSendID: string;
      offerSendEmail: string;
    }) => {
      const { sdp, offerSendID, offerSendEmail } = data;
      console.log("get offer");
      // if (!localStreamRef.current) return;
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
        Socket.emit("answer", {
          sdp: localSdp,
          answerSendID: Socket.instance?.id,
          answerReceiveID: offerSendID,
        });
      } catch (e) {
        console.error(e);
      }
    }
  );

  // getAnswer
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

  // getCandidate
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

  // user_exit
  useSocketEventOn("userExit", (data: { id: string }) => {
    if (!pcsRef.current[data.id]) return;
    pcsRef.current[data.id].close();
    delete pcsRef.current[data.id];
    setUsers((oldUsers) => oldUsers.filter((user) => user.id !== data.id));
  });

  const recordStart = () => {
    Socket.emit("startRecording", {
      roomID: roomId,
    });
  };

  return (
    <div>
      <video
        style={{ width: 240, height: 240, margin: 5, backgroundColor: "black" }}
        muted
        ref={localVideoRef}
        autoPlay
      />
      <button onClick={recordStart}>녹화 시작!</button>
      {users.map((user, index) => (
        <Video key={index} email={user.email} stream={user.stream} />
      ))}
    </div>
  );
}
