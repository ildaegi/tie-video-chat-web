import { User } from "../../types/domain/user";
import Cookie from "../../utils/cookie.util";
import Request from "../../utils/request.util";
import { USER_SERVICE_URL } from "./constant.users.service";

interface getMyUserRes extends User {}

export default async function getMyUser() {
  const token = Cookie.get("jwt");

  const res = await Request.get<getMyUserRes>(USER_SERVICE_URL + "me", {
    config: { headers: { authorization: token } },
  });

  console.log({ res });

  return res;
}
