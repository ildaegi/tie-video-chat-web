import logo from "../logo.svg";
import { useNavigate } from "react-router-dom";
import useSocket from "../hooks/useSocket";
import { useEffect, useState } from "react";
import Socket from "../utils/socket";
import useSocketEventOn from "../hooks/useSocketEventOn";

interface Room {
  title: string;
  users: { id: string; email: string }[];
}

export default function MeetingListPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);

  useSocket();

  useSocketEventOn("getRooms", (room) => {
    console.log({ room });
    setRooms(Object.entries(room).map(([title, users]) => ({ title, users })));
  });

  useEffect(() => {
    Socket.emit("getRooms", {});
    const close = setInterval(() => Socket.emit("getRooms", {}), 1000);
    return () => clearInterval(close);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p style={{ fontSize: 50 }}>
          <b>Tie</b>
        </p>

        <div style={{ display: "flex", flexDirection: "row" }}>
          {rooms.map((room, i) => (
            <RoomItem key={i} room={room} />
          ))}
        </div>
      </header>
    </div>
  );
}

function RoomItem({ room }: { room: Room }) {
  const len = room.users.length;
  const size = 50 + len * 20;
  const fontSize = 14 + len;
  return (
    <div
      style={{
        backgroundColor: "#fff",
        width: size,
        height: size,
        borderRadius: size,
        padding: 16,
        margin: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{ color: "#222", fontSize: 34 + fontSize, fontWeight: "bold" }}
      >
        {room.title}
      </div>

      <div style={{ color: "#222", fontSize: fontSize }}>
        {room.users.length}명 접속중
      </div>
    </div>
  );
}
