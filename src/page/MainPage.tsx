import { useState } from "react";
import logo from "../logo.svg";

export default function MainPage() {
  const [roomId, setRoomId] = useState("");

  const enterRoom = () => {
    console.log(roomId);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p style={{ fontSize: 50 }}>
          <b>Tie</b>
        </p>

        <p style={{ fontSize: 19 }}>참여할 방 번호를 입력하세요</p>
        <input onChange={(e) => setRoomId(e.target.value)} />

        <button style={{ margin: 8 }} onClick={enterRoom}>
          <div>참여하기</div>
        </button>
      </header>
    </div>
  );
}
