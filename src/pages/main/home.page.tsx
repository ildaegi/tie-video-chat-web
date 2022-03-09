import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [email, setEmail] = useState("");

  const enterRoom = () => {
    console.log({ roomId, email });
    const [_roomId, _email] = [roomId.trim(), email.trim()];
    if (_roomId && _email) {
      navigate(`/meeting/${roomId}/${email}`, { replace: true });
    } else {
      alert("방 번호와 이메일을 입력해주세요.");
    }
  };

  return (
    <div>
      <h1>자자 처음 입니다.</h1>
    </div>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p style={{ fontSize: 50 }}>
    //       <b>Tie</b>
    //     </p>

    //     <p style={{ fontSize: 19 }}>참여할 방 번호를 입력하세요</p>
    //     <input onChange={(e) => setRoomId(e.target.value)} />

    //     <p style={{ fontSize: 19 }}>이메일을 입력하세요</p>
    //     <input onChange={(e) => setEmail(e.target.value)} />

    //     <button style={{ margin: 8 }} onClick={enterRoom}>
    //       <div>참여하기</div>
    //     </button>
    //   </header>
    // </div>
  );
}
