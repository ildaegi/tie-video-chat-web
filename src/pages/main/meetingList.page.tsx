// import useSocket from "../../hooks/useSocket";
// import { useEffect, useState } from "react";
// import Socket from "../../utils/socket";
// import useSocketEventOn from "../../hooks/useSocketEventOn";

import { useEffect, useState } from "react";
import { PageContainer, Row } from "../../components/common";
import getMyUser from "../../services/users/getMyUser";
import { User } from "../../types/domain/user";

// interface Room {
//   title: string;
//   users: { id: string; email: string }[];
// }

export default function MeetingListPage() {
  const [myUser, setMyUser] = useState<User>();
  useEffect(() => {
    console.log("useEffect");
    (async () => {
      setMyUser(await getMyUser());
    })();
  }, []);

  // const [rooms, setRooms] = useState<Room[]>([]);

  // useSocket();

  // useSocketEventOn("getRooms", (room) => {
  //   console.log({ room });
  //   setRooms(Object.entries(room).map(([title, users]) => ({ title, users })));
  // });

  // useEffect(() => {
  //   Socket.emit("getRooms", {});
  //   const close = setInterval(() => Socket.emit("getRooms", {}), 1000);
  //   return () => clearInterval(close);
  // }, []);

  return (
    <PageContainer>
      <Row width="340px">
        <div>
          <h3>Profile</h3>
          <div></div>
          <h2>리스트 목록</h2>
          <div>{myUser?.code}</div>
          <div>{myUser?.email}</div>
          <div>{myUser?.id}</div>
        </div>
      </Row>
    </PageContainer>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p style={{ fontSize: 50 }}>
    //       <b>Tie</b>
    //     </p>

    //     <div style={{ display: "flex", flexDirection: "row" }}>
    //       {rooms.map((room, i) => (
    //         <RoomItem key={i} room={room} />
    //       ))}
    //     </div>
    //   </header>
    // </div>
  );
}

// function RoomItem({ room }: { room: Room }) {
//   const len = room.users.length;
//   const size = 50 + len * 20;
//   const fontSize = 14 + len;
//   return (
//     <div
//       style={{
//         backgroundColor: "#fff",
//         width: size,
//         height: size,
//         borderRadius: size,
//         padding: 16,
//         margin: 8,
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         flexDirection: "column",
//       }}
//     >
//       <div
//         style={{ color: "#222", fontSize: 34 + fontSize, fontWeight: "bold" }}
//       >
//         {room.title}
//       </div>

//       <div style={{ color: "#222", fontSize: fontSize }}>
//         {room.users.length}명 접속중
//       </div>
//     </div>
//   );
// }
