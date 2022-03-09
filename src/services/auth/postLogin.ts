import Request from "../../utils/request.util";
import Cookie from "../../utils/cookie.util";
import { AUTH_SERVICE_URL } from "./constant.auth.service";

export interface PostLoginReq {
  email: string;
  code: string;
}
interface PostLoginRes {
  token: { expiresIn: number; token: string };
}
export default async function postLogin({ email, code }: PostLoginReq) {
  const result = await Request.post<PostLoginRes>(AUTH_SERVICE_URL + "login", {
    data: { email, code },
  });

  if (result?.token?.token) {
    Cookie.set("jwt", "Bearer " + result.token.token, 2);
  }

  return result;
}
