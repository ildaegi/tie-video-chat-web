import { Route, Routes } from "react-router-dom";

// import HomePage from "../pages/main/home.page";
import LoginPage from "../pages/auth/login.page";
import MeetingPage from "../pages/main/meeting.page";
import MeetingListPage from "../pages/main/meetingList.page";

import AuthRoute from "./AuthRoute";

export default function AppRoute() {
  return (
    <Routes>
      {/* 메인 홈 */}
      {/* <Route path="*" element={<HomePage />} /> */}
      <Route path="*" element={<LoginPage />} />
      <Route path="login" element={<LoginPage />} />

      {/* 방 리스트 */}
      <Route
        path="meeting"
        element={<AuthRoute element={<MeetingListPage />} />}
      />
      {/* 방 들어감 */}
      <Route
        path="meeting/:id/:email"
        element={<AuthRoute element={<MeetingPage />} />}
      />
    </Routes>
  );
}
