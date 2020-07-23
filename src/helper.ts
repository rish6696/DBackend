import JWT from "jsonwebtoken";
import { jwtKeyAuth, jwtKeyRefreshToken } from "./config";
import { removeKey } from "./redisClient";
import { INVALID_AUTH_TOKEN } from "./errorConstants";

export function verifyToken(
  token: string,
  isAuth: boolean
): { status: boolean; result: string } {
  try {
    const jwtKey = isAuth === true ? jwtKeyAuth : jwtKeyRefreshToken;
    const verified = JWT.verify(token, jwtKey) as {
      userId: string;
      iat: number;
      exp: number;
    };
    return { status: true, result: verified.userId };
  } catch (err) {
    return { status: false, result: INVALID_AUTH_TOKEN };
  }
}

export async function logoutRestaurant(userId: string) {
  const res = await removeKey(userId);
}
