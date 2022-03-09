import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import Cookie from "../utils/cookie.util";

interface AuthRouteProps {
  element: ReactElement;
}

export default function AuthRoute({ element }: AuthRouteProps) {
  const isLogin = Boolean(Cookie.get("jwt"));

  return isLogin ? element : <Navigate to="/login" />;
}
