import "./App.css";
import { Routes, Route } from "react-router-dom";

import MainPage from "./routes/main";
import MeetingPage from "./routes/meeting";
import MeetingListPage from "./routes/meetingList";

export default function App() {
  return (
    <Routes>
      <Route path="meeting/:id/:email" element={<MeetingPage />} />
      <Route path="meeting" element={<MeetingListPage />} />
      <Route path="*" element={<MainPage />} />
    </Routes>
  );
}
